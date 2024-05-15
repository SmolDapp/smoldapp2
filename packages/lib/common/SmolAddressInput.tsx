import React, {useCallback, useEffect, useState} from 'react';
import {cl, isAddress, toAddress, truncateHex} from '@builtbymom/web3/utils';
import {useAsyncAbortable} from '@react-hookz/web';
import {AvatarWrapper} from '@lib/common/Avatar';
import {TextTruncate} from '@lib/common/TextTruncate';
import {useAddressBook} from '@lib/contexts/useAddressBook';
import {useValidateAddressInput} from '@lib/hooks/useValidateAddressInput';
import {IconAppAddressBook} from '@lib/icons/IconApps';
import {IconChevron} from '@lib/icons/IconChevron';
import {IconCircleCheck} from '@lib/icons/IconCircleCheck';
import {IconCircleCross} from '@lib/icons/IconCircleCross';
import {IconLoader} from '@lib/icons/IconLoader';

import type {InputHTMLAttributes, ReactElement, RefObject} from 'react';
import type {TInputAddressLike} from '@lib/utils/tools.address';

type TAddressInput = {
	onSetValue: (value: Partial<TInputAddressLike>) => void;
	value: TInputAddressLike;
	inputRef: RefObject<HTMLInputElement>;
	isSimple?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

export function SmolAddressInput({
	onSetValue,
	value,
	isSimple = false,
	inputRef,
	...rest
}: TAddressInput): ReactElement {
	const {onOpenCurtain} = useAddressBook();
	const [isFocused, set_isFocused] = useState<boolean>(false);
	const {isCheckingValidity, validate} = useValidateAddressInput();
	const [{result}, actions] = useAsyncAbortable(validate, undefined);

	useEffect(() => {
		if (value.address && value.source === 'autoPopulate') {
			actions.execute(value.address);
		}
	}, [actions, value.address, value.source]);

	const onChange = (input: string): void => {
		actions.abort();
		onSetValue({label: input});
		actions.execute(input);
	};

	const getInputValue = useCallback((): string | undefined => {
		if (isFocused) {
			return value.label;
		}

		if (isAddress(value.label)) {
			return truncateHex(value.label, 5);
		}

		return value.label;
	}, [isFocused, value.label]);

	const getBorderColor = useCallback((): string => {
		if (isFocused) {
			return 'border-neutral-600';
		}
		if (value.isValid === false && value.label && value.address) {
			return 'border-red';
		}
		return 'border-neutral-400';
	}, [isFocused, value.address, value.isValid, value.label]);

	useEffect(() => {
		if (!result) {
			return;
		}
		onSetValue(result);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [result]);

	const getHasStatusIcon = useCallback((): boolean => {
		if (!value.label) {
			return false;
		}
		if (!isFocused) {
			return false;
		}
		if (value.isValid === true || value.isValid === false || isCheckingValidity) {
			return true;
		}
		return false;
	}, [value.label, value.isValid, isFocused, isCheckingValidity]);

	return (
		<div className={'group relative size-full rounded-lg'}>
			<label
				className={cl(
					'h-20 z-20 relative',
					'flex flex-row justify-between items-center cursor-text',
					'p-2 pl-4 group bg-neutral-0 rounded-lg',
					'overflow-hidden border',
					getBorderColor()
				)}>
				<div className={'relative w-full pr-2 transition-all'}>
					<div
						className={cl(
							'absolute flex flex-row gap-2 items-center transition-all right-2 z-10',
							'pointer-events-none h-full'
						)}>
						{getHasStatusIcon() ? (
							<div className={'pointer-events-none relative size-4 min-w-[16px]'}>
								<IconCircleCheck
									className={`text-green absolute size-4 transition-opacity ${
										!isCheckingValidity && value.isValid === true ? 'opacity-100' : 'opacity-0'
									}`}
								/>
								<IconCircleCross
									className={`text-red absolute size-4 transition-opacity ${
										!isCheckingValidity && value.isValid === false ? 'opacity-100' : 'opacity-0'
									}`}
								/>
								<div className={'absolute inset-0 flex items-center justify-center'}>
									<IconLoader
										className={`size-4 animate-spin text-neutral-900 transition-opacity ${
											isCheckingValidity ? 'opacity-100' : 'opacity-0'
										}`}
									/>
								</div>
							</div>
						) : null}
					</div>
					<input
						ref={inputRef}
						className={cl(
							'w-full border-none bg-transparent p-0 text-xl transition-all pr-6',
							'text-neutral-900 placeholder:text-neutral-600 caret-neutral-700',
							'focus:placeholder:text-neutral-300 placeholder:transition-colors',
							!value.label ? 'translate-y-2' : 'translate-y-0',
							isFocused ? 'translate-y-2' : 'translate-y-0'
						)}
						type={'text'}
						placeholder={'0x...'}
						autoComplete={'off'}
						autoCorrect={'off'}
						spellCheck={'false'}
						value={getInputValue()}
						onChange={e => {
							onChange(e.target.value);
						}}
						onFocus={() => {
							set_isFocused(true);
							setTimeout(() => {
								if (inputRef.current) {
									const end = value.label.length;
									inputRef.current.setSelectionRange(0, end);
									inputRef.current.scrollLeft = inputRef.current.scrollWidth;
									inputRef.current.focus();
								}
							}, 0);
						}}
						onBlur={() => {
							set_isFocused(false);
						}}
						{...rest}
					/>
					<TextTruncate
						value={(isAddress(value?.address) && toAddress(value.address)) || value.error || ''}
						className={cl(
							isFocused ? 'opacity-0' : 'opacity-100',
							isFocused ? 'translate-y-8' : 'translate-y-0',
							isFocused ? 'pointer-events-none' : 'pointer-events-auto',
							value.error ? 'text-red' : 'text-neutral-600'
						)}
					/>
				</div>
				{!isSimple && (
					<div className={'w-fit flex-1'}>
						<button
							onClick={() => onOpenCurtain(selectedEntry => onChange(selectedEntry.label))}
							className={cl(
								'flex items-center gap-4 rounded-[4px] p-4 w-22',
								'bg-neutral-200 hover:bg-neutral-300 transition-colors'
							)}>
							<div
								className={'bg-neutral-0 flex size-8 min-w-8 items-center justify-center rounded-full'}>
								{!isAddress(value.address) ? (
									<IconAppAddressBook className={'size-4 text-neutral-600'} />
								) : (
									<AvatarWrapper
										key={value.address}
										address={toAddress(value.address)}
										sizeClassname={'h-8 w-8 min-w-8'}
									/>
								)}
							</div>

							<IconChevron className={'size-4 min-w-4 text-neutral-600'} />
						</button>
					</div>
				)}
			</label>
		</div>
	);
}