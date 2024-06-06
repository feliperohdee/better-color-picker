
# Better Color Picker

### Usage

```jsx
import 'better-color-picker/style.css';

import { useState } from 'react';
import Picker from 'better-color-picker';

const Demo = () => {
  const [value, setValue] = useState('linear-gradient(to right, #d7006c, #feb47b, #aab47b, #af706c)');

  return (
    <div className='flex justify-center items-center bg-slate-50 py-8 min-h-dvh' style={{ background: value }}>
      <Picker 
        className='shadow-xl rounded-3xl max-w-[300px] ring-1 ring-black/10' 
        onChange={setValue} 
        value={value}
      />
    </div>
  );
};

export default Demo;
```

### Props

- `className`: Custom class names for additional styling.
- `onChange`: Callback function triggered when the selected color/gradient changes.
- `value`: The current value of the selected color/gradient.

You can customize the `Picker` component by modifying the following props:

- `textAddColor`: Text for the "Add Color" button.
- `textLinear`: Text for the "Linear" gradient option.
- `textRadial`: Text for the "Radial" gradient option.
- `textColor`: Text for the "Color" label.
- `textGradient`: Text for the "Gradient" label.

