import { FilesContainerComponent } from '../files-container/files-container.component';

export class FileInputEvent {
	constructor(public file: File, public target: FilesContainerComponent) {}
	private _isDefaultBehaviorDisabled = false;

	preventDefault() {
		this._isDefaultBehaviorDisabled = true;
	}

	get isDefaultBehaviorDisabled() {
		return this._isDefaultBehaviorDisabled;
	}
}
