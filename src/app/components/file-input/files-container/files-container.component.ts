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
import { FileInputEvent } from '../models/file-input-event';

// TODO: Make a directive that will help to work with FireStorage
// TODO: Make a better loader.

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
	@Input('accept') allowedTypes: string[] = [];
	@Input('multiple') multiple = true;
	@Input('checkFirst') checkFirst = true;

	@Output('onFileAdd') onFileAdd = new EventEmitter<FileInputEvent>();
	@Output('onReject') onReject = new EventEmitter<any>();
	@Output('onFileRemove') onFileRemove = new EventEmitter<FileInputEvent>();

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

		this.hideOverlay();
		if (types.every(this._isAllowedDraggedType)) this.addFiles(files);
	}

	onDragEnter($event: DragEvent) {
		$event.preventDefault();
		const { types } = $event.dataTransfer;

		if (types.every(this._isAllowedDraggedType)) {
			this.showOverlay();
		}
	}

	onDragLeave($event: DragEvent) {
		$event.preventDefault();

		this.hideOverlay();
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

		Array.from(files).forEach(file => this.addFile(file));
	}

	addFile(file: File, emitEvent = true) {
		if (emitEvent) {
			var event = new FileInputEvent(file, this);
			this.onFileAdd.emit(event);
		}

		if (!event?.isDefaultBehaviorDisabled) {
			this.formArray.push(new FormControl(file));
		}
	}

	removeFile(file: File, emitEvent = true) {
		if (emitEvent) {
			var event = new FileInputEvent(file, this);
			this.onFileRemove.emit(event);
		}

		if (!event?.isDefaultBehaviorDisabled) {
			const fileIndex = this.formArray.controls.findIndex(
				control => control.value === file
			);

			this.formArray.removeAt(fileIndex);
		}
	}

	showOverlay() {
		this._isOverlayShown = true;
	}

	hideOverlay() {
		this._isOverlayShown = false;
	}

	private _validateFiles(files: FileList): any {
		const filesArray = Array.from(files);
		const controls = [
			...filesArray.map(file => new FormControl(file)),
			...this.formArray.controls,
		];

		return this.formArray.validator(new FormArray(controls));
	}

	private _isAllowedDraggedType(type: string) {
		return type === 'Files';
	}

	get isOverlayShown() {
		return this._isOverlayShown;
	}
}
