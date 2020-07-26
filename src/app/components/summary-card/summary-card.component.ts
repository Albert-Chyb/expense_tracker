import { Component, OnInit, Input } from '@angular/core';

type summaryCardTheme =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning';
type summaryCardType = 'big' | 'small';

@Component({
	selector: 'summary-card',
	templateUrl: './summary-card.component.html',
	styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent implements OnInit {
	constructor() {}

	@Input('theme') themeColor: summaryCardTheme;
	@Input('type') type: summaryCardType;

	ngOnInit() {}

	get classes() {
		return [`summary--${this.themeColor}`, `summary--${this.type}`];
	}
}
