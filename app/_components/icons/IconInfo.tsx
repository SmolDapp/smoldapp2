import React from 'react';

import type {ReactElement} from 'react';

export function IconInfoLight(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			viewBox={'0 0 512 512'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<path
				d={
					'M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM208 352c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H272V240c0-8.8-7.2-16-16-16H216c-8.8 0-16 7.2-16 16s7.2 16 16 16h24v96H208zm48-168a24 24 0 1 0 0-48 24 24 0 1 0 0 48z'
				}
				fill={'currentcolor'}
			/>
		</svg>
	);
}
