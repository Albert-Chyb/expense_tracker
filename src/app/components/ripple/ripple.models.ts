export type RipplePropertyName = 'duration' | 'x' | 'y' | 'size' | 'color';
export type RipplePositionStrategyName = 'center' | 'dynamic';
export type RippleTheme = 'dark' | 'light';

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

export abstract class RipplePositionStrategy
	implements IRipplePositioningStrategy {
	getPosition(
		$event: MouseEvent,
		hostRef: HTMLElement
	): { x: number; y: number } {
		throw new Error('Method not implemented.');
	}
}

export class RippleDynamicPositioningStrategy extends RipplePositionStrategy {
	static getPosition($event: MouseEvent, hostRef: HTMLElement) {
		const { offsetX, offsetY } = $event;

		return {
			x: offsetX,
			y: offsetY,
		};
	}
}

export class RippleCenterPositioningStrategy extends RipplePositionStrategy {
	static getPosition($event: MouseEvent, hostRef: HTMLElement) {
		const { width, height } = hostRef.getBoundingClientRect();

		return {
			x: width / 2,
			y: height / 2,
		};
	}
}
