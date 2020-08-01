import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './app-settings.component.html',
	styleUrls: ['./app-settings.component.scss'],
})
export class AppSettingsComponent implements OnInit {
	constructor() {}

	form = new FormGroup({
		autoEndAfter: new FormControl(),
	});

	ngOnInit() {}
}
