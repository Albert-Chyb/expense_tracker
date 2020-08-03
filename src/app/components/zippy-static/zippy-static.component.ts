import {
	Component,
	OnInit,
	HostListener,
	Output,
	EventEmitter,
} from '@angular/core';

@Component({
	selector: 'zippy-static',
	templateUrl: './zippy-static.component.html',
	styleUrls: ['./zippy-static.component.scss'],
})
export class ZippyStaticComponent implements OnInit {
	constructor() {}

	@Output() onClick = new EventEmitter();

	@HostListener('click', ['$event']) emitClick($event) {
		this.onClick.emit($event);
	}

	ngOnInit() {}
}
