import { ITransaction } from 'src/app/common/models/transaction';
import {
	IFilters,
	TransactionsType,
} from 'src/app/components/transactions-filters-dialog/transactions-filters-dialog.component';
import { where } from 'src/app/services/collection-base/dynamic-queries/helpers';
import { DynamicQuery } from 'src/app/services/collection-base/dynamic-queries/models';

export const SERVER_QUERIES = new Map<
	keyof IFilters,
	(value: any) => DynamicQuery
>([
	['earliestDate', (date: Date) => where('date', '>=', new Date(date))],
	['latestDate', (date: Date) => where('date', '<=', new Date(date))],
]);

export const LOCAL_QUERIES = new Map<
	keyof IFilters,
	(v: any) => (t: ITransaction) => boolean
>([
	['lowestAmount', (amount: number) => (t: ITransaction) => t.amount >= amount],
	[
		'highestAmount',
		(amount: number) => (t: ITransaction) => t.amount <= amount,
	],
	[
		'type',
		(type: TransactionsType) => {
			switch (type) {
				case TransactionsType.Expenses:
					return ({ amount }: ITransaction) => amount < 0;

				case TransactionsType.Incomes:
					return ({ amount }: ITransaction) => amount > 0;

				default:
					return () => true;
			}
		},
	],
	['group', (group: string) => (t: ITransaction) => t.group.id === group],
]);

export const FILTERS_KEYS = [...SERVER_QUERIES.keys(), ...LOCAL_QUERIES.keys()];
export const VIRTUAL_SCROLL_ITEM_SIZE = 80;
