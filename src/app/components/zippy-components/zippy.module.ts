import { ZippyStaticComponent } from 'src/app/components/zippy-components/zippy-static/zippy-static.component';
import { ZippyListComponent } from './zippy-list/zippy-list.component';
import { ZippyContentComponent } from 'src/app/components/zippy-components/zippy-content/zippy-content.component';
import { ZippyComponent } from 'src/app/components/zippy-components/zippy/zippy.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [
		ZippyComponent,
		ZippyContentComponent,
		ZippyListComponent,
		ZippyStaticComponent,
	],
	exports: [
		ZippyComponent,
		ZippyContentComponent,
		ZippyListComponent,
		ZippyStaticComponent,
	],
	imports: [CommonModule],
})
export class ZippyModule {}
