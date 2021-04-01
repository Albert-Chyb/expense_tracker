import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
	SwipeActionsComponent,
	SwipeActionsFrontDirective,
} from './swipe-actions.component';

@NgModule({
	declarations: [SwipeActionsComponent, SwipeActionsFrontDirective],
	imports: [CommonModule],
	exports: [SwipeActionsComponent],
})
export class SwipeActionsModule {}
