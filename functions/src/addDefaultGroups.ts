import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

const db = firestore();

const DEFAULT_GROUPS = [
	{
		name: 'Jedzenie',
		icon: {
			type: 'fas',
			name: 'fa-utensils',
		},
	},
	{
		name: 'Pensja',
		icon: {
			type: 'fas',
			name: 'fa-coins',
		},
	},
	{
		name: 'Imprezy',
		icon: {
			type: 'fas',
			name: 'fa-glass-cheers',
		},
	},
	{
		name: 'Osobiste',
		icon: {
			type: 'fas',
			name: 'fa-user-shield',
		},
	},
	{
		name: 'Transport',
		icon: {
			type: 'fas',
			name: 'fa-bus',
		},
	},
	{
		name: 'Inne',
		icon: {
			type: 'fas',
			name: 'fa-question-circle',
		},
	},
];

/**
 * When user first creates his data in firestore, it adds some default groups.
 */

export const addDefaultGroups = functions.firestore
	.document('users/{userId}')
	.onCreate((snap, context) => {
		const batch = db.batch();

		DEFAULT_GROUPS.forEach(group => {
			const docRef = snap.ref.collection('groups').doc();
			batch.set(docRef, group);
		});

		return batch.commit();
	});
