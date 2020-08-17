import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import * as moment from 'moment';

const db = firestore();

export const autoEndPeriod = functions.https.onCall(async (data, context) => {
	const users = await db.collection('users').listDocuments();

	users.forEach(async userDoc => {
		const { settings, balance } = (await userDoc.get()).data() as any;

		const activePeriod = (await getCurrentPeriod(userDoc)).data();
		const isPeriodEnded = !!activePeriod.date.end;

		if (!isPeriodEnded && !settings.autoEndPeriod) return null;

		const closedPeriodStats = {
			isClosed: true,
			...(await calculateStats(userDoc, activePeriod)),
			balance,
		};

		const periodStartDate = moment(new Date(activePeriod.date.start.toDate()));
		const daysPassed = moment(Date.now()).diff(periodStartDate, 'days');
		const hasPassedEnoughDays = daysPassed >= settings.autoEndAfter;

		if (isPeriodEnded) {
			await closePeriod(userDoc, closedPeriodStats);
		} else if (settings.autoEndPeriod && hasPassedEnoughDays) {
			const data = {
				...closedPeriodStats,
				'date.end': firestore.FieldValue.serverTimestamp(),
			};
			await closePeriod(userDoc, data);
		}
	});
});

async function closePeriod(
	userDoc: firestore.DocumentReference<firestore.DocumentData>,
	data: any
) {
	const periodsCollection = userDoc.collection('periods');
	const activePeriodRef = await getCurrentPeriod(userDoc);

	await activePeriodRef.ref.update(data);
	return periodsCollection.add({
		isClosed: false,
		date: {
			start: firestore.FieldValue.serverTimestamp(),
		},
	});
}

async function getCurrentPeriod(
	userDoc: firestore.DocumentReference<firestore.DocumentData>
) {
	const periods = await userDoc
		.collection('periods')
		.where('isClosed', '==', false)
		.get();
	return periods.docs[0];
}

async function calculateStats(
	userDoc: firestore.DocumentReference<firestore.DocumentData>,
	period: any
) {
	const stats = {
		incomes: 0,
		outcomes: 0,
	};

	const transactions = await userDoc
		.collection('transactions')
		.where('date', '>=', period.date.start)
		.get();

	transactions.docs.forEach(transactionDoc => {
		const transaction = transactionDoc.data();
		const type = transaction.amount > 0 ? 'incomes' : 'outcomes';
		stats[type] += transaction.amount;
	});

	return stats;
}
