import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
	SwipeActionsCancelSideEffects,
	SwipeActionsComponent,
} from './swipe-actions.component';

@NgModule({
	declarations: [SwipeActionsComponent, SwipeActionsCancelSideEffects],
	imports: [CommonModule],
	exports: [SwipeActionsComponent, SwipeActionsCancelSideEffects],
})
export class SwipeActionsModule {}
