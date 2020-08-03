import {
	AfterContentInit,
	Component,
	ContentChildren,
	OnDestroy,
	QueryList,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ZippyComponent } from '../zippy/zippy.component';

/**
 * Zippy list allows only one zippy component to be expanded.
 * Other expanded zippers will be collapsed.
 */

@Component({
	selector: 'zippy-list',
	styleUrls: ['./zippy-list.component.scss'],
	template: `<ng-content></ng-content>`,
})
export class ZippyListComponent implements AfterContentInit, OnDestroy {
	constructor() {}

	@ContentChildren(ZippyComponent) zippers: QueryList<ZippyComponent>;

	private zippersSubscriptions = new Subscription();
	private currentExpanded: ZippyComponent;

	ngAfterContentInit() {
		this.setUpListeners();
	}

	ngOnDestroy() {
		this.zippersSubscriptions.unsubscribe();
	}

	/**
	 * Collapses previous expanded zippy and expands currently clicked zippy.
	 * @param clickedZippy Reference to zippy component that was clicked by user.
	 */

	collapseOthers(clickedZippy: ZippyComponent) {
		if (!this.currentExpanded) this.currentExpanded = clickedZippy;
		else if (this.currentExpanded !== clickedZippy) {
			this.currentExpanded.content.collapse();
			this.currentExpanded = clickedZippy;
		}
	}

	private setUpListeners() {
		this.zippers.forEach(zippy =>
			this.zippersSubscriptions.add(
				zippy.static.onClick.subscribe(this.collapseOthers.bind(this))
			)
		);
	}
}
