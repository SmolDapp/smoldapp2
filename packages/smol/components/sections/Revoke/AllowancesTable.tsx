import {Fragment, type ReactElement, useCallback} from 'react';
import IconChevronPlain from 'packages/lib/icons/IconChevronPlain';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {cl, formatAmount, isAddress, toAddress} from '@builtbymom/web3/utils';
import {EmptyView} from '@lib/common/EmptyView';
import {IconSpinner} from '@lib/icons/IconSpinner';

import {AllowanceItem} from './AllowanceItem';
import {AllowanceRow} from './AllowanceRow';
import {useAllowances} from './useAllowances';
import {useSortedAllowances} from './useSortedAllowances';

import type {TSortDirection} from '@builtbymom/web3/types';
import type {TAllowancesTableProps, TExpandedAllowance, TRevokeSortBy} from '@lib/types/Revoke';

/**********************************************************************************************
 ** Columns of allowance table.
 *********************************************************************************************/
const tableColumns = [
	{
		value: 'token',
		title: 'Asset',
		isSortable: true,
		thClassName: 'font-light text-neutral-500',
		btnClassName: 'flex items-center transition-colors hover:text-neutral-800 group'
	},
	{
		value: 'amount',
		title: 'Amount',
		isSortable: true,
		thClassName: 'flex justify-end font-light text-neutral-500',
		btnClassName: 'flex items-center group transition-colors hover:text-neutral-800'
	},
	{
		value: 'spender',
		title: 'Spender',
		isSortable: true,
		thClassName: 'px-6 font-light text-neutral-500',
		btnClassName: 'flex items-center transition-colors hover:text-neutral-800 group justify-end'
	},
	{isSortable: false, thClassName: 'px-6 font-medium'}
];

function TokenFetchingLoader(): ReactElement {
	const {isDoneWithInitialFetch, allowanceFetchingFromBlock, allowanceFetchingToBlock, isLoadingInitialDB} =
		useAllowances();

	const getMessage = (): string => {
		if (allowanceFetchingToBlock === 0n) {
			return 'Analyzing past blocks ...';
		}

		if (isLoadingInitialDB && isDoneWithInitialFetch) {
			return 'Double-checking everything...';
		}
		return `Analyzing past blocks ${formatAmount((Number(allowanceFetchingFromBlock) / Number(allowanceFetchingToBlock)) * 100, 2, 2)}%`;
	};

	if (isDoneWithInitialFetch && !isLoadingInitialDB) {
		return <Fragment />;
	}

	return (
		<div className={'mt-10 flex flex-col items-center justify-center gap-4'}>
			<IconSpinner className={'size-6'} />
			<div className={'relative h-2 w-full overflow-hidden rounded-lg bg-neutral-300'}>
				<div
					className={'bg-primary absolute inset-y-0 left-0 size-full'}
					style={{
						width: `${(Number(allowanceFetchingFromBlock) / Number(allowanceFetchingToBlock || 1)) * 100}%`,
						transition: 'width 0.5s',
						zIndex: 1031
					}}
				/>
			</div>
			<p className={'text-xs text-neutral-600'}>{getMessage()}</p>
		</div>
	);
}

export const AllowancesTable = ({revoke, prices}: TAllowancesTableProps): ReactElement => {
	const {filteredAllowances: allowances, isLoading, isDoneWithInitialFetch, isLoadingInitialDB} = useAllowances();
	const isFetchingData = !isDoneWithInitialFetch || isLoading || isLoadingInitialDB;
	const hasNothingToRevoke = (!allowances || allowances.length === 0) && !isFetchingData;
	const {address, onConnect} = useWeb3();

	const {sortedAllowances} = useSortedAllowances(allowances || []);

	if (!isAddress(address)) {
		return (
			<div className={'max-w-108'}>
				<EmptyView onConnect={onConnect} />
			</div>
		);
	}
	if (hasNothingToRevoke) {
		return (
			<div className={'flex w-full justify-center text-neutral-600'}>
				<p>{'Nothing to revoke!'}</p>
			</div>
		);
	}

	if (isFetchingData) {
		return <TokenFetchingLoader />;
	}

	return (
		<>
			<table
				className={
					'hidden w-full border-separate border-spacing-y-4 text-left text-sm text-gray-500 md:table md:w-full rtl:text-right dark:text-gray-400'
				}>
				<TableHeader allowances={sortedAllowances || []} />
				{sortedAllowances && sortedAllowances?.length > 0 && (
					<tbody
						suppressHydrationWarning
						className={'w-full'}>
						{sortedAllowances?.map(item => (
							<AllowanceRow
								key={`${item.blockNumber}-${item.logIndex}`}
								allowance={item}
								revoke={revoke}
								price={prices?.[toAddress(item.address)]}
							/>
						))}
					</tbody>
				)}
			</table>
			<div className={'flex flex-col gap-y-2 md:hidden'}>
				{allowances?.map(item => (
					<AllowanceItem
						key={`${item.blockNumber}-${item.logIndex}`}
						revoke={revoke}
						allowance={item}
						price={prices?.[toAddress(item.address)]}
					/>
				))}
			</div>
		</>
	);
};

export const TableHeader = ({allowances}: {allowances: TExpandedAllowance[]}): ReactElement => {
	const {sortBy, sortDirection, onChangeSort} = useSortedAllowances(allowances || []);

	/**********************************************************************************************
	 ** This toggleSortDirection function changes sort direction between asc, desc and 'no-sort'.
	 *********************************************************************************************/
	const toggleSortDirection = (newSortBy: string): TSortDirection => {
		if (sortBy === newSortBy) {
			if (sortDirection === '') {
				return 'desc';
			}
			if (sortDirection === 'desc') {
				return 'asc';
			}
			if (sortDirection === 'asc') {
				return '';
			}
		}
		return 'desc';
	};

	/**********************************************************************************************
	 ** This function triggers onChangeSort and changes sortDirection and sortBy.
	 *********************************************************************************************/
	const onSort = useCallback(
		(newSortBy: string, newSortDirection: string): void => {
			onChangeSort(newSortDirection as TSortDirection, newSortBy as TRevokeSortBy);
		},
		[onChangeSort]
	);

	/**********************************************************************************************
	 ** This renderChevron function returns the correct icon, according to current sort state.
	 *********************************************************************************************/
	const renderChevron = useCallback(
		(shouldSortBy: boolean): ReactElement => {
			if (shouldSortBy && sortDirection === 'desc') {
				return <IconChevronPlain className={'size-4 min-w-[16px] cursor-pointer text-neutral-800'} />;
			}
			if (shouldSortBy && sortDirection === 'asc') {
				return (
					<IconChevronPlain className={'size-4 min-w-[16px] rotate-180 cursor-pointer text-neutral-800'} />
				);
			}
			return (
				<IconChevronPlain
					className={
						'size-4 min-w-[16px] cursor-pointer text-neutral-600 transition-colors group-hover:text-neutral-800'
					}
				/>
			);
		},
		[sortDirection]
	);
	return (
		<thead className={'w-full text-xs'}>
			<tr>
				{tableColumns.map(item => (
					<th className={item.thClassName}>
						<div className={cl(item.value === 'spender' ? 'flex justify-end' : '')}>
							<button
								className={cl(item.btnClassName, sortBy === item.value ? 'text-neutral-800' : '')}
								onClick={(): void => onSort(item.value!, toggleSortDirection(item.value!))}>
								<p>{item.title}</p>
								{item.isSortable && renderChevron(sortBy === item.value)}
							</button>
						</div>
					</th>
				))}
			</tr>
		</thead>
	);
};
