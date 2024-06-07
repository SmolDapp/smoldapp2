import {toAddress, toNormalizedValue} from '@builtbymom/web3/utils';

import type {TAddress, TNormalizedBN} from '@builtbymom/web3/types';
import type {TAllowance, TAllowances, TExpandedAllowance} from '@lib/types/Revoke';

export const filterDuplicateEvents = (events: TAllowances): TAllowances => {
	// const nonEmpty = events.filter(item => (item.args.value as bigint) > BigInt(0));
	const noDuplicate = events.filter(
		(item, index, self) =>
			self.findIndex(t => `${t.blockNumber}_${t.logIndex}` === `${item.blockNumber}_${item.logIndex}`) === index
	);
	return noDuplicate;
};

/**************************************************************************************************
 ** This utility assists us in sorting approval events based on their blockNumber to obtain the
 ** most recent ones and filter out those with null values. If block numbers are the same, we're
 ** supposed to compare them by logIndex.
 *************************************************************************************************/
export const getLatestNotEmptyEvents = (approvalEvents: TAllowances): TAllowances => {
	const filteredEvents = approvalEvents.reduce((acc: {[key: string]: TAllowance}, event: TAllowance) => {
		const key = `${event.address}-${event.args.sender}`;
		if (
			!acc[key] ||
			event.blockNumber > acc[key].blockNumber ||
			(event.blockNumber === acc[key].blockNumber && event.logIndex > acc[key].logIndex)
		) {
			acc[key] = event;
		}
		return acc;
	}, {});

	const resultArray: TAllowances = filterDuplicateEvents(Object.values(filteredEvents));

	return resultArray;
};

/**************************************************************************************************
 ** Although labeled as "unlimited," allowances are not truly limitless. When set as unlimited,
 ** they are assigned the maximum value of uint256. However, as the contract utilizes tokens,
 ** the unlimited allowance diminishes. Hence, we must recognize an "unlimited" allowance as
 ** a very large yet variable quantity.
 *************************************************************************************************/
export const isUnlimitedBN = (value: bigint, decimals: number): boolean => {
	return toNormalizedValue(value as bigint, decimals) > Math.pow(10, 9);
};

/**************************************************************************************************
 ** The same as unlimited bigint we want to know if the number is large enough to be called
 ** unlimited.
 **************************************************************************************************/
export const isUnlimitedNumber = (value: number): boolean => {
	return value > Math.pow(10, 10);
};

/**************************************************************************************************
 ** To get total amount at risk we should summarize all values*prices and make sure that summ
 ** isn't bigger that balance of the token.
 *************************************************************************************************/
export const getTotalAmountAtRisk = (
	allowances: TExpandedAllowance[],
	prices?: {[key: TAddress]: TNormalizedBN}
): number => {
	if (!prices) {
		return 0;
	}
	/**********************************************************************************************
	 * Here we take unique allowances by token address.
	 *********************************************************************************************/
	const uniqueAllowancesByToken: TExpandedAllowance[] = [
		...new Map(
			allowances?.map(item => [
				item.address,
				{
					...item
				}
			])
		).values()
	];

	let sum = 0;
	/**********************************************************************************************
	 ** Then for each individual token we sum up all amounts in usd and if this amount is greater
	 ** than the balance, we use balance instead. After that we sum up all the token amounts
	 ** together.
	 *********************************************************************************************/
	for (const allowance of uniqueAllowancesByToken) {
		const arr = allowances.filter(item => item.address === allowance.address);
		const total = arr.reduce((sum, curr) => {
			const amountInUSD =
				toNormalizedValue(curr.args.value as bigint, curr.decimals) > curr.balanceOf.normalized
					? curr.balanceOf.normalized * prices[toAddress(curr.address)].normalized
					: toNormalizedValue(curr.args.value as bigint, curr.decimals) *
						prices[toAddress(curr.address)].normalized;
			return sum + amountInUSD;
		}, 0);
		if (total >= allowance.balanceOf.normalized) {
			sum = sum + allowance.balanceOf.normalized * prices[toAddress(allowance.address)].normalized;
		} else {
			sum = sum + total;
		}
	}
	return sum;
};
