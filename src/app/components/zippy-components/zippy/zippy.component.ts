import { AfterContentInit, Component, ContentChild } from '@angular/core';

import { ZippyContentComponent } from './../zippy-content/zippy-content.component';
import { ZippyStaticComponent } from './../zippy-static/zippy-static.component';

/**
 * Container for zippy-static and zippy-content.
 */

@Component({
	selector: 'zippy',
	styleUrls: ['./zippy.component.scss'],
	template: `
		<ng-content select="zippy-static"></ng-content>
		<ng-content select="zippy-content"></ng-content>
	`,
})
export class ZippyComponent implements AfterContentInit {
	constructor() {}

	@ContentChild(ZippyStaticComponent)
	static: ZippyStaticComponent;

	@ContentChild(ZippyContentComponent)
	content: ZippyContentComponent;

	ngAfterContentInit() {
		this.static.zippyRef = this;
		this.static.onClick.subscribe(() => this.content.toggle());
	}
}
