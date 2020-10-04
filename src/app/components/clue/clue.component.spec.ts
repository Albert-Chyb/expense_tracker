import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClueComponent } from './clue.component';

describe('ClueComponent', () => {
	let component: ClueComponent;
	let fixture: ComponentFixture<ClueComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ClueComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ClueComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have `clue--fixed` class when isFixed property is set to true', () => {
		const de = fixture.debugElement.query(By.css('.clue'));
		const el: HTMLElement = de.nativeElement;

		component.isFixed = true;
		fixture.detectChanges();
		expect(el.classList.contains('clue--fixed')).toBeTruthy();

		component.isFixed = false;
		fixture.detectChanges();
		expect(el.classList.contains('clue--fixed')).toBeFalsy();
	});

	it('should have src attribute on img element the same as in the imgSrc property', () => {
		const de = fixture.debugElement.query(By.css('.clue__image'));
		const el: HTMLImageElement = de.nativeElement;

		component.imgSrc = 'aaa';
		fixture.detectChanges();
		expect(el.src).toBe(`${location.protocol}//${location.host}/aaa`);
	});
});
