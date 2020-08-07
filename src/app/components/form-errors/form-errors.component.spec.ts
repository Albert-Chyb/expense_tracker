import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormErrorsService } from './../../services/form-errors/form-errors.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorsComponent } from './form-errors.component';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('FormErrorsComponent', () => {
	let component: FormErrorsComponent;
	let fixture: ComponentFixture<FormErrorsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FormErrorsComponent],
			imports: [BrowserAnimationsModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FormErrorsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render all errors from the array', () => {
		const service: FormErrorsService = TestBed.get(FormErrorsService);
		const errors = {
			required: true,
			maxlength: true,
		};
		spyOn(service, 'get').and.callFake((group, name) => {
			if (name === 'required') return 'Email jest wymagany';
			else if (name === 'maxlength') return 'Email nie może być dłuższy niż';
		});

		component.group = 'email';
		component.control = new FormControl();
		component.control.setErrors(errors);
		component['stateMatcher'] = {
			match: () => false,
		};
		component['renderErrors']();

		fixture.detectChanges();
		const de = fixture.debugElement.queryAll(By.css('.form__error'));

		expect(de[0].nativeElement.textContent).toContain('Email jest wymagany');
		expect(de[1].nativeElement.textContent).toContain(
			'Email nie może być dłuższy niż'
		);
	});

	describe('ngOnInit', () => {
		it('should subscribe to statusChanges of form control', () => {
			component.control = new FormControl();
			const spy = spyOn(component.control.statusChanges, 'subscribe');

			component.ngOnInit();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('renderErrors', () => {
		it('should push all errors messages to the array', () => {
			const service: FormErrorsService = TestBed.get(FormErrorsService);
			const errors = {
				required: true,
				maxlength: true,
			};

			spyOn(service, 'get').and.callFake((group, name) => {
				if (name === 'required') return 'Email jest wymagany';
				else if (name === 'maxlength') return 'Email nie może być dłuższu niż';
			});

			component.group = 'email';
			component.control = new FormControl();
			component.control.setErrors(errors);
			component['stateMatcher'] = {
				match: () => false,
			};

			component['renderErrors']();
			expect(component.errors).toEqual([
				'Email jest wymagany',
				'Email nie może być dłuższu niż',
			]);
		});
	});
});
