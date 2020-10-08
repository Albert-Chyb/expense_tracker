import { first } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	async,
	ComponentFixture,
	fakeAsync,
	TestBed,
	tick,
} from '@angular/core/testing';

import { MainHeaderComponent } from './main-header.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({ template: '' })
class EmptyComponent1 {}

@Component({ template: '' })
class EmptyComponent2 {}

describe('MainHeaderComponent', () => {
	let component: MainHeaderComponent;
	let fixture: ComponentFixture<MainHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MainHeaderComponent],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule.withRoutes([
					{
						path: 'route1',
						component: EmptyComponent1,
						data: {
							name: 'a',
						},
					},
					{
						path: 'route2',
						component: EmptyComponent2,
						data: {
							name: 'b',
						},
					},
				]),
			],
		})
			.overrideComponent(MainHeaderComponent, {
				set: { changeDetection: ChangeDetectionStrategy.Default },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MainHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display current`s route name', async () => {
		const router: Router = TestBed.inject(Router);
		const de = fixture.debugElement.query(By.css('.header__heading'));
		const el: HTMLHeadingElement = de.nativeElement;

		component.ngOnInit();
		fixture.detectChanges();

		component.pageName$.subscribe(name => {
			fixture.detectChanges();

			expect(el.textContent).toBe(name);
		});

		await router.navigateByUrl('/route2');
	});
});
