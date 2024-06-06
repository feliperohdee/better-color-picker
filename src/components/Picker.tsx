import clsx from 'clsx';
import chroma from 'chroma-js';
import generate from 'tailwind-colors-generator';
import React, {
	useCallback,
	useMemo
} from 'react';

import ColorPicker from '@/components/ColorPicker';
import GradientPicker from '@/components/GradientPicker';
import gradientParser, {
	Gradient
} from '@/libs/gradientParser';

const likeGradient = (value: string) => {
	return value.includes('gradient');
};

const Picker = ({
	allowChangeType = true,
	className = '',
	defaultValue = '#fff',
	onChange,
	textAddColor = 'Add Color',
	textColor = 'Color',
	textGradient = 'Gradient',
	textLinear = 'Linear',
	textRadial = 'Radial',
	style,
	value = ''
}: {
	allowChangeType?: boolean;
	className?: string;
	defaultValue?: string;
	onChange: (value: string) => void;
	textAddColor?: string;
	textColor?: string;
	textGradient?: string;
	textLinear?: string;
	textRadial?: string;
	style?: React.CSSProperties;
	value?: string;
}) => {
	const {
		colors,
		gradient,
		type
	} = useMemo<{
		colors: chroma.Color[];
		gradient: Gradient | null;
		type: 'color' | 'gradient';
	}>(() => {
		let innerValue = value;

		if (!innerValue) {
			innerValue = defaultValue || '#fff';
		}

		if (likeGradient(innerValue)) {
			try {
				const gradients = gradientParser(innerValue);
				const gradient = gradients[0];
				const colors = gradient.colorStops.reduce((reduction, stop) => {
					if (chroma.valid(stop.value)) {
						if (Array.isArray(stop.value)) {
							reduction = reduction.concat(chroma(`rgba(${stop.value.join(',')})`));
						} else {
							reduction = reduction.concat(chroma(`#${stop.value}`));
						}
					} else {
						reduction = reduction.concat(chroma('#fff'));
					}

					return reduction;

				}, [] as chroma.Color[]);

				return {
					colors,
					gradient,
					type: 'gradient'
				};
			} catch(err) {
				// suppress
			}
		}

		if (!chroma.valid(innerValue)) {
			return {
				colors: [
					chroma('#fff')
				],
				gradient: null,
				type: 'color'
			};
		}

		return {
			colors: [
				chroma(innerValue)
			],
			gradient: null,
			type: 'color'
		};
	}, [
		defaultValue,
		value
	]);

	const onTypeChange = useCallback((type: 'color' | 'gradient') => {
		if (type === 'color') {
			onChange(colors[0].css());
		} else {
			let generatedColors = generate(colors[0]);
			let restColors = generatedColors.combinations.analogous.slice(0, 1)
				.map(color => {
					return color.hex;
				});

			if (generatedColors.hex === restColors.join(', ')) {
				const hexLight = generate.hexByLuminance(70, {
					shades: generatedColors.shades
				});

				const hexDark = generate.hexByLuminance(20, {
					shades: generatedColors.shades
				});

				restColors = hexDark === generatedColors.hex ? [
					hexLight
				] : [
					hexDark
				];
			}

			onChange(`linear-gradient(to right, ${generatedColors.hex}, ${restColors.join(', ')})`);
		}
	}, [
		colors,
		onChange
	]);

	return (
		<div className={clsx('w-full bg-white px-5 pt-5 pb-4 select-none touch-none', className)}
			onClick={e => {
				e.preventDefault();
				e.stopPropagation();
			}}
			style={style}>
			{/* selector */}
			{allowChangeType ? (
				<div className='flex justify-center items-center mb-3'>
					<div className='flex justify-center items-center bg-slate-50 shadow rounded-full font-medium text-slate-400 text-sm overflow-hidden ring-1 ring-black/5'>
						<button className={clsx('flex items-center px-5 py-1.5', {
							'bg-white text-slate-600': type === 'color'
						})}
							onClick={() => {
								onTypeChange('color');
							}}>
							{textColor}
						</button>

						<button className={clsx('flex items-center px-5 py-1.5', {
							'bg-white text-slate-600': type === 'gradient'
						})}
							onClick={() => {
								onTypeChange('gradient');
							}}>
							{textGradient}
						</button>
					</div>
				</div>
			) : null}

			{type === 'color' ? (
				<ColorPicker onChange={value => {
						onChange(value.css());
					}}
					color={colors[0]}/>
			) : null}
			
			{type === 'gradient' ? (
				<GradientPicker colors={colors}
					gradient={gradient!}
					onChange={value => {
						onChange(GradientPicker.toString(value));
					}}
					textAddColor={textAddColor}
					textLinear={textLinear}
					textRadial={textRadial}/>
			) : null}
		</div>
	);
};

export default Picker;