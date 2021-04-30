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

import {
	PREVIEW_IMAGES,
	SUPPORTED_IMG_TYPES,
	TPreviewImages,
	TSupportedImgTypes,
} from './injection-tokens';

type TAttachment = File | Blob;

const VALUE_ACCESSOR_PROVIDER: Provider = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => FileInputComponent),
	multi: true,
};

@Component({
	selector: 'file',
	styleUrls: ['./file-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [VALUE_ACCESSOR_PROVIDER],
	templateUrl: './file-input.component.html',
	host: {
		class: 'file-input',
		'[class.file-input--loading]': 'isLoading',
		'[class.file-input--has-file]': 'hasFile',
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
	onRemove = new EventEmitter<TAttachment>();

	private readonly _reader = new FileReader();
	private _isLoading = false;
	private _base64: string;
	private _attachment: TAttachment;
	public isDisabled = false;

	onChange: (file: TAttachment) => void;
	onTouched: () => void;

	writeValue(obj: any) {
		if (obj instanceof File || obj instanceof Blob) {
			this._attachment = obj;
			this.loadFile(obj);
		}
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	loadFile(file: TAttachment) {
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

		this.onChange(this._attachment);
		this.onTouched();
		this._changeDetector.detectChanges();
	}

	private _setLoadingState(isLoading: boolean) {
		this._isLoading = isLoading;
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
		return this._base64.split(';', 1)[0].split(':', 2)[1] ?? '';
	}

	get isLoading() {
		return this._isLoading;
	}

	get hasFile() {
		return !!this._base64;
	}

	get attachment() {
		return this._attachment;
	}
}
