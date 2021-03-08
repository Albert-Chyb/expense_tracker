import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'abs',
})
export class AbsPipe implements PipeTransform {
	/**
	 * Returns absolute value of a number.
	 */
	transform(value: number): number {
		return Math.abs(value);
	}
}
