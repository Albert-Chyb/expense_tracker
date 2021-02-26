import { Ripple } from './ripple.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [Ripple],
	imports: [CommonModule],
	exports: [Ripple],
})
export class RippleModule {}
