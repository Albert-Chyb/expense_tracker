import { Injectable, Injector } from '@angular/core';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Cacheable } from 'src/app/common/cash/cashable';
import {
	between,
	limit,
	orderBy,
	where,
} from 'src/app/common/dynamic-queries/helpers';

import { CRUDBuilder } from '../collection-base/collection-base';
import { Read, Update } from '../collection-base/models';
import { IClosedPeriod, IOpenedPeriod } from './../../common/models/period';

interface QuerySettings {
	limit?: number;
	orderDirection?: 'asc' | 'desc';
}
const DEFAULT_QUERY_SETTINGS: QuerySettings = {
	limit: null,
	orderDirection: 'desc',
};

type Data = IClosedPeriod | IOpenedPeriod;
interface AttachedMethods extends Read<Data>, Update<Data> {}
const Class = new CRUDBuilder().with('r', 'u').build<AttachedMethods>();

@Injectable({
	providedIn: 'root',
})
export class PeriodsService extends Class {
	constructor(injector: Injector) {
		super('periods', injector);
	}

	/**
	 * Gets currently active period.
	 */

	getCurrent(): Observable<IOpenedPeriod> {
		return this.query(where('isClosed', '==', false)).pipe(
			map(periods => periods[0])
		) as Observable<IOpenedPeriod>;
	}

	/**
	 * Ends current period.
	 */

	async endCurrent(): Promise<void> {
		const { id } = await this.getCurrent().pipe(first()).toPromise();

		return this.update(id, {
			'date.end': firebase.firestore.FieldValue.serverTimestamp(),
		} as any);
	}

	/**
	 * If current period is closed but not yet sealed, this function can re-open current period.
	 */

	async openCurrent(): Promise<void> {
		const { id } = await this.getCurrent().pipe(first()).toPromise();

		return this.update(id, {
			'date.end': firebase.firestore.FieldValue.delete(),
		} as any);
	}

	/**
	 * Gets all closed periods.
	 */

	@Cacheable({
		tableName: 'closedPeriods',
	})
	getAllClosed(settings?: QuerySettings): Observable<IClosedPeriod[]> {
		const { limit: maxSize, orderDirection } = Object.assign(
			{ ...DEFAULT_QUERY_SETTINGS },
			settings
		);

		const queries = [
			where('isClosed', '==', true),
			orderBy('date.start', orderDirection),
			maxSize ? limit(maxSize) : [],
		];

		return this.query(...queries) as Observable<IClosedPeriod[]>;
	}

	getClosedBetween(startAt: Date, endAt: Date): Observable<IClosedPeriod[]> {
		return this.query(
			between('date.start', startAt, endAt),
			where('isClosed', '==', true)
		) as Observable<IClosedPeriod[]>;
	}
}
