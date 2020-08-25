import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { firestore } from 'firebase/app';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';

import { ICompletingData } from './../../common/models/completingData';
import { ISettings } from './../../common/models/settings';
import { IUser } from './../../common/models/user';

/**
 * Handles user's data.
 */

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _afAuth: AngularFireAuth
	) {
		this.init();
	}

	private _user$: Observable<IUser>;
	private readonly _hasCreatedData = new BehaviorSubject(null);

	/**
	 * Updates user data in database.
	 * @param user Contains those fields that will be replaced in database.
	 */

	update(user: Partial<IUser>): Promise<void> {
		return this._afStore.doc(`users/${this.id}`).update(user);
	}

	/**
	 * Updates user's settings
	 * @param settings New settings
	 */

	updateSettings(settings: ISettings): Promise<void> {
		return this._afStore.doc(`users/${this.id}`).update({ settings });
	}

	/**
	 * Creates required data in database, for app to work properly.
	 * @param data Completing data that is required to complete account.
	 */

	async createData(data: ICompletingData): Promise<void> {
		const userRef = this._afStore.doc(`users/${this.id}`);
		const period = {
			date: {
				start: firestore.FieldValue.serverTimestamp() as any,
			},
			isClosed: false,
		};

		data.name = this._afAuth.auth.currentUser.displayName;

		const userPromise = userRef.set({ ...data, startingBalance: data.balance });
		const periodsPromise = userRef.collection('periods').add(period);

		await Promise.all([userPromise, periodsPromise]);
		this._hasCreatedData.next(true);

		return Promise.resolve();
	}

	/**
	 * Returns user data from database.
	 */

	get user$(): Observable<IUser> {
		return this._user$;
	}

	/**
	 * Returns currently logged in user's id.
	 */

	get id(): string {
		return this._afAuth.auth.currentUser
			? this._afAuth.auth.currentUser.uid
			: '';
	}

	/**
	 * Checks if user created initial data in database. (RxJS way)
	 */

	get hasCreatedData$(): Observable<boolean> {
		return this._hasCreatedData.pipe(filter(value => value !== null));
	}

	/**
	 * Checks if user created initial data in database. (Promise way)
	 */
	get hasCreatedData(): Promise<boolean> {
		return this.hasCreatedData$.pipe(first()).toPromise();
	}

	/**
	 * Checks if user is logged in.
	 */

	get isLoggedIn$(): Observable<boolean> {
		return this._afAuth.authState.pipe(map(user => !!user));
	}

	/**
	 * Initialization logic.
	 */

	private init(): void {
		// Set up user observable with data from database.
		this._user$ = this._afAuth.authState.pipe(
			switchMap(this.getUserFromDatabase.bind(this))
		);

		this._afAuth.authState
			.pipe(tap(this.updateUserCredentials.bind(this)))
			.subscribe(this.informAppIfUserDataIsAvailable.bind(this));
	}

	/**
	 * Informs app if user's data is available in database.
	 * @param user Firebase user
	 */

	async informAppIfUserDataIsAvailable(user: User) {
		if (!user) {
			this._hasCreatedData.next(false);
			return null;
		}

		const doc = await this._afStore.doc(`users/${user.uid}`).ref.get();
		this._hasCreatedData.next(doc.exists);

		return user;
	}

	/**
	 * Updates user's credentials in firestore.
	 * @param user Firebase user.
	 */

	private async updateUserCredentials(user: User): Promise<void> {
		if (!user || !(await this.hasCreatedData)) return null;
		this.update({
			name: user.displayName,
			email: user.email,
			createdAt: new Date(user.metadata.creationTime) as any,
			avatar: user.photoURL,
		});
	}

	/**
	 * Returns user data from database based on passed user.
	 * @param user Firebase user.
	 */

	private getUserFromDatabase(user: User): Observable<IUser> {
		if (user)
			return this._afStore
				.doc<IUser>(`users/${user.uid}`)
				.valueChanges()
				.pipe(map(doc => ({ uid: user.uid, ...doc })));
		else return of(false as any);
	}
}
