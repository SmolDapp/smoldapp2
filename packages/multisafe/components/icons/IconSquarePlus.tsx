import React from 'react';

import type {ReactElement} from 'react';

function IconSquarePlus(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			viewBox={'0 0 448 512'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<path
				d={
					'M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM208 352V272H128c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V160c0-8.8 7.2-16 16-16s16 7.2 16 16v80h80c8.8 0 16 7.2 16 16s-7.2 16-16 16H240v80c0 8.8-7.2 16-16 16s-16-7.2-16-16z'
				}
				fill={'currentcolor'}
			/>
		</svg>
	);
}

export default IconSquarePlus;
