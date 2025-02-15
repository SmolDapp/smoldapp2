'use client';

import {BalancesCurtainContextApp} from '@lib/contexts/useBalancesCurtain';
import {SendContextApp} from 'app/(apps)/send/contexts/useSendContext';
import {Send} from 'app/(apps)/send/send';

import type {ReactElement} from 'react';

export default function SendPage(): ReactElement {
	return (
		<SendContextApp>
			<BalancesCurtainContextApp>
				<Send />
			</BalancesCurtainContextApp>
		</SendContextApp>
	);
}
