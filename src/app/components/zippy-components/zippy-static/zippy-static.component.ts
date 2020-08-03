import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { ZippyComponent } from '../zippy/zippy.component';

@Component({
	selector: 'zippy-static',
	styleUrls: ['./zippy-static.component.scss'],
	template: `<ng-content></ng-content>`,
})
export class ZippyStaticComponent {
	constructor() {}

	@Output() onClick = new EventEmitter<ZippyComponent>();
	@HostListener('click') emitClick() {
		this.onClick.emit(this._zippyRef);
	}

	private _zippyRef: ZippyComponent;

	set zippyRef(value: ZippyComponent) {
		this._zippyRef = value;
	}
}
