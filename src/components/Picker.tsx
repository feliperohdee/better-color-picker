import chroma from 'chroma-js';
import {
	useMemo
} from 'react';

import FlatPicker from '@/components/FlatPicker';
import GradientPicker from '@/components/GradientPicker';
import gradientParser, {
	Gradient
} from '@/libs/gradient-parser';

const likeGradient = (value: string) => {
	return value.includes('gradient');
};

const Picker = ({
	defaultValue = '#fff',
	onChange,
	value = ''
}: {
	defaultValue?: string;
	onChange: (value: string) => void;
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

	return (
		<div className='w-[300px]'
			onClick={() => {
				onChange(value);
			}}>
			{type === 'color' ? (
				<FlatPicker className='max-w-[300px] bg-white rounded-3xl shadow-xl px-5 pt-5 pb-4 ring-1 ring-black/10'
					onChange={value => {
						onChange(value.css());
					}}
					color={colors[0]}/>
			) : null}
			
			{type === 'gradient' ? (
				<GradientPicker className='max-w-[300px] bg-white rounded-3xl shadow-xl px-5 pt-5 pb-4 ring-1 ring-black/10'
					colors={colors}
					gradient={gradient!}
					onChange={value => {
						onChange(GradientPicker.toString(value));
					}}/>
			) : null}
		</div>
	);
};

export default Picker;