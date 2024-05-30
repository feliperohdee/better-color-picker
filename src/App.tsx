import Picker from '@/components/Picker';

const App = () => {
	return (
		<div className='flex items-center justify-center min-h-screen py-8 bg-slate-50'>
			<Picker onChange={value => {
				console.log('value', value);
			}}
			// value='#d7006caa'
			// value='linear-gradient(to right, #d7006c, #feb47b)'
			value='radial-gradient(circle, #d7006c 0%, #feb47b 100%, #d7006c 100%)'
			/>
		</div>
	);
};

export default App;
