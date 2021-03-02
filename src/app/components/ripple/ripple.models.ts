export type RipplePropertyName = 'duration' | 'x' | 'y' | 'size' | 'color';
export type RipplePositioningStrategyName = 'center' | 'dynamic';

export interface IRippleProperty {
	name: RipplePropertyName;
	value: string;
}

export interface IRippleConfig {
	x: number;
	y: number;
	size: number;
}

export interface IRipplePositioningStrategy {
	getPosition(
		$event: MouseEvent,
		hostRef: HTMLElement
	): { x: number; y: number };
}

export abstract class RipplePositioningStrategy
	implements IRipplePositioningStrategy {
	getPosition(
		$event: MouseEvent,
		hostRef: HTMLElement
	): { x: number; y: number } {
		throw new Error('Method not implemented.');
	}
}

export class RippleDynamicPositioningStrategy extends RipplePositioningStrategy {
	static getPosition($event: MouseEvent, hostRef: HTMLElement) {
		const { offsetX, offsetY } = $event;

		return {
			x: offsetX,
			y: offsetY,
		};
	}
}

export class RippleCenterPositioningStrategy extends RipplePositioningStrategy {
	static getPosition($event: MouseEvent, hostRef: HTMLElement) {
		const { width, height } = hostRef.getBoundingClientRect();

		return {
			x: width / 2,
			y: height / 2,
		};
	}
}
