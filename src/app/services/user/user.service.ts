import { ICompletingData } from './../../common/models/completingData';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { CompletingData } from 'src/app/common/models/completingData';
import { Period } from './../../common/models/period';
import { ISettings } from './../../common/models/settings';
import { AppUser, IUser } from './../../common/models/user';
import { Cacheable } from 'src/app/common/cash/cashable';

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

	async update(user: Partial<IUser>): Promise<void> {
		return this._afStore.doc(`users/${await this.getUid()}`).update(user);
	}

	/**
	 * Updates user's settings
	 * @param settings New settings
	 */

	async updateSettings(settings: ISettings): Promise<void> {
		return this._afStore
			.doc(`users/${await this.getUid()}`)
			.update({ settings });
	}

	/**
	 * Creates initial data in database.
	 */

	async createData(data: ICompletingData): Promise<void> {
		const userRef = this._afStore.doc(`users/${await this.getUid()}`);
		const period = Period.buildOpened();
		const currentUser = await this._afAuth.currentUser;
		const userPromise = userRef.set(
			CompletingData.buildUser(currentUser, data)
		);
		const periodsPromise = userRef.collection('periods').add(period);

		await Promise.all([userPromise, periodsPromise]);
		this._hasCreatedData.next(true);
	}

	/**
	 * Returns user data from database.
	 */

	get user$(): Observable<IUser> {
		return this._getUser$();
	}

	@Cacheable({
		tableName: 'user',
	})
	private _getUser$() {
		return this._user$;
	}

	/**
	 * Returns user ID. (Promise way)
	 */

	async getUid(): Promise<string> {
		return (await this._afAuth.currentUser).uid;
	}

	/**
	 * Returns user ID. (Observable way)
	 */

	getUid$() {
		return from(this._afAuth.currentUser).pipe(map(user => user.uid));
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

	private async getUserData() {
		const currentUser = await this._afAuth.currentUser;
		return AppUser.buildFromFirebaseUser(currentUser);
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
		this.update(await this.getUserData());
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
