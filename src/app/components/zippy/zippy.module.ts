import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ZippyListComponent,
	ZippyComponent,
	ZippyContentComponent,
} from './zippy.component';

@NgModule({
	declarations: [ZippyComponent, ZippyContentComponent, ZippyListComponent],
	imports: [CommonModule],
	exports: [ZippyComponent, ZippyContentComponent, ZippyListComponent],
})
export class ZippyModule {}
