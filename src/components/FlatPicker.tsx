import clsx from 'clsx';
import chroma from 'chroma-js';
import generate from 'tailwind-colors-generator';
import {
	RgbaStringColorPicker
} from 'react-colorful';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';

const FlatPicker = ({
	className = '',
	color,
	onChange
}: {
	className?: string;
	color: chroma.Color;
	onChange: (value: chroma.Color) => void;
}) => {
	const prevState = useRef<chroma.Color | null>(null);
	const [
		state,
		setState
	] = useState(color);

	const [
		inputValue,
		setInputValue
	] = useState('');
	
	const {
		alpha,
		hex,
		rgba,
		shades
	} = useMemo(() => {
		const colors = generate(state);

		return {
			alpha: state.alpha(),
			hex: state.hex('rgb'),
			rgba: `rgba(${state.rgba().join(',')})`,
			shades: colors.shades
		};
	}, [
		state
	]);
	
	const onChangeColor = useCallback((value: string) => {
		if (!chroma.valid(value)) {
			return;
		}

		const color = chroma(value);

		setState(color);
	}, []);

	const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}, []);

	const onCommitInputChange = useCallback(() => {
		onChangeColor(inputValue);
		setInputValue('');
	}, [
		inputValue,
		onChangeColor
	]);

	const onInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onCommitInputChange();
		}

		if (e.key === 'Escape') {
			setInputValue('');
		}
	}, [
		onCommitInputChange
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
			<RgbaStringColorPicker color={rgba}
				onChange={onChangeColor}
				style={{
					width: '100%'
				}}/>

			<input className='w-full p-2 pl-3 text-base font-semibold border rounded-lg appearance-none border-slate-200 bg-slate-100 text-slate-700 focus:outline-none focus:bg-slate-50 focus:border focus:border-slate-300'
				onBlur={onCommitInputChange}
				onChange={onInputChange}
				onKeyDown={onInputKeyDown}
				value={inputValue || hex}/>

			<div className='flex justify-center overflow-hidden rounded-md shadow-sm ring-1 ring-black/5'>
				{shades.map((shade, index) => {
					return (
						<div key={index}
							className='relative flex-grow h-5 text-center cursor-pointer'
							onClick={() => {
								onChangeColor(`rgba(${shade.rgb.join(',')},${alpha})`);
							}}
							style={{
								backgroundColor: shade.hex,
								color: shade.text.hex
							}}>
							{shade.self ? (
								<div className='absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2'
									style={{
										background: shade.text.hex
									}}/>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default FlatPicker;