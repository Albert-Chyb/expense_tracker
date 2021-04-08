import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
	SwipeActionLeftDirective,
	SwipeActionRightDirective,
	SwipeActionsCancelSideEffects,
	SwipeActionsComponent,
} from './swipe-actions.component';

@NgModule({
	declarations: [
		SwipeActionsComponent,
		SwipeActionsCancelSideEffects,
		SwipeActionLeftDirective,
		SwipeActionRightDirective,
	],
	imports: [CommonModule],
	exports: [
		SwipeActionsComponent,
		SwipeActionsCancelSideEffects,
		SwipeActionLeftDirective,
		SwipeActionRightDirective,
	],
})
export class SwipeActionsModule {}
