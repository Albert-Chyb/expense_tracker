import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ZippyListComponent,
	ZippyComponent,
	ZippyContentComponent,
	ZippyStaticComponent,
} from './zippy.component';

@NgModule({
	declarations: [
		ZippyComponent,
		ZippyContentComponent,
		ZippyStaticComponent,
		ZippyListComponent,
	],
	imports: [CommonModule],
	exports: [
		ZippyComponent,
		ZippyContentComponent,
		ZippyStaticComponent,
		ZippyListComponent,
	],
})
export class ZippyModule {}
