import { SelectOption } from './../../common/models/selectItem';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-select-item',
	templateUrl: './select-item.component.html',
	styleUrls: ['./select-item.component.scss'],
})
export class SelectItemComponent implements OnInit {
	constructor() {}

	@Input('value') value: string;
	@Input('viewValue') viewValue: string;
	@Output('onSelect') onSelectEmitter = new EventEmitter<SelectOption>();

	ngOnInit() {}

	emitSelect() {
		this.onSelectEmitter.emit(this.item);
	}

	get item() {
		return { value: this.value, view: this.viewValue };
	}
}
