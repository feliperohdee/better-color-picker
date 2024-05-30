import clsx from 'clsx';
import chroma from 'chroma-js';
import generate, {
	Shade,
	TextColor
} from 'tailwind-colors-generator';
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';

import ColorPicker from '@/components/ColorPicker';
import {
	Gradient,
	Orientation
} from '@/libs/gradientParser';

interface Stop {
	color: chroma.Color;
	length: number;
	shades: Shade[];
	text: TextColor;
}

interface GradientState {
	orientation: Orientation | undefined;
	stops: Stop[];
	type: string;
}

const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const handlerCalc = (length: number, handlerRem: number) => {
	return `calc(${length}% - ${(length / 100) * handlerRem}rem)`;
};

const toAngle = (value: GradientState) => {
	if (value.type !== 'linear-gradient') {
		return 0;
	}

	if (value.orientation?.type === 'directional') {
		switch (value.orientation.value) {
			case 'top':
				return 0;
			case 'top-right':
				return 45;
			case 'right':
				return 90;
			case 'bottom-right':
				return 135;
			case 'bottom':
				return 180;
			case 'bottom-left':
				return 225;
			case 'left':
				return 270;
			case 'top-left':
				return 315;
		}
	}

	if (value.orientation?.type === 'angular') {
		const n = Number(value.orientation.value);
	
		if (!isNaN(n)) {
			return n;
		}
	}

	return 0;
};

const toString = (value: GradientState) => {
	const stops = value.stops.map(stop => {
		return `${stop.color.hex()} ${stop.length}%`;
	});

	let result = 'bottom';

	if (
		value.orientation?.type &&
		typeof value.orientation.value === 'string'
	) {
		switch (value.orientation.type) {
			case 'angular':
				result = `${value.orientation.value}deg`;
				break;
			case 'directional':
				result = `to ${value.orientation.value}`;
				break;
			case 'shape':
				result = value.orientation.value;
				break;
		}
	}

	return `${value.type}(${result}, ${stops.join(', ')})`;
};

const XIcon = ({
	className = ''
}) => {
	return (
		<svg className={className}
			fill='none'
			stroke='currentColor'
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'>
			<path strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M6 18L18 6M6 6l12 12'/>
		</svg>
	);
};

const GradientPicker = ({
	className = '',
	colors,
	gradient,
	onChange,
	textAddColor,
	textLinear,
	textRadial
}: {
	className?: string;
	colors: chroma.Color[];
	gradient: Gradient;
	onChange: (value: GradientState) => void;
	textAddColor: string;
	textLinear: string;
	textRadial: string;
}) => {
	const changing = useRef(false);
	const click = useRef(true);
	const prevState = useRef<GradientState | null>(null);
	const [
		open,
		setOpen
	] = useState(-1);

	const [
		state,
		setState
	] = useState(() => {
		const stops = colors.reduce<Stop[]>((reduction, color, index) => {
			const stop = gradient.colorStops[index];

			if (stop) {
				let length = Number(stop.length?.value);
	
				if (isNaN(length)) {
					length = index * 100 / (colors.length - 1);
				}

				const generatedColors = generate(color);
				
				reduction = reduction.concat({
					color,
					length,
					shades: generatedColors.shades,
					text: generatedColors.text
				});
			}

			return reduction;
		}, []);

		return {
			orientation: gradient.orientation,
			stops,
			type: gradient.type
		};
	});

	const angle = useMemo(() => {
		return toAngle(state);
	}, [
		state
	]);

	const onAngleChange = useCallback((angle: string) => {
		setState(state => {
			return {
				...state,
				orientation: {
					type: 'angular',
					value: angle
				}
			};
		});
	}, []);

	const onLengthChange = useCallback((length: number, index: number) => {
		setState(state => {
			const stops = state.stops.map((stop, stopIndex) => {
				if (index === stopIndex) {
					return {
						...stop,
						length
					};
				}
	
				return stop;
			});

			return {
				...state,
				stops
			};
		});
	}, []);

	const onColorChange = useCallback((color: chroma.Color, index: number) => {
		setState(state => {
			return {
				...state,
				stops: state.stops.map((stop, stopIndex) => {
					if (index === stopIndex) {
						const generatedColors = generate(color);

						return {
							...stop,
							color,
							shades: generatedColors.shades
						};
					}
		
					return stop;
				})
			};
		});
	}, []);

	const onTypeChange = useCallback((type: 'linear-gradient' | 'radial-gradient') => {
		setState(state => {
			return {
				...state,
				orientation: type === 'linear-gradient' ? {
					type: 'directional',
					value: 'right'
				} : {
					type: 'shape',
					value: 'circle'
				},
				type
			};
		});

		setOpen(-1);
	}, []);

	const onColorPickerClick = useCallback((index: number) => {
		if (
			!click.current ||
			changing.current
		) {
			return;
		}

		if (open === index) {
			return setOpen(-1);
		}

		setOpen(index);
	}, [
		open
	]);

	const onAddStop = useCallback(() => {
		const lastStop = state.stops[state.stops.length - 1];
		const generatedColors = generate(lastStop.color, {
			combinationsShades: true
		});
		
		const complementar = generatedColors.combinations.analogous[0];
		const color = chroma(complementar.hex);
		const stopSpace = 1 / state.stops.length;
		const stops = state.stops.map(stop => {
			return {
				...stop,
				length: stop.length - (stop.length * stopSpace)
			};
		}).concat({
			color,
			length: 100,
			shades: complementar.shades,
			text: complementar.text
		});
		
		setState(state => {
			return {
				...state,
				stops
			};
		});
	}, [
		state
	]);

	const onRemoveStop = useCallback((index: number) => {
		setState(state => {
			const stops = state.stops.filter((_, stopIndex) => {
				return index !== stopIndex;
			});

			return {
				...state,
				stops
			};
		});

		setOpen(-1);
	}, []);

	useEffect(() => {
		let clientX = 0;
		let clientY = 0;
		let clientStartX = 0;
		let clientStartY = 0;

		const onStart = (e: TouchEvent | MouseEvent) => {
			clientX = clientStartX = ('touches' in e) ? e.touches[0].clientX : e.clientX;
			clientY = clientStartY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
			
			click.current = false;

			window.addEventListener('mousemove', onMove);
			window.addEventListener('touchmove', onMove);
		};

		const onMove = (e: TouchEvent | MouseEvent) => {
			clientX = ('touches' in e) ? e.touches[0].clientX : e.clientX;
			clientY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
		};

		const onEnd = () => {
			const deltaX = Math.abs(clientX - clientStartX);
			const deltaY = Math.abs(clientY - clientStartY);

			clientX = 0;
			clientY = 0;
			clientStartX = 0;
			clientStartY = 0;
			
			click.current = deltaX <= 2 && deltaY <= 2;

			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('touchmove', onMove);
		};

		const onEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setOpen(-1);
			}
		};

		window.addEventListener('mousedown', onStart);
		window.addEventListener('mouseup', onEnd);
		window.addEventListener('touchstart', onStart);
		window.addEventListener('touchend', onEnd);
		window.addEventListener('keydown', onEscape);

		return () => {
			window.removeEventListener('mousedown', onStart);
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onEnd);
			window.removeEventListener('touchstart', onStart);
			window.removeEventListener('touchmove', onMove);
			window.removeEventListener('touchend', onEnd);
			window.removeEventListener('keydown', onEscape);
		};
	}, []);

	useEffect(() => {
		if (prevState.current === state) {
			return;
		}

		prevState.current = state;

		onChange(state);
	}, [
		onChange,
		state
	]);

	return (
		<Fragment>
			{/* allow close picker when clicked outside */}
			{open >= 0 ? (
				<div className='z-50 fixed inset-0'
					onMouseDown={() => {
						setOpen(-1);
					}}/>
			) : null}
			<div className={clsx(className, 'relative z-50 space-y-3')}>
				<div className='rounded-xl w-full h-40 ring-1 ring-black/10'
					style={{
						background: GradientPicker.toString(state)
					}}/>

				<div className='flex justify-center items-center'>
					<div className='flex justify-center items-center bg-slate-50 shadow rounded-full font-medium text-slate-400 text-sm overflow-hidden ring-1 ring-black/5'>
						<button className={clsx('flex items-center px-5 py-1.5', {
							'bg-white text-slate-600': state.type === 'linear-gradient'
						})}
							onClick={() => {
								onTypeChange('linear-gradient');
							}}>
							{textLinear}
						</button>

						<button className={clsx('flex items-center px-5 py-1.5', {
							'bg-white text-slate-600': state.type === 'radial-gradient'
						})}
							onClick={() => {
								onTypeChange('radial-gradient');
							}}>
							{textRadial}
						</button>
					</div>
				</div>

				{/* angle */}
				{gradient.type === 'linear-gradient' ? (
					<div className='relative bg-slate-100 rounded-full w-full h-6'>
						{/* handler */}
						<div className='top-1/2 absolute flex justify-center items-center bg-white shadow-md rounded-full w-6 h-6 touch-none text-[9px] text-slate-600 -translate-y-1/2 pointer-events-none ring-1 ring-black/5 tabular-nums'
							style={{
								left: handlerCalc((angle / 360) * 100, 1.5)
							}}>
							{angle}
						</div>

						<input className='relative opacity-0 w-full h-full cursor-pointer appearance-none'
							max={360}
							min={0}
							onChange={e => {
								onAngleChange(e.target.value);
							}}
							step={1}
							type='range'
							value={angle}/>
					</div>
				) : null}

				{state.stops.map(({
					color,
					length,
					shades
				}, index) => {
					const hexLight = generate.hexByLuminance(70, {
						shades
					});

					const hexDark = generate.hexByLuminance(20, {
						shades
					});

					const isFirstStop = index === 0;
					const isLastStop = index === state.stops.length - 1;
					const prevStop = isFirstStop ? null : state.stops[index - 1];
					const nextStop = isLastStop ? null : state.stops[index + 1];

					return (
						<Fragment key={index}>
							<div className='flex items-center gap-1'>
								<div className='relative rounded-full w-full h-6'
									style={{
										background: `linear-gradient(to right, ${hexLight} 0%, ${hexDark} 100%)`
									}}>
									{/* first stop marker */}
									{prevStop ? (
										<div className='top-1/2 absolute bg-slate-900/20 rounded-full w-1 h-1 -translate-x-1/2 -translate-y-1/2'
											style={{
												left: `calc(${handlerCalc(prevStop.length, 1.5)} + 0.75rem)`
											}}/>
									) : null}

									{/* next stop marker */}
									{nextStop ? (
										<div className='top-1/2 absolute bg-slate-900/20 rounded-full w-1 h-1 -translate-x-1/2 -translate-y-1/2'
											style={{
												left: `calc(${handlerCalc(nextStop.length, 1.5)} + 0.75rem)`
											}}/>
									) : null}

									{/* handler overlay */}
									<div className='top-1/2 absolute flex justify-center items-center bg-white shadow-md rounded-full w-6 h-6 touch-none -translate-y-1/2 pointer-events-none ring-1 ring-black/5'
										style={{
											left: handlerCalc(length, 1.5)
										}}>
										<div className='rounded-full w-3 h-3'
											style={{
												background: color.hex('rgb')
											}}/>
										{open === index ? (
											<div className='-bottom-[1.55rem] left-1/2 absolute bg-gray-900 rounded-sm w-4 h-4 -translate-x-1/2 rotate-45'/>
										) : null}
									</div>

									{/* real handler */}
									<input className='relative bg-slate-300 opacity-0 w-full h-full cursor-pointer appearance-none'
										max={100}
										min={0}
										onChange={e => {
											const length = clamp(Number(e.target.value), prevStop?.length || 0, nextStop?.length || 100);
											
											changing.current = true;

											onLengthChange(length, index);
											setTimeout(() => {
												changing.current = false;
											}, 100);
										}}
										onMouseUp={() => {
											// wait for click.current to be resolved
											setTimeout(() => {
												onColorPickerClick(index);
											});
										}}
										onTouchEnd={() => {
											// wait for click.current to be resolved
											setTimeout(() => {
												onColorPickerClick(index);
											});
										}}
										step={1}
										type='range'
										value={length}/>
								</div>

								{state.stops.length > 2 ? (
									<button className='flex flex-shrink-0 justify-center items-center bg-slate-100 rounded-full w-6 h-6'
										onClick={() => {
											onRemoveStop(index);
										}}
										style={{
											background: generate.hexByLuminance(100, {
												shades
											}),
											color: hexDark
										}}>
										<XIcon className='w-3 h-3'/>
									</button>
								) : null}
							</div>

							{open === index ? (
								<div className='relative bg-gray-900 shadow-xl p-1 rounded-xl'>
									<button className='-top-2 -right-2 absolute flex justify-center items-center bg-gray-700 shadow-md rounded-full w-6 h-6 text-white'
										onClick={() => {
											setOpen(-1);
										}}>
										<XIcon className='w-4 h-4'/>
									</button>

									<ColorPicker className='p-3'
										color={color}
										onChange={value => {
											onColorChange(value, index);
										}}/>
								</div>
							) : null}
						</Fragment>
					);
				})}

				<button className='block bg-white shadow px-5 py-1.5 rounded-full w-full font-medium text-slate-600 text-sm overflow-hidden ring-1 ring-black/5'
					onClick={onAddStop}>
					{textAddColor}
				</button>
			</div>
		</Fragment>
	);
};

GradientPicker.toString = toString;

export default GradientPicker;