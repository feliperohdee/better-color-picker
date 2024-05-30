export interface Gradient {
	colorStops: ColorStop[];
	orientation?: Orientation | Orientation[];
    type: (
		'linear-gradient' |
		'repeating-linear-gradient' |
		'radial-gradient' |
		'repeating-radial-gradient'
	);
}

export interface Orientation {
    type: (
		'directional' |
		'angular' |
		'position' |
		'shape'
	);
    value?: string | Position;
    at?: Position;
}

export interface Position {
    x?: Distance;
    y?: Distance;
}

export interface Distance {
    type: 'px' | 'em' | '%';
    value: string;
}

export interface ColorStop {
    type: 'hex' | 'rgb' | 'rgba' | 'literal';
    value: string | number[];
    length?: Distance;
}

const tokens = {
	angleValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))deg/,
	comma: /^,/,
	emValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))em/,
	endCall: /^\)/,
	extentKeywords: /^(closest\-side|closest\-corner|farthest\-side|farthest\-corner|contain|cover)/,
	hexColor: /^\#([0-9a-fA-F]+)/,
	linearGradient: /^(\-(webkit|o|ms|moz)\-)?(linear\-gradient)/i,
	literalColor: /^([a-zA-Z]+)/,
	number: /^(([0-9]*\.[0-9]+)|([0-9]+\.?))/,
	percentageValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))\%/,
	pixelValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))px/,
	positionKeywords: /^(left|center|right|top|bottom)/i,
	radialGradient: /^(\-(webkit|o|ms|moz)\-)?(radial\-gradient)/i,
	repeatingLinearGradient: /^(\-(webkit|o|ms|moz)\-)?(repeating\-linear\-gradient)/i,
	repeatingRadialGradient: /^(\-(webkit|o|ms|moz)\-)?(repeating\-radial\-gradient)/i,
	rgbColor: /^rgb/i,
	rgbaColor: /^rgba/i,
	sideOrCorner: /^to (left (top|bottom)|right (top|bottom)|top (left|right)|bottom (left|right)|left|right|top|bottom)/i,
	startCall: /^\(/
};

const defaultOrientation: {
	[key: string]: Orientation;
} = {
	'linear-gradient': {
		type: 'directional',
		value: 'bottom'
	},
	'radial-gradient': {
		type: 'shape',
		value: 'circle'
	},
	'repeating-linear-gradient': {
		type: 'directional',
		value: 'bottom'
	},
	'repeating-radial-gradient': {
		type: 'shape',
		value: 'circle'
	}
};

const parse = (() => {
	let input = '';

	const error = (msg: string): Error => {
		const err = new Error(input + ': ' + msg);

		(err as any).source = input;
		
		return err;
	};

	const getAST = (): any => {
		const ast = matchListDefinitions();

		if (input.length > 0) {
			throw error('Invalid input');
		}

		return ast;
	};

	const matchListDefinitions = (): any => {
		return matchListing(matchDefinition);
	};

	const matchDefinition = (): any => {
		return (
			matchGradient('linear-gradient', tokens.linearGradient, matchLinearOrientation) ||
			matchGradient('repeating-linear-gradient', tokens.repeatingLinearGradient, matchLinearOrientation) ||
			matchGradient('radial-gradient', tokens.radialGradient, matchListRadialOrientations) ||
			matchGradient('repeating-radial-gradient', tokens.repeatingRadialGradient, matchListRadialOrientations)
		);
	};

	const matchGradient = (gradientType: string, pattern: RegExp, orientationMatcher: () => any): any => {
		return matchCall(pattern, () => {
			const orientation = orientationMatcher();

			if (orientation) {
				if (!scan(tokens.comma)) {
					throw error('Missing comma before color stops');
				}
			}

			return {
				colorStops: matchListing(matchColorStop),
				orientation: orientation || defaultOrientation[gradientType],
				type: gradientType
			};
		});
	};

	const matchCall = (pattern: RegExp, callback: (captures: RegExpExecArray) => any): any => {
		const captures = scan(pattern);

		if (captures) {
			if (!scan(tokens.startCall)) {
				throw error('Missing (');
			}

			const result = callback(captures);

			if (!scan(tokens.endCall)) {
				throw error('Missing )');
			}

			return result;
		}
	};

	const matchLinearOrientation = (): any => {
		return matchSideOrCorner() || matchAngle();
	};

	const matchSideOrCorner = (): any => {
		return match('directional', tokens.sideOrCorner, 1);
	};

	const matchAngle = (): any => {
		return match('angular', tokens.angleValue, 1);
	};

	const matchListRadialOrientations = (): any[] | undefined => {
		let radialOrientations: any[] | undefined;
		let radialOrientation = matchRadialOrientation();
		let lookaheadCache;

		if (radialOrientation) {
			radialOrientations = [];
			radialOrientations = radialOrientations.concat(radialOrientation);
			lookaheadCache = input;
			
			if (scan(tokens.comma)) {
				const radialOrientation = matchRadialOrientation();
				
				if (radialOrientation) {
					radialOrientations = radialOrientations.concat(radialOrientation);
				} else {
					input = lookaheadCache;
				}
			}
		}

		return radialOrientations;
	};

	const matchRadialOrientation = (): any => {
		let radialType = matchCircle() || matchEllipse();

		if (radialType) {
			radialType.at = matchAtPosition();
		} else {
			const extent = matchExtentKeyword();
			if (extent) {
				radialType = extent;
				const positionAt = matchAtPosition();
				if (positionAt) {
					radialType.at = positionAt;
				}
			} else {
				const defaultPosition = matchPositioning();
				if (defaultPosition) {
					radialType = {
						at: defaultPosition,
						type: 'default-radial'
					};
				}
			}
		}

		return radialType;
	};

	const matchCircle = (): any => {
		const circle = match('shape', /^(circle)/i, 0);

		if (circle) {
			circle.style = matchLength() || matchExtentKeyword();
		}

		return circle;
	};

	const matchEllipse = (): any => {
		const ellipse = match('shape', /^(ellipse)/i, 0);

		if (ellipse) {
			ellipse.style = matchDistance() || matchExtentKeyword();
		}

		return ellipse;
	};

	const matchExtentKeyword = (): any => {
		return match('extent-keyword', tokens.extentKeywords, 1);
	};

	const matchAtPosition = (): any => {
		if (match('position', /^at/, 0)) {
			const positioning = matchPositioning();

			if (!positioning) {
				throw error('Missing positioning value');
			}

			return positioning;
		}
	};

	const matchPositioning = (): any => {
		const location = matchCoordinates();

		if (location.x || location.y) {
			return {
				type: 'position',
				value: location
			};
		}
	};

	const matchCoordinates = (): { x?: any; y?: any } => {
		return {
			x: matchDistance(),
			y: matchDistance()
		};
	};

	const matchListing = (matcher: () => any): any[] => {
		let captures = matcher();
		let result: any[] = [];

		if (captures) {
			result = result.concat(captures);
			
			while (scan(tokens.comma)) {
				captures = matcher();
				
				if (captures) {
					result = result.concat(captures);
				} else {
					throw error('One extra comma');
				}
			}
		}

		return result;
	};

	const matchColorStop = (): any => {
		const color = matchColor();

		if (!color) {
			throw error('Expected color definition');
		}

		color.length = matchDistance();
		
return color;
	};

	const matchColor = (): any => {
		return matchHexColor() || matchRGBAColor() || matchRGBColor() || matchLiteralColor();
	};

	const matchLiteralColor = (): any => {
		return match('literal', tokens.literalColor, 0);
	};

	const matchHexColor = (): any => {
		return match('hex', tokens.hexColor, 1);
	};

	const matchRGBColor = (): any => {
		return matchCall(tokens.rgbColor, () => {
			return {
				type: 'rgb',
				value: matchListing(matchNumber)
			};
		});
	};

	const matchRGBAColor = (): any => {
		return matchCall(tokens.rgbaColor, () => {
			return {
				type: 'rgba',
				value: matchListing(matchNumber)
			};
		});
	};

	const matchNumber = (): string => {
		const result = scan(tokens.number);
		
		if (result) {
			return result[1];
		}

		throw error('Expected number');
	};

	const matchDistance = (): any => {
		return match('%', tokens.percentageValue, 1) || matchPositionKeyword() || matchLength();
	};

	const matchPositionKeyword = (): any => {
		return match('position-keyword', tokens.positionKeywords, 1);
	};

	const matchLength = (): any => {
		return match('px', tokens.pixelValue, 1) || match('em', tokens.emValue, 1);
	};

	const match = (type: string, pattern: RegExp, captureIndex: number): any => {
		const captures = scan(pattern);

		if (captures) {
			return {
				type: type,
				value: captures[captureIndex]
			};
		}
	};

	const scan = (regexp: RegExp): RegExpExecArray | null => {
		const blankCaptures = /^[\n\r\t\s]+/.exec(input);

		if (blankCaptures) {
			consume(blankCaptures[0].length);
		}

		const captures = regexp.exec(input);
		
		if (captures) {
			consume(captures[0].length);
		}

		return captures;
	};

	const consume = (size: number): void => {
		input = input.slice(size);
	};

	return (code: string): Gradient[] => {
		input = code;

		return getAST();
	};
})();

export default parse;