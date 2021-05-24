import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, from, merge, Observable, Subject } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { ITransactionGroup } from 'src/app/common/models/group';
import { ITransaction } from 'src/app/common/models/transaction';
import { blackListValidator } from 'src/app/common/validators/blackListValidator';
import { isNotANumberValidator } from 'src/app/common/validators/isNotANumberValidator';
import { FileInputEvent } from 'src/app/components/file-input/models/file-input-event';
import { AttachmentsService } from 'src/app/services/attachments/attachments.service';
import { Confirmable } from 'src/app/services/dialog/dialog.service';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { UserService } from 'src/app/services/user/user.service';

import { IOpenedPeriod } from './../../common/models/period';
import { Pages } from './../../common/routing/routesUrls';
import {
	DateRange,
	isDateWithinRange,
} from './../../common/validators/isDateWithinRange';
import { isValidDate } from './../../common/validators/isValidDate';
import { PeriodsService } from './../../services/periods/periods.service';

const Metadata = Symbol('FileMetadata');

@Component({
	templateUrl: './manage-transaction.component.html',
	styleUrls: ['./manage-transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTransactionComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _attachments: AttachmentsService,
		private readonly _groups: TransactionsGroupsService,
		private readonly _router: Router,
		private readonly _route: ActivatedRoute,
		private readonly _periods: PeriodsService,
		private readonly _user: UserService
	) {}
	private readonly _dateRange = new DateRange();
	private _originalTransaction: ITransaction;

	form = new FormGroup({
		group: new FormControl('', Validators.required),
		amount: new FormControl(null, [
			Validators.required,
			blackListValidator(0),
			isNotANumberValidator,
		]),
		date: new FormControl(new Date(), [
			Validators.required,
			isValidDate,
			isDateWithinRange(this._dateRange),
		]),
		description: new FormControl('', [
			Validators.required,
			Validators.maxLength(255),
		]),
	});
	attachments = new FormArray([]);
	data$: Observable<{
		groups: ITransactionGroup[];
		transaction: ITransaction;
		period: IOpenedPeriod;
		userID: string;
	}>;
	Pages = Pages;

	ngOnInit() {
		const groups$ = this._groups.getAll();
		const transaction$ = this._transactions.get(this.transactionId).pipe(
			map(transaction => {
				if (transaction === undefined) return {} as any;
				this._originalTransaction = { ...transaction };
				transaction.group = transaction.group.id as any;
				transaction.date = transaction.date.toDate() as any;
				return transaction;
			})
		);
		const period$ = this._periods.getCurrent();
		const userID$ = this._user.getUid$();

		this._attachments
			.getMetadata(this.transactionId)
			.pipe(
				first(),
				switchMap(attachments =>
					from(
						Promise.all(
							attachments.map(attachment => {
								return fetch(attachment.url)
									.then(res => res.blob())
									.then(blob => {
										const file = new File([blob], attachment.name, {
											type: blob.type,
										});
										file[Metadata] = attachment;

										return file;
									});
							})
						)
					)
				)
			)
			.subscribe(files =>
				files.forEach(file => this.attachments.push(new FormControl(file)))
			);

		this.data$ = combineLatest([groups$, transaction$, period$, userID$]).pipe(
			map(([groups, transaction, period, userID]) => ({
				groups,
				transaction,
				period,
				userID,
			})),
			tap(data => {
				this.form.patchValue(data.transaction);
			}),
			tap(({ period }) => (this._dateRange.min = period.date.start.toDate()))
		);
	}

	async update() {
		// Contains transaction data from form.
		const newTransaction = this.form.value;

		// Indicates if user has changed transaction group.
		const isTheSameGroup =
			this._originalTransaction.group.id === newTransaction.group;

		// If user hasn't changed the group, then replace group property of new transaction with original transaction.
		if (isTheSameGroup) newTransaction.group = this._originalTransaction.group;

		// If user hasn't changed the group, then there is no need for populating transaction group.
		// This is important because a transaction can have a group that was previously deleted from database.
		await this._transactions.update(
			this.transactionId,
			this.form.value,
			!isTheSameGroup
		);

		// After a transaction has been updated, return to home page.
		this._router.navigateByUrl(Pages.Home);
	}

	deleteAttachment($event: FileInputEvent) {
		const { file, target } = $event;

		this._attachments
			.delete(this.transactionId, file[Metadata])
			.catch(error => {
				target.addFile(file, false);
				throw error;
			});
	}

	async addAttachment($event: FileInputEvent) {
		$event.preventDefault();
		const { file, target } = $event;
		const upload = await this._attachments.upload(this.transactionId, file);
		const newFile = new File([file], '', { type: file.type });
		const firestoreProgress = new Subject();
		const progress$ = merge(
			upload.progress.pipe(map(p => Math.min(p, 99))),
			firestoreProgress
		);

		target.addFile(
			<any>{
				progress$,
				file: newFile,
			},
			false
		);

		upload.metadata.then(m => {
			newFile[Metadata] = m;
			firestoreProgress.next(100);
		});
		upload.metadata.catch(err => {
			target.removeFile(file, false);
			throw err;
		});
	}

	@Confirmable({
		title: 'Potwierdź usunięcie transakcji',
		description:
			'Czy napewno chcesz usunąć tą transakcje ? Nie będzie można przywrócic jej później.',
	})
	async delete() {
		await this._transactions.delete(this.transactionId);
		this._router.navigateByUrl(Pages.Home);
	}

	private get transactionId(): string {
		return this._route.snapshot.params.id;
	}
}
