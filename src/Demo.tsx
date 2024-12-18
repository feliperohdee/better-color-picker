import '@/style.css';

import {
	useState
} from 'react';

import Picker from '@/components/Picker';

const Demo = () => {
	const [	
		value,
		setValue
	// ] = useState('#d7006c');
	] = useState('linear-gradient(to right, #d7006c, #feb47b, #aab47b, #af706c)');

	return (
		<div className='flex justify-center items-center bg-slate-50 py-8 min-h-dvh'
			style={{
				background: value
			}}>
			<Picker className='shadow-xl rounded-3xl max-w-[300px] ring-1 ring-black/10'
				onChange={setValue}
				// textAddColor='Adicionar Cor'
				// textLinear='Linear'
				// textRadial='Radial'
				// textColor='Cor'
				// textGradient='Gradiente'
				value={value}/>
		</div>
	);
};

export default Demo;