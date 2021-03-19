import { Injector } from '@angular/core';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	DocumentReference,
} from '@angular/fire/firestore';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';
import firebase from 'firebase';
import { from, Observable, of } from 'rxjs';
import { filter, first, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DynamicQuery } from '../../common/dynamic-queries/models';
import { UserService } from '../user/user.service';
import { Read } from './models';

/**
 * A class that exposes basic CRUD operations for the collection
 */
export class FirebaseCollectionCRUD<T> {
	constructor(
		private readonly _name: string,
		private readonly _injector: Injector
	) {}

	private readonly _firestore = this._injector.get(AngularFirestore);
	private readonly _userService: UserService = this._injector.get(UserService);
	private _collection$: Observable<
		AngularFirestoreCollection<T>
	> = this._userService.user$.pipe(
		switchMap(({ uid }) =>
			of(this._firestore.collection<T>(`users/${uid}/${this._name}`))
		)
	);

	/**
	 * Adds a new document to the collection.
	 * @param newData New object's data.
	 */
	add(newData: T): Promise<DocumentReference<T>> {
		return this._collection$
			.pipe(
				first(),
				switchMap(collection => from(collection.add(newData)))
			)
			.toPromise();
	}

	/**
	 * Returns a single document from the collection.
	 * @param id Id of an document.
	 */
	get(id: string): Observable<T> {
		return this._collection$.pipe(switchMap(ref => ref.doc(id).valueChanges()));
	}

	/**
	 * Gets all documents that are present in the collection.
	 *
	 * Remember that a collection may be very large.
	 * Consider using a query to limit number od documents if that's the case.
	 */
	getAll(): Observable<T[]> {
		return this._collection$.pipe(
			switchMap(collection => collection.valueChanges({ idField: 'id' }))
		);
	}

	/**
	 * Updates a single document in the collection.
	 *
	 * @param id Id of the document.
	 * @param newData Fields to update in the document.
	 */
	update(id: string, newData: T): Promise<void> {
		return this._collection$
			.pipe(
				first(),
				switchMap(collection => from(collection.doc(id).update(newData)))
			)
			.toPromise();
	}

	/**
	 * Removes a single document from the collection.
	 * @param id Id of the document
	 */
	delete(id: string): Promise<void> {
		return this._collection$
			.pipe(
				first(),
				switchMap(collection => from(collection.doc(id).delete()))
			)
			.toPromise();
	}

	/**
	 * Queries the collection.
	 *
	 * @param queries Array of queries
	 */
	query(...queries: Array<DynamicQuery | DynamicQuery[]>): Observable<T[]> {
		return this._userService.user$.pipe(
			switchMap(user =>
				this._firestore
					.collection<T>(`users/${user.uid}/${this._name}`, ref => {
						return queries
							.flat(1)
							.reduce(
								(prev: firebase.firestore.Query, query: DynamicQuery) =>
									prev[query.name](...query.args),
								ref
							);
					})
					.valueChanges({ idField: 'id' })
					.pipe(takeUntil(this._userService.isLoggedIn$.pipe(filter(i => !i))))
			)
		);
	}
}

/**
 * Base class for all mixins. It is scoped to the currently logged in user.
 */
export class CollectionBase {
	constructor(
		private readonly _name: string,
		private readonly _injector: Injector
	) {}

	private readonly _firestore = this._injector.get(AngularFirestore);
	private readonly _userService: UserService = this._injector.get(UserService);
	private readonly _collection$: Observable<AngularFirestoreCollection> = this._userService.user$.pipe(
		switchMap(({ uid }) =>
			of(this._firestore.collection(`users/${uid}/${this._name}`))
		)
	);

	protected get collection$() {
		return this._collection$;
	}

	protected get collectionName() {
		return this._name;
	}

	protected get firestore() {
		return this._firestore;
	}

	protected get userService() {
		return this._userService;
	}
}

/** Adds methods for reading data from the collection */
export function ReadMixin<TBase extends Constructor<CollectionBase>>(
	Base: TBase
) {
	return class Read extends Base {
		/**
		 * Returns a single document from the collection.
		 * @param id Id of an document.
		 */
		get(id: string) {
			return this.collection$.pipe(
				switchMap(coll => coll.doc(id).valueChanges())
			);
		}

		/**
		 * Gets all documents that are present in the collection.
		 *
		 * Remember that a collection may be very large.
		 * Consider using a query to limit number od documents if that's the case.
		 */
		getAll() {
			return this.collection$.pipe(
				switchMap(collection => collection.valueChanges({ idField: 'id' }))
			);
		}

		// TODO: ↓↓↓ Refactor it so it uses collection property from base class ↓↓↓

		/**
		 * Queries the collection.
		 *
		 * @param queries Array of queries
		 */
		query(...queries: Array<DynamicQuery | DynamicQuery[]>) {
			return this.userService.user$.pipe(
				switchMap(user =>
					this.firestore
						.collection(`users/${user.uid}/${this.collectionName}`, ref => {
							return queries
								.flat(1)
								.reduce(
									(prev: firebase.firestore.Query, query: DynamicQuery) =>
										prev[query.name](...query.args),
									ref
								);
						})
						.valueChanges({ idField: 'id' })
						.pipe(takeUntil(this.userService.isLoggedIn$.pipe(filter(i => !i))))
				)
			);
		}
	};
}

/** Adds methods for creating data in the collection */
export function CreateMixin<TBase extends Constructor<CollectionBase>>(
	Base: TBase
) {
	return class Create extends Base {
		add(data: any) {
			return this.collection$
				.pipe(
					first(),
					switchMap(coll => from(coll.add(data))),
					tap(console.log)
				)
				.toPromise();
		}
	};
}

/** Adds methods for updating data in the collection */
export function UpdateMixin<TBase extends Constructor<CollectionBase>>(
	Base: TBase
) {
	return class Update extends Base {
		/**
		 * Updates a single document in the collection.
		 *
		 * @param id Id of the document.
		 * @param newData Fields to update in the document.
		 */
		update(id: string, newData: any): Promise<void> {
			return this.collection$
				.pipe(
					first(),
					switchMap(collection => from(collection.doc(id).update(newData)))
				)
				.toPromise();
		}
	};
}

/** Adds methods for deleting data from the collection */
export function DeleteMixin<TBase extends Constructor<CollectionBase>>(
	Base: TBase
) {
	return class Delete extends Base {
		/**
		 * Removes a single document from the collection.
		 * @param id Id of the document
		 */
		delete(id: string): Promise<void> {
			return this.collection$
				.pipe(
					first(),
					switchMap(collection => from(collection.doc(id).delete()))
				)
				.toPromise();
		}
	};
}

/**
 * Builder, that helps you build a class to inherit, with CRUD operations of your choosing.
 * Note that TypeScript doesn't know much about which methods are included in the built class.
 * To fix that you'll have to pass all interfaces of methods to the build() method.
 *
 * Sample usage
 * ```ts
 * // ↓ Firstly define, which methods you want to use ↓
 * interface AttachedMethods extends Create<Todo>, Read<Todo> {};
 * // ↓ Then create base class with builder. Note that the last method is generic ↓
 * // ↓ They should match the interface above									 ↓
 * const BuiltClass = new CRUDBuilder().withCreate().withRead().build<AttachedMethods>();
 *
 * // ↓ You are ready to extend your class with the built one ↓
 * export class TodosService extends BuiltClass {
 * 	constructor( injector: Injector ) {
 * 		// ↓ Super class needs collection name and injector. ↓
 * 		super('collectionName', injector)
 * 	}
 *
 * 	// You can now use methods to create and read data from this collection with no extra code.
 *
 * }
 * ```
 */
export class CRUDBuilder {
	private readonly _mixins: Set<Function> = new Set();

	withCreate() {
		this._mixins.add(CreateMixin);
		return this;
	}

	withRead() {
		this._mixins.add(ReadMixin);
		return this;
	}

	withUpdate() {
		this._mixins.add(UpdateMixin);
		return this;
	}

	withDelete() {
		this._mixins.add(DeleteMixin);
		return this;
	}

	/** Shortcut for adding all methods at once */
	withAll() {
		return this.withCreate().withRead().withUpdate().withDelete();
	}

	build<T>(): Constructor<CollectionBase & T> {
		const builtMixins = Array.from(this._mixins.values()).reduce(
			(prev, curr) => curr(prev),
			CollectionBase
		);

		return builtMixins;
	}
}
