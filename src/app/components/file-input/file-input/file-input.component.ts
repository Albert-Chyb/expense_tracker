import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	forwardRef,
	OnInit,
	Output,
	Provider,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

const VALUE_ACCESSOR_PROVIDER: Provider = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => FileInputComponent),
	multi: true,
};

// TODO: Add loader during file downloading.
// TODO: Add preview images for files that cannot be displayed in img element.

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
	},
})
export class FileInputComponent implements OnInit, ControlValueAccessor {
	constructor(
		private readonly _changeDetector: ChangeDetectorRef,
		private readonly _sanitizer: DomSanitizer
	) {}

	@Output('onRemove')
	onRemove = new EventEmitter();

	private readonly _reader = new FileReader();
	private readonly _urlPattern = new RegExp(
		/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
		'gm'
	);
	private _isLoading = false;
	public base64: string;

	onChange: (file: any) => void;
	onTouched: () => void;
	isDisabled = false;

	async writeValue(obj: any) {
		const isValidUrl = this._urlPattern.test(obj);

		if (isValidUrl && obj) {
			this._isLoading = true;

			this._changeDetector.detectChanges();
			const response = await fetch(obj);
			const blob = await response.blob();

			this.loadFile(blob);

			this._isLoading = false;
			this._changeDetector.detectChanges();
		}
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	handleInputChange($event: Event) {
		const { files } = $event.target as HTMLInputElement;
		const file = files[0];

		if (file) this.loadFile(file);
	}

	loadFile(file: File | Blob) {
		this._reader.readAsDataURL(file);
	}

	removeFile() {
		this.base64 = '';
		this.onChange('');
		this.onRemove.emit();
	}

	sanitize(value: string) {
		return this._sanitizer.bypassSecurityTrustUrl(value);
	}

	ngOnInit(): void {
		this._reader.addEventListener('load', () => this._onLoad());
	}

	private _onLoad() {
		this.base64 = <string>this._reader.result;

		this.onChange(this.base64);
		this.onTouched();
		this._changeDetector.detectChanges();
	}

	get type() {
		return this.base64.split(';', 1)[0].split(':', 2)[1] ?? '';
	}

	get isLoading() {
		return this._isLoading;
	}

	get hasFile() {
		return !!this.base64;
	}
}
