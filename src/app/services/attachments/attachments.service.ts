import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { switchMap } from 'rxjs/operators';

import { UserService } from '../user/user.service';

interface NewAttachmentMetadata {
	name: string;
	size: number;
	type: string;
	url: string;
	uploadedAt: firebase.firestore.FieldValue;
}

interface AttachmentMetadata {
	id: string;
	name: string;
	size: number;
	type: string;
	url: string;
	uploadedAt: Date;
}

@Injectable({
	providedIn: 'root',
})
export class AttachmentsService {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _afStorage: AngularFireStorage,
		private readonly _user: UserService
	) {}

	/**
	 * Uploads a file to the server and attaches it to the transaction.
	 *
	 * @param id Id of a transaction
	 * @param attachment A file to upload
	 */
	async upload(id: string, attachment: File) {
		const filename = this._afStore.createId();
		const userID = await this._user.getUid();
		const path = `users/${userID}/${filename}`;
		const task = this._afStorage.upload(path, attachment);

		const metadata = task
			.then(snap => snap.ref.getDownloadURL())
			.then(async url => {
				const metadata = {
					name: filename,
					size: attachment.size,
					type: attachment.type,
					url,
					uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
				};

				const ref = await this._insertAttachmentRef(id, metadata);
				const doc = await ref.get();

				return { ...doc.data(), id: doc.id };
			});

		return {
			progress: task.percentageChanges(),
			metadata,
		};
	}

	/**
	 * Deletes a file from the server and removes its reference from the transaction.
	 *
	 * @param transactionID Id of a transaction
	 * @param metadata Metadata of a file
	 */
	async delete(transactionID: string, metadata: AttachmentMetadata) {
		const { id, url } = metadata;
		const userID = await this._user.getUid();
		const collectionPath = `users/${userID}/transactions/${transactionID}/attachments`;

		await this._afStorage.refFromURL(url).delete().toPromise();
		await this._afStore
			.collection<AttachmentMetadata>(collectionPath)
			.doc(id)
			.delete();
	}

	/**
	 * Returns information about attachments without their actual content.
	 *
	 * @param id Id of a transaction
	 * @returns Metadata
	 */
	getMetadata(id: string) {
		return this._user
			.getUid$()
			.pipe(
				switchMap(userID =>
					this._afStore
						.collection<AttachmentMetadata>(
							`users/${userID}/transactions/${id}/attachments`
						)
						.valueChanges({ idField: 'id' })
				)
			);
	}

	private async _insertAttachmentRef(
		id: string,
		metadata: NewAttachmentMetadata
	) {
		const userID = await this._user.getUid();

		return this._afStore
			.collection<NewAttachmentMetadata>(
				`users/${userID}/transactions/${id}/attachments`
			)
			.add(metadata);
	}
}
