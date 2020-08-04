import {
	Component,
	EventEmitter,
	HostListener,
	Output,
	Input,
	HostBinding,
} from '@angular/core';
import { ZippyComponent } from '../zippy/zippy.component';

/**
 * Part of a zippy that is always visible.
 * By default when user clicks on it, the zippy will toggle its current status.
 * You can disable this behavior by passing toggleOnClick = false property.
 * In this case you'll have to provide your own logic for toggling zippy.
 */

@Component({
	selector: 'zippy-static',
	styleUrls: ['./zippy-static.component.scss'],
	template: `<ng-content></ng-content>`,
})
export class ZippyStaticComponent {
	constructor() {}

	@HostBinding('class.custom-toggle-behavior')
	@Input('toggleOnClick')
	customToggleBehavior: boolean = false;

	@Output() onClick = new EventEmitter<ZippyComponent>();
	@HostListener('click') emitClick() {
		if (!this.customToggleBehavior) this.onClick.emit(this._zippyRef);
	}

	private _zippyRef: ZippyComponent;

	set zippyRef(value: ZippyComponent) {
		this._zippyRef = value;
	}
}
