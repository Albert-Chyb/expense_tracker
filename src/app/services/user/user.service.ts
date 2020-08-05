import { ICompletingData } from './../../common/models/completingData';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, take } from 'rxjs/operators';

import { IUser } from './../../common/models/user';
import { User } from 'firebase';

/**
 * Handles user's data.
 */

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(
		private readonly _db: AngularFirestore,
		private readonly _afAuth: AngularFireAuth
	) {
		this.init();
	}

	private _user$: Observable<IUser>;

	/**
	 * Updates user data in database.
	 * @param user Contains those fields that will be replaced in database.
	 */

	update(user: Partial<IUser>): Promise<void> {
		return this._db.collection('users').doc<IUser>(this.id).update(user);
	}

	/**
	 * Completes creating user's account by creating data in database.
	 * Do not use it for other purposes.
	 * @param data Completing data that is required to complete account.
	 */

	completeCreatingAccount(data: ICompletingData): Promise<void> {
		data.name = this._afAuth.auth.currentUser.displayName;
		return this._db.collection('users').doc(this.id).set(data);
	}

	/**
	 * Updates users' balance based on passed amount.
	 * For example - if you want to decrease balance by 200 you pass -200 number in amount param.
	 * If amount is 0 then nothing happens.
	 * @param amount Amount
	 */

	async updateBalance(amount: number) {
		if (amount === 0) return null;
		const user = await this._user$.pipe(take(1)).toPromise();
		let balance = user.balance + amount;

		return this.update({ balance });
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
		return this._afAuth.auth.currentUser.uid || '';
	}

	/**
	 * Checks if user completed creating account by creating data in database.
	 */
	get isSetUpFully(): Promise<boolean> {
		return this._db
			.collection('users')
			.doc<IUser>(this.id)
			.ref.get()
			.then(doc => doc.exists);
	}

	/**
	 * Checks if user is logged in.
	 */

	get isLoggedIn$(): Observable<boolean> {
		return this._user$.pipe(map(user => !!user));
	}

	/**
	 * Initialization logic.
	 */

	private init() {
		this._user$ = this._afAuth.authState.pipe(
			tap(this.updateUserCredentials.bind(this)),
			switchMap(this.switchToUserFromDatabase.bind(this))
		);
	}

	private updateUserCredentials(user: User) {
		if (!user) return null;
		this.update({ name: user.displayName });
	}

	private switchToUserFromDatabase(user: User) {
		if (user)
			return this._db
				.collection('users')
				.doc<IUser>(user.uid)
				.valueChanges()
				.pipe(map(doc => ({ uid: user.uid, ...doc })));
		else return of(false as any);
	}
}
