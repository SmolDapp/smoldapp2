import React from 'react';

import type {ReactElement} from 'react';

function IconHeartBroken(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			viewBox={'0 0 512 512'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<path
				d={
					'M272 126.1l7.9-8.9 4.2-4.7c26-29.2 65.3-42.8 103.8-35.8c53.3 9.7 92 56.1 92 110.3v3.5c0 32.3-13.4 63.1-37 85.1L259 446.8c-.8 .7-1.9 1.2-3 1.2s-2.2-.4-3-1.2L69.1 275.5C45.4 253.5 32 222.7 32 190.4v-3.5c0-54.2 38.7-100.6 92-110.3c38.5-7 77.8 6.6 103.8 35.8l4.2 4.7 7.9 8.9V144c0 4.2 1.7 8.3 4.7 11.3l34.2 34.2-79.8 53.2c-3.7 2.5-6.2 6.4-6.9 10.9s.5 8.9 3.3 12.4l64 80c5.5 6.9 15.6 8 22.5 2.5s8-15.6 2.5-22.5l-53.1-66.4 81.5-54.3c4-2.7 6.6-7 7-11.7s-1.2-9.5-4.6-12.9L272 137.4V126.1zM393.7 45.1c-40.9-7.4-82.6 3.2-114.7 28.4c-1.8 1.4-3.6 2.9-5.4 4.5c-4.7 4.1-9.1 8.4-13.3 13.1L256 95.9l-4.2-4.7c-5.8-6.5-12-12.4-18.7-17.6C201 48.4 159.3 37.7 118.3 45.1C49.8 57.6 0 117.3 0 186.9v3.5c0 36 13.1 70.6 36.6 97.5c3.4 3.8 6.9 7.5 10.7 11l184 171.3c6.7 6.3 15.6 9.7 24.8 9.7c8 0 15.8-2.7 22.1-7.5c.9-.7 1.8-1.4 2.6-2.2L464.8 299c3.8-3.5 7.3-7.2 10.7-11C498.9 261 512 226.4 512 190.4v-3.5c0-69.6-49.8-129.3-118.3-141.8z'
				}
				fill={'currentcolor'}
			/>
		</svg>
	);
}

export default IconHeartBroken;