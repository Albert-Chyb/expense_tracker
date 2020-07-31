import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
	selector: 'main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
	constructor(private readonly router: Router) {}

	pageName$: Observable<string>;

	ngOnInit() {
		this.pageName$ = this.router.events.pipe(
			filter(event => event instanceof ActivationEnd),
			map((event: ActivationEnd) => (event.snapshot.data.name as string) || '')
		);
	}
}
