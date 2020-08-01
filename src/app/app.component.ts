import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		registerLocaleData(localePL);

		(window as any).FontAwesomeConfig = {
			searchPseudoElements: true,
		};
	}
}
