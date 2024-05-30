import {
	useState
} from 'react';

import Picker from '@/components/Picker';

const App = () => {
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
			<Picker onChange={setValue}
			value={value}/>
		</div>
	);
};

export default App;
