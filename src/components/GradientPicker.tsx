import clsx from 'clsx';
import chroma from 'chroma-js';
import generate, {
	Shade
} from 'tailwind-colors-generator';
import React, {
	Fragment,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';

import FlatPicker from '@/components/FlatPicker';
import {
	Gradient,
	Orientation
} from '@/libs/gradient-parser';

interface Stop {
	color: chroma.Color;
	length: number;
	shades: Shade[];
}

interface GradientState {
	orientation: Orientation | Orientation[] | undefined;
	stops: Stop[];
	type: string;
}

const GradientPicker = ({
	className = '',
	colors,
	gradient,
	onChange
}: {
	className?: string;
	colors: chroma.Color[];
	gradient: Gradient;
	onChange: (value: GradientState) => void;
}) => {
	const click = useRef(true);
	const clickTimeout = useRef<any | null>(null);
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
					shades: generatedColors.shades
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

	const onLengthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		click.current = false;

		setState(state => {
			return {
				...state,
				stops: state.stops.map((stop, stopIndex) => {
					if (index === stopIndex) {
						return {
							...stop,
							length: Number(e.target.value)
						};
					}
		
					return stop;
				})
			};
		});

		clearTimeout(clickTimeout.current!);
		clickTimeout.current = setTimeout(() => {
			click.current = true;
		}, 800);
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
	}, []);

	const onColorPickerClick = useCallback((index: number) => {
		if (!click.current) {
			return;
		}

		if (open === index) {
			return setOpen(-1);
		}

		setOpen(index);
	}, [
		open
	]);

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
		<div className={clsx(className, 'space-y-3')}>
			<div className='w-full h-40 rounded-xl ring-1 ring-black/10'
				style={{
					background: GradientPicker.toString(state)
				}}/>

			<div className='flex items-center justify-center'>
				<div className='flex items-center justify-center overflow-hidden font-bold rounded-full bg-slate-200 text-slate-400'>
					<button className={clsx('flex items-center px-4 py-1', {
						'bg-slate-300 text-slate-600': state.type === 'linear-gradient'
					})}
						onClick={() => {
							onTypeChange('linear-gradient');
						}}>
						Linear
					</button>

					<button className={clsx('flex items-center px-4 py-1', {
						'bg-slate-300 text-slate-600': state.type === 'radial-gradient'
					})}
						onClick={() => {
							onTypeChange('radial-gradient');
						}}>
						Radial
					</button>
				</div>
			</div>

			{state.stops.map(({
				color,
				shades,
				length
			}, index) => {
				const selfShadeIndex = shades.findIndex(shade => {
return shade.self;
});
				const shadeMin = selfShadeIndex <= 2 ? selfShadeIndex : 2;
				const shadeMax = selfShadeIndex <= 2 ? Math.min(shadeMin + 4, shades.length-1) : selfShadeIndex;

				return (
					<Fragment key={index}>
						<div className='relative w-full h-6 rounded-full'
							style={{
								background: `linear-gradient(to right, ${shades[shadeMin].hex} 0%, ${shades[shadeMax].hex} 100%)`
							}}>
							<div className='absolute flex items-center justify-center w-6 h-6 -translate-y-1/2 bg-white rounded-full shadow-md opacity-100 pointer-events-none top-1/2 ring-1 ring-black/5'
								style={{
									left: `calc(${length}% - ${(length / 100) * 1.5}rem)`
								}}>
								<div className='w-3 h-3 rounded-full'
									style={{
										background: color.hex('rgb')
									}}/>
								{open === index ? (
									<div className='absolute w-4 h-4 rotate-45 -translate-x-1/2 bg-gray-900 rounded-sm -bottom-[1.55rem] left-1/2'/>
								) : null}
							</div>

							<input className='relative w-full h-full opacity-0 appearance-none cursor-pointer'
								max={100}
								min={0}
								onChange={e => {
									onLengthChange(e, index);
								}}
								onClick={() => {
									onColorPickerClick(index);
								}}
								step={1}
								type='range'
								value={length}/>
						</div>

						{open === index ? (
							<div className='relative p-1 bg-gray-900 shadow-xl rounded-xl'>
								<FlatPicker className='p-3'
									color={color}
									onChange={value => {
										onColorChange(value, index);
									}}/>
							</div>
						) : null}
					</Fragment>
				);
			})}
		</div>
	);
};

GradientPicker.toString = (value: GradientState) => {
	const stops = value.stops.map(stop => {
		return `${stop.color.hex()} ${stop.length}%`;
	});

	let orientation = Array.isArray(value.orientation) ? value.orientation[0] : value.orientation;
	let orientationResult = 'to bottom';

	if (
		orientation?.type &&
		typeof orientation.value === 'string'
	) {
		switch (orientation.type) {
			case 'angular':
				orientationResult = `${orientation.value}deg`;
				break;
			case 'directional':
				orientationResult = `to ${orientation.value}`;
				break;
			case 'shape':
				orientationResult = orientation.value;
				break;
		}
	}

	return `${value.type}(${orientationResult}, ${stops.join(', ')})`;
};

export default GradientPicker;