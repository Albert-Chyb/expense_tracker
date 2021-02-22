import { IUser, AppUser } from './user';
import firebase from 'firebase/app';
import { ISettings } from './settings';

export interface ICompletingData {
	balance: number;
	settings: ISettings;
}

export class CompletingData {
	/**
	 * Combine firestore user and completing data, and returns user object.
	 * @param user Firebase user
	 * @param data Completing data
	 */
	static buildUser(user: firebase.User, data: ICompletingData): IUser {
		if (!user || !data) return null;

		return {
			settings: data.settings,
			balance: data.balance,
			startingBalance: data.balance,
			...AppUser.buildFromFirebaseUser(user),
		};
	}
}
