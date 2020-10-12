import { MainNavComponent } from './components/main-nav/main-nav.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				AngularFireModule.initializeApp(environment.firebase),
				ServiceWorkerModule.register('ngsw-worker.js', {
					enabled: environment.production,
				}),
			],
			declarations: [AppComponent, MainHeaderComponent, MainNavComponent],
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
