import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { ProgressSpinnerFixedDirective } from './progress-spinner-fixed/progress-spinner-fixed.directive';

@NgModule({
	declarations: [ProgressSpinnerComponent, ProgressSpinnerFixedDirective],
	imports: [CommonModule],
	exports: [ProgressSpinnerComponent, ProgressSpinnerFixedDirective],
})
export class ProgressSpinnerModule {}
