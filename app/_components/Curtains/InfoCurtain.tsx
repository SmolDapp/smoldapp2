import * as Dialog from '@radix-ui/react-dialog';
import {usePathname} from 'next/navigation';
import {usePlausible} from 'next-plausible';

import {CurtainContent, CurtainTitle} from '@lib/components/Curtain';
import {IconCross} from '@lib/components/icons/IconCross';
import {PLAUSIBLE_EVENTS} from '@lib/utils/plausible';

import type {ReactElement, ReactNode} from 'react';

export function CloseCurtainButton(): ReactElement {
	return (
		<Dialog.Close className={'withRing group -mr-1 -mt-1 rounded p-1'}>
			<IconCross className={'size-4 text-neutral-600 transition-colors group-hover:text-neutral-900'} />
			<span className={'sr-only'}>{'Close'}</span>
		</Dialog.Close>
	);
}

type TCurtainElement = {
	trigger: ReactElement;
	info: ReactNode;
};
export function InfoCurtain(props: TCurtainElement): ReactElement {
	const pathname = usePathname();
	const plausible = usePlausible();

	return (
		<Dialog.Root modal={false}>
			<Dialog.Trigger
				onClick={() => plausible(PLAUSIBLE_EVENTS.OPEN_INFO_CURTAIN, {props: {curtainPage: pathname}})}>
				{props.trigger}
			</Dialog.Trigger>
			<CurtainContent>
				<aside
					style={{boxShadow: '-8px 0px 20px 0px rgba(36, 40, 51, 0.08)'}}
					className={'flex h-full flex-col bg-neutral-0 p-6'}>
					<div className={'mb-4 flex flex-row items-center justify-between'}>
						<CurtainTitle className={'font-bold'}>{'Info'}</CurtainTitle>
						<CloseCurtainButton />
					</div>
					<div className={'scrollable !-mr-4 !pr-3 text-neutral-600'}>{props.info}</div>
				</aside>
			</CurtainContent>
		</Dialog.Root>
	);
}
