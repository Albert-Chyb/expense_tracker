import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	forwardRef,
	Inject,
	OnInit,
	Output,
	Provider,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { finalize, takeWhile } from 'rxjs/operators';

import {
	PREVIEW_IMAGES,
	SUPPORTED_IMG_TYPES,
	TPreviewImages,
	TSupportedImgTypes,
} from './injection-tokens';

const VALUE_ACCESSOR_PROVIDER: Provider = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => FileInputComponent),
	multi: true,
};

export interface UploadTask {
	file: File;
	progress$: Observable<number>;
}

@Component({
	selector: 'file',
	styleUrls: ['./file-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [VALUE_ACCESSOR_PROVIDER],
	templateUrl: './file-input.component.html',
	host: {
		'(drop)': '$event.stopPropagation();',
		'(dragover)': '$event.stopPropagation();',
		'(dragleave)': '$event.stopPropagation();',
	},
})
export class FileInputComponent implements OnInit, ControlValueAccessor {
	constructor(
		private readonly _changeDetector: ChangeDetectorRef,
		private readonly _sanitizer: DomSanitizer,

		@Inject(SUPPORTED_IMG_TYPES)
		private readonly _supportedImgTypes: TSupportedImgTypes,

		@Inject(PREVIEW_IMAGES)
		private readonly _previewImages: TPreviewImages
	) {}

	@Output('onRemove')
	onRemove = new EventEmitter<File>();

	private readonly _reader = new FileReader();
	private _isReadingFile = true;
	private _base64: string;
	private _attachment: File;

	public progress$: Observable<number>;
	public isDisabled = false;

	writeValue(obj: File | UploadTask) {
		let file: File;

		if (obj instanceof File) {
			file = obj;
		} else if (obj) {
			file = obj.file;
			this.progress$ = obj.progress$.pipe(
				takeWhile(progress => progress < 100, true),
				finalize(() => (this.progress$ = null))
			);
		}

		this._attachment = file;

		if (this._supportedImgTypes.includes(file.type)) {
			this.loadPreview(file);
		} else {
			this._setLoadingState(false);
		}
	}

	registerOnChange(fn: any): void {}

	registerOnTouched(fn: any): void {}

	setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	loadPreview(file: File) {
		this._reader.readAsDataURL(file);
	}

	sanitize(value: string) {
		return this._sanitizer.bypassSecurityTrustUrl(value);
	}

	ngOnInit(): void {
		this._reader.addEventListener('load', () => this._onLoad());
		this._reader.addEventListener('loadstart', () =>
			this._setLoadingState(true)
		);
		this._reader.addEventListener('loadend', () =>
			this._setLoadingState(false)
		);
	}

	private _onLoad() {
		this._base64 = <string>this._reader.result;

		this._changeDetector.detectChanges();
	}

	private _setLoadingState(isLoading: boolean) {
		this._isReadingFile = isLoading;
		this._changeDetector.markForCheck();
		this._changeDetector.detectChanges();
	}

	get needsPreview() {
		return !this._supportedImgTypes.includes(this.type);
	}

	get preview(): string {
		return this.needsPreview
			? this._previewImages.get(this.type)
			: this._base64;
	}

	get type() {
		return this._attachment.type;
	}

	get isReadingFile() {
		return this._isReadingFile;
	}

	get attachment() {
		return this._attachment;
	}
}
