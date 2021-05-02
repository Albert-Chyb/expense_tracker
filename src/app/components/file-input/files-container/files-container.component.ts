import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export const FilesContainerOverlayMessage = Symbol(
	'FilesContainerOverlayMessage'
);

@Component({
	selector: 'files',
	templateUrl: './files-container.component.html',
	styleUrls: ['./files-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'(drop)': 'onDrop($event)',
		'(dragover)': 'onDragOver($event)',
		'(dragenter)': 'onDragEnter($event)',
		'(dragleave)': 'onDragLeave($event)',
		'[class.is-overlay-shown]': 'isOverlayShown',
	},
})
export class FilesContainerComponent implements OnInit, OnDestroy {
	constructor(private readonly _changeDetector: ChangeDetectorRef) {}

	@Input('formArray') formArray: FormArray;
	@Input('accept') allowedTypes: string[] = ['image/jpeg'];
	@Input('multiple') multiple = true;
	@Input('checkFirst') checkFirst = true;

	@Output('onFileAdd') onFileAdd = new EventEmitter<File>();
	@Output('onReject') onReject = new EventEmitter<any>();
	@Output('onFileRemove') onFileRemove = new EventEmitter<File>();

	private readonly _subscriptions = new Subscription();
	private _isOverlayShown = false;

	ngOnInit(): void {
		if (!this.formArray) {
			throw new Error('You have to pass a form array reference !');
		}

		this._subscriptions.add(
			this.formArray.valueChanges.subscribe(() =>
				this._changeDetector.detectChanges()
			)
		);
	}

	ngOnDestroy() {
		this._subscriptions.unsubscribe();
	}

	onDrop($event: DragEvent) {
		$event.preventDefault();
		const { files, types } = $event.dataTransfer;

		this._isOverlayShown = false;
		if (types.every(type => type === 'Files')) this.addFiles(files);
	}

	onDragEnter($event: DragEvent) {
		$event.preventDefault();
		const { types } = $event.dataTransfer;

		this._isOverlayShown = types.every(type => type === 'Files');
	}

	onDragLeave($event: DragEvent) {
		$event.preventDefault();

		this._isOverlayShown = false;
	}

	onDragOver($event: DragEvent) {
		$event.preventDefault();
	}

	handleInputChange($event: Event) {
		const target = $event.target as HTMLInputElement;
		const { files } = target;

		this.addFiles(files);
	}

	addFiles(files: FileList) {
		const errors = this.checkFirst ? this._validateFiles(files) : null;

		if (errors) {
			return this.onReject.emit(errors);
		}

		Array.from(files).forEach(file => {
			this.formArray.push(new FormControl(file));
			this.onFileAdd.emit(file);
		});
	}

	private _validateFiles(files: FileList): any {
		const filesArray = Array.from(files);
		const controls = filesArray.map(file => new FormControl(file));

		return this.formArray.validator(new FormArray(controls));
	}

	get isOverlayShown() {
		return this._isOverlayShown;
	}
}
