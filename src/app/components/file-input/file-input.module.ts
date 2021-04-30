import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from '../buttons/button.module';
import { RippleModule } from '../ripple/ripple.module';
import { FileInputComponent } from './file-input/file-input.component';
import { FilesContainerComponent } from './files-container/files-container.component';

@NgModule({
	declarations: [FileInputComponent, FilesContainerComponent],
	imports: [CommonModule, ButtonModule, RippleModule, ReactiveFormsModule],
	exports: [FilesContainerComponent],
})
export class FileInputModule {}
