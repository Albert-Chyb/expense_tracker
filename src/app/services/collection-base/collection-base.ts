import { InjectionToken, Injector } from '@angular/core';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	DocumentReference,
} from '@angular/fire/firestore';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';
import firebase from 'firebase';
import { from, Observable, of } from 'rxjs';
import { filter, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DynamicQuery } from '../../common/dynamic-queries/models';
import { UserService } from '../user/user.service';

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

export const DEFAULT_COLLECTIONS_SCOPE = new InjectionToken<Observable<string>>(
	'DEFAULT_COLLECTIONS_SCOPE'
);

/**
 * Base class for all mixins. It sets the scope of CRUD operations.
 * To set the default scope use DEFAULT_COLLECTIONS_SCOPE injection token.
 *
 * @param _name Name of the collection
 * @param _injector Injector reference
 * @param _scope Observable of a path to a root collection
 */
export class CollectionBase {
	constructor(
		private readonly _name: string,
		private readonly _injector: Injector,
		private readonly _scope?: Observable<string>
	) {}

	private readonly _firestore = this._injector.get(AngularFirestore);
	private readonly _rootScope: Observable<string> =
		this._scope ?? this._injector.get(DEFAULT_COLLECTIONS_SCOPE);

	private readonly _collection$: Observable<AngularFirestoreCollection> = this._rootScope.pipe(
		map(path => this._firestore.collection(path + '/' + this._name))
	);
	protected get collection$() {
		return this._collection$;
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

		/**
		 * Queries the collection.
		 *
		 * @param queries Array of queries
		 */
		query(...queries: Array<DynamicQuery | DynamicQuery[]>): Observable<any[]> {
			return this.collection$.pipe(
				switchMap(coll => {
					return new Observable<
						firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
					>(subscriber => {
						const close = queries
							.flat(1)
							.reduce<firebase.firestore.Query>(
								(prev: firebase.firestore.Query, query: DynamicQuery) =>
									prev[query.name](...query.args),
								coll.ref
							)
							.onSnapshot(
								snap => {
									subscriber.next(snap);
								},
								error => subscriber.error(error),
								() => subscriber.complete()
							);

						subscriber.add(() => {
							close();
						});
					});
				}),
				map(data =>
					data.docs.map(doc => ({
						...doc.data(),
						id: doc.id,
					}))
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
	private _Base: Constructor<{}> = CollectionBase;

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

	with(...methods: ('c' | 'r' | 'u' | 'd')[]) {
		methods.forEach(method => {
			switch (method) {
				case 'c':
					this.withCreate();
					break;

				case 'r':
					this.withRead();
					break;

				case 'u':
					this.withUpdate();
					break;

				case 'd':
					this.withDelete();
					break;

				default:
					throw new Error(`Method with name ${method} was not found.`);
			}
		});

		return this;
	}

	/** Shortcut for adding all methods at once */
	withAll() {
		return this.withCreate().withRead().withUpdate().withDelete();
	}

	build<T>(): Constructor<CollectionBase & T> {
		const builtMixins = Array.from(this._mixins.values()).reduce(
			(prev, curr) => curr(prev),
			this._Base
		);

		return builtMixins;
	}
}
