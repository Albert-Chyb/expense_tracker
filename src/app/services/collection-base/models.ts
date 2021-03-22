import { DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DynamicQuery } from 'src/app/services/collection-base/dynamic-queries/models';

/** An interface for CreateMixin */
export interface Create<T> {
	/**
	 * Adds a new document to the collection.
	 * @param data New object's data.
	 */
	add(data: T): Promise<DocumentReference<T>>;
}

/** An interface for ReadMixin */
export interface Read<T> {
	/**
	 * Returns a single document from the collection.
	 * @param id Id of an document.
	 */
	get(id: string): Observable<T>;

	/**
	 * Gets all documents that are present in the collection.
	 *
	 * Remember that a collection may be very large.
	 * Consider using a query to limit number od documents if that's the case.
	 */
	getAll(): Observable<T[]>;

	/**
	 * Queries the collection.
	 *
	 * @param queries Array of queries
	 */
	query(
		...queries: Array<DynamicQuery | DynamicQuery[]>
	): Observable<({ id: string } & T)[]>;
}

/** An interface for UpdateMixin */
export interface Update<T> {
	/**
	 * Updates a single document in the collection.
	 *
	 * @param id Id of the document.
	 * @param newData Fields to update in the document.
	 */
	update(id: string, newData: Partial<T>): Promise<void>;
}

/** An interface for DeleteMixin */
export interface Delete {
	/**
	 * Removes a single document from the collection.
	 * @param id Id of the document
	 */
	delete(id: string): Promise<void>;
}

export interface CRUD<T> extends Create<T>, Read<T>, Update<T>, Delete {}
