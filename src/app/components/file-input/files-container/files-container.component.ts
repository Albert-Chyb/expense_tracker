import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

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
		'[class.is-hovered-with-files]': 'isFileOver',
	},
})
export class FilesContainerComponent implements OnInit {
	constructor(private readonly _changeDetector: ChangeDetectorRef) {}

	@Input('formArray') formArray: FormArray;
	@Output('onFileAdd') onFileAdd = new EventEmitter<File>();
	@Output('onFileRemove') onFileRemove = new EventEmitter<File>();

	private readonly _subscriptions = new Subscription();
	isFileOver = false;

	ngOnInit(): void {
		if (!this.formArray) {
			throw new Error('You have to pass a form array reference !');
		}

		this._subscriptions.add(
			this.formArray.valueChanges.subscribe(() =>
				this._changeDetector.detectChanges()
			)
		);

		this.onFileAdd.subscribe(console.log);
	}

	onDrop($event: DragEvent) {
		$event.preventDefault();

		this.addFiles($event.dataTransfer.files);

		this.isFileOver = false;
	}

	onDragEnter($event: DragEvent) {
		$event.preventDefault();
		this.isFileOver = $event.dataTransfer.types.every(type => type === 'Files');
	}

	onDragLeave($event: DragEvent) {
		$event.preventDefault();

		this.isFileOver = false;
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
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			this.formArray.insert(this.formArray.length, new FormControl(file));
			this.onFileAdd.emit(file);
		}
	}
}
