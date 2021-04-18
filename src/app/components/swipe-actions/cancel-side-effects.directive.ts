import { Directive, HostListener, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { SwipeActionsComponent } from './swipe-actions.component';

/**
 * When user stopped dragging the front element, the click event that was invoked by it, might trigger some actions.
 * (for instance routerLink might change the route). This is a helper directive that calls stopPropagation and preventDefault methods
 * on the event object. Make sure that element with this directive is a child of an element that triggers side effects.
 */
@Directive({ selector: '[cancel-side-effects]' })
export class SwipeActionsCancelSideEffects {
	@Input() swipeActionsRef: SwipeActionsComponent;
	private _onClick = new Subject<MouseEvent>();

	@HostListener('click', ['$event']) preventSideEffects($event: MouseEvent) {
		if (this.swipeActionsRef.ghostClick || this.swipeActionsRef.isOpened) {
			$event.stopPropagation();
			$event.preventDefault();
		}

		this.onClick.next($event);
	}

	get onClick() {
		return this._onClick;
	}
}
