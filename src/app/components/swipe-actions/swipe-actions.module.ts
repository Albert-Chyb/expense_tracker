import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import {
	HammerGestureConfig,
	HammerModule,
	HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';

import { SwipeActionsCancelSideEffects } from './cancel-side-effects.directive';
import {
	SwipeActionLeftDirective,
	SwipeActionRightDirective,
} from './swipe-action.directive';
import { SwipeActionsComponent } from './swipe-actions.component';
import 'hammerjs';

@Injectable()
class SwipeActionsHammerConfig extends HammerGestureConfig {
	buildHammer(el: HTMLElement) {
		return new Hammer(el, {
			inputClass: Hammer.TouchInput,
		});
	}
}

@NgModule({
	declarations: [
		SwipeActionsComponent,
		SwipeActionsCancelSideEffects,
		SwipeActionLeftDirective,
		SwipeActionRightDirective,
	],
	imports: [CommonModule, HammerModule],
	exports: [
		SwipeActionsComponent,
		SwipeActionsCancelSideEffects,
		SwipeActionLeftDirective,
		SwipeActionRightDirective,
	],
	providers: [
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: SwipeActionsHammerConfig,
		},
	],
})
export class SwipeActionsModule {}
