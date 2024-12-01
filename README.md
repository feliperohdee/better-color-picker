# 🎨 Better Color Picker

A powerful and intuitive color picker React component with support for both solid colors and gradients, featuring intelligent color harmony generation powered by tailwind-colors-generator.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/-Vitest-729B1B?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Color Picker Demo](https://feliperohde.s3.us-east-1.amazonaws.com/color-picker/cp-2.png)
![Color Picker Demo](https://feliperohde.s3.us-east-1.amazonaws.com/color-picker/cp-1.png)
![Color Picker Demo](https://feliperohde.s3.us-east-1.amazonaws.com/color-picker/cp-3.png)

Try it live in our [Storybook](https://feliperohde.s3.us-east-1.amazonaws.com/color-picker-storybook/index.html) or check the [Demo](https://feliperohde.s3.us-east-1.amazonaws.com/color-picker/index.html)!

## ✨ Features

- 🎯 Single color picker with RGB/HSL support
- 🌈 Linear and radial gradient generation
- 🔄 Multiple color stop management
- 🎨 Smart color harmonies (complementary, analogous, etc.)
- 📱 Mobile-friendly and responsive

## 📦 Installation

```bash
npm install better-color-picker
# or
yarn add better-color-picker
```

## 🚀 Quick Start

```jsx
import 'better-color-picker/style.css';
import { useState } from 'react';
import Picker from 'better-color-picker';

const Demo = () => {
  const [value, setValue] = useState('#d7006c');
  
  return (
    <div style={{ background: value }}>
      <Picker
        className="shadow-xl rounded-3xl max-w-[300px]"
        onChange={setValue}
        value={value}
      />
    </div>
  );
};
```

## 🎨 Gradient Support

Create beautiful gradients with multiple color stops:

```jsx
const [value, setValue] = useState(
  'linear-gradient(to right, #d7006c, #feb47b, #aab47b, #af706c)'
);
```

## 🛠️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Current color/gradient value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `className` | `string` | `''` | Additional CSS classes |
| `textAddColor` | `string` | `'Add Color'` | Add color button text |
| `textLinear` | `string` | `'Linear'` | Linear gradient text |
| `textRadial` | `string` | `'Radial'` | Radial gradient text |
| `textColor` | `string` | `'Color'` | Color mode text |
| `textGradient` | `string` | `'Gradient'` | Gradient mode text |

## 🎯 Examples

### Basic Color Picker
```jsx
<Picker onChange={color => console.log('Selected color:', color)} />
```

### Gradient Picker with Custom Labels
```jsx
<Picker
  value="linear-gradient(90deg, #ff0000, #00ff00)"
  onChange={setValue}
  textLinear="Horizontal"
  textRadial="Circular"
  textAddColor="New Color"
/>
```

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## 👨‍💻 Author

**Felipe Rohde**
* Twitter: [@felipe_rohde](https://twitter.com/felipe_rohde)
* Github: [@feliperohdee](https://github.com/feliperohdee)
* Email: feliperohdee@gmail.com
