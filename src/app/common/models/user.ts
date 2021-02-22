import firebase from 'firebase/app';
import { FirestoreTimestamp } from './firestoreTimestamp';
import { ISettings } from './settings';

/**
 * Represents user in database.
 */

export interface IUser {
	/**
	 * Name of an user.
	 */
	name: string;

	/**
	 * User settings.
	 */
	settings: ISettings;

	/**
	 * User's current money balance.
	 */
	balance: number;

	/**
	 * Balance when user firstly created data.
	 */
	startingBalance: number;

	/**
	 * Id of an user
	 */
	uid?: string;

	email: string;

	createdAt: FirestoreTimestamp;

	avatar: string;
}

export class AppUser {
	/**
	 * Picks all fields from firebase user.
	 * @param user Firebase user
	 */
	static buildFromFirebaseUser(user: firebase.User) {
		if (!user) return null;

		return {
			name: user.displayName,
			email: user.email,
			createdAt: new Date(user.metadata.creationTime) as any,
			avatar: user.photoURL,
		};
	}
}
