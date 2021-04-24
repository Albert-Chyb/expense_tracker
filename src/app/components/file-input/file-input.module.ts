import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputComponent } from './file-input/file-input.component';
import { ButtonModule } from '../buttons/button.module';
import { RippleModule } from '../ripple/ripple.module';

@NgModule({
	declarations: [FileInputComponent],
	imports: [CommonModule, ButtonModule, RippleModule],
	exports: [FileInputComponent],
})
export class FileInputModule {}
