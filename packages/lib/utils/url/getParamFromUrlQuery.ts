import {isString} from '@lib/types/utils';

import type {ParsedUrlQuery} from 'querystring';

type TGetParamFromUrlQuery<TDefault, TResult> = (key: string, defaultValue?: TDefault) => TResult;

type TGetStringParamFromUrlQuery = TGetParamFromUrlQuery<string | undefined, string | undefined>;
function getStringParamFromUrlQuery(query: ParsedUrlQuery): TGetStringParamFromUrlQuery {
	return (key: string, defaultValue?: string) => {
		const param = query[key];
		if (isString(param) && param.length > 0) {
			return param;
		}
		return defaultValue;
	};
}

type TGetNumberParamFromUrlQuery = TGetParamFromUrlQuery<number | undefined, number | undefined>;
function getNumberParamFromUrlQuery(query: ParsedUrlQuery): TGetNumberParamFromUrlQuery {
	return (key: string, defaultValue?: number) => {
		const param = query[key];
		if (isString(param)) {
			const number = Number(param);
			if (!Number.isNaN(number)) {
				return number;
			}
		}
		return defaultValue;
	};
}

type TGetArrayParamFromUrlQuery = TGetParamFromUrlQuery<[] | undefined, string[] | undefined>;
function getArrayParamFromUrlQuery(query: ParsedUrlQuery): TGetArrayParamFromUrlQuery {
	return (key: string, defaultValue?: []) => {
		const param = query[key];
		if (Array.isArray(param)) {
			return param;
		}
		if (isString(param)) {
			return param.split(',');
		}
		return defaultValue;
	};
}

export function getParamFromUrlQuery(query: ParsedUrlQuery): {
	string: TGetStringParamFromUrlQuery;
	number: TGetNumberParamFromUrlQuery;
	array: TGetArrayParamFromUrlQuery;
} {
	return {
		string: getStringParamFromUrlQuery(query),
		array: getArrayParamFromUrlQuery(query),
		number: getNumberParamFromUrlQuery(query)
	};
}
