import { ZippyContentComponent } from './../zippy-content/zippy-content.component';
import { ZippyStaticComponent } from './../zippy-static/zippy-static.component';
import {
	Component,
	OnInit,
	ContentChild,
	AfterContentInit,
} from '@angular/core';

@Component({
	selector: 'zippy',
	templateUrl: './zippy.component.html',
	styleUrls: ['./zippy.component.scss'],
})
export class ZippyComponent implements OnInit, AfterContentInit {
	constructor() {}

	@ContentChild(ZippyStaticComponent, { static: false })
	static: ZippyStaticComponent;
	@ContentChild(ZippyContentComponent, { static: false })
	content: ZippyContentComponent;

	ngOnInit() {}

	ngAfterContentInit() {
		this.static.onClick.subscribe($event => this.content.toggle());
	}
}
