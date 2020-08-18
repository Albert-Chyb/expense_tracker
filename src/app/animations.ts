import {
	animation,
	style,
	animate,
	trigger,
	query,
	useAnimation,
	transition,
	AnimationQueryOptions,
} from '@angular/animations';

export const fadeIn = animation(
	[style({ opacity: 0 }), animate('{{ duration }} {{ easing }}')],
	{
		params: {
			duration: '150ms',
			easing: 'ease-out',
		},
	}
);

export const fadeOut = animation(
	animate('{{ duration }} {{ easing }}', style({ opacity: 0 })),
	{
		params: {
			duration: '150ms',
			easing: 'ease-in',
		},
	}
);

const optional: AnimationQueryOptions = { optional: true };

export const routeAnimations = trigger('routeAnimations', [
	transition('* => *', [
		query(':enter', style({ opacity: 0 }), optional),
		query(':leave', useAnimation(fadeOut), optional),
		query(':enter', useAnimation(fadeIn), optional),
	]),
]);
