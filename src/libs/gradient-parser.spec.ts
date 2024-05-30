import {
	describe,
	expect,
	it
} from 'vitest';

import parse from './gradient-parser';

describe('libs/gradient-parser.ts', () => {
	describe('single color', () => {
		it('should parse', () => {
			try {
				parse('#feb47b');

				expect.fail();
			} catch (err) {
				expect((err as Error).message).toEqual('#feb47b: Invalid input');
			}
		});
	});
	
	describe('linear gradient', () => {
		it('should parse', () => {
			const ast = parse('linear-gradient(#ff7e5f, #feb47b)');
	
			expect(ast).toEqual([{
                colorStops: [{
                    type: 'hex',
                    value: 'ff7e5f'
                }, {
                    type: 'hex',
                    value: 'feb47b'
                }],
                orientation: {
                    type: 'directional',
                    value: 'bottom'
                },
                type: 'linear-gradient'
            }]);
		});

		it('should parse with orientation', () => {
			const ast = parse('linear-gradient(to right, #ff7e5f, #feb47b)');
	
			expect(ast).toEqual([{
                colorStops: [{
                    type: 'hex',
                    value: 'ff7e5f'
                }, {
                    type: 'hex',
                    value: 'feb47b'
                }],
                orientation: {
                    type: 'directional',
                    value: 'right'
                },
                type: 'linear-gradient'
            }]);
		});
	});

	describe('radial gradient', () => {
		it('should parse', () => {
			const ast = parse('radial-gradient(#ff7e5f, #feb47b)');
	
			expect(ast).toEqual([{
                colorStops: [{
                    type: 'hex',
                    value: 'ff7e5f'
                }, {
                    type: 'hex',
                    value: 'feb47b'
                }],
                orientation: {
                    type: 'shape',
                    value: 'circle'
                },
                type: 'radial-gradient'
            }]);
		});

		it('should parse with orientation', () => {
			const ast = parse('radial-gradient(circle, #ff7e5f, #feb47b)');
	
			expect(ast).toEqual([{
                colorStops: [{
                    type: 'hex',
                    value: 'ff7e5f'
                }, {
                    type: 'hex',
                    value: 'feb47b'
                }],
                orientation: [{
                    type: 'shape',
                    value: 'circle'
                }],
                type: 'radial-gradient'
            }]);
		});
	});
});
