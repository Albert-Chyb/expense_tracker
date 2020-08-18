import {
	animation,
	style,
	animate,
	trigger,
	query,
	useAnimation,
	transition,
	AnimationQueryOptions,
	group,
	state,
} from '@angular/animations';

const optional: AnimationQueryOptions = { optional: true };

export const fadeIn = animation(
	[style({ opacity: 0 }), animate('{{ duration }} {{ delay }} {{ easing }}')],
	{
		params: {
			duration: '150ms',
			easing: 'ease-out',
			delay: '0ms',
		},
	}
);

export const fadeOut = animation(
	animate('{{ duration }} {{ delay }} {{ easing }}', style({ opacity: 0 })),
	{
		params: {
			duration: '150ms',
			easing: 'ease-in',
			delay: '0ms',
		},
	}
);

export const slideInTop = animation(
	[
		style({
			transform: 'translateY(-100%)',
		}),
		animate('{{ duration }} {{ delay }} {{ easing }}'),
	],
	{
		params: {
			duration: '150ms',
			easing: 'ease-out',
			delay: '0ms',
		},
	}
);

export const slideOutBottom = animation(
	[
		animate(
			'{{ duration }} {{ delay }} {{ easing }}',
			style({
				transform: 'translateY(100%)',
			})
		),
	],
	{
		params: {
			duration: '150ms',
			easing: 'ease-in',
			delay: '0ms',
		},
	}
);

export const zoomOut = animation(
	[
		animate(
			'{{ duration }} {{ delay }} {{ easing }}',
			style({ transform: 'scale3d(0.3, 0.3, 0.3)' })
		),
	],
	{
		params: {
			duration: '150ms',
			easing: 'ease-in',
			delay: '0ms',
		},
	}
);

export const routeAnimation = trigger('routeAnimation', [
	transition('* => *', [
		query(':enter', style({ opacity: 0 }), optional),
		query(':leave', useAnimation(fadeOut), optional),
		query(':enter', useAnimation(fadeIn), optional),
	]),
]);

export const formErrorAnimation = trigger('errorAnimation', [
	transition(':enter', [
		group([useAnimation(slideInTop), useAnimation(fadeIn)]),
	]),
	transition(':leave', [
		style({
			position: 'absolute',
			top: 0,
			left: 0,
		}),

		group([useAnimation(slideOutBottom), useAnimation(fadeOut)]),
	]),
]);

export const zippyAnimation = trigger('zippyAnimation', [
	state('collapsed', style({ height: 0, opacity: 0 })),

	transition('collapsed => expanded', animate('200ms ease-out')),
	transition('expanded => collapsed', animate('200ms ease-in')),
]);

export const groupAnimation = trigger('groupAnimation', [
	transition(
		':leave',
		group([useAnimation(zoomOut), useAnimation(fadeOut)], {
			params: { duration: '300ms' },
		})
	),
]);
