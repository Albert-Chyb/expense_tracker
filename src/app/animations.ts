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

/** Default params for animations */
const params = {
	duration: '150ms',
	easing: 'ease-out',
	delay: '0ms',
};
const optional: AnimationQueryOptions = { optional: true };

export const fadeIn = animation(
	[style({ opacity: 0 }), animate('{{ duration }} {{ delay }} {{ easing }}')],
	{ params }
);

export const fadeOut = animation(
	animate('{{ duration }} {{ delay }} {{ easing }}', style({ opacity: 0 })),
	{ params }
);

export const routeAnimations = trigger('routeAnimations', [
	transition('* => *', [
		query(':enter', style({ opacity: 0 }), optional),
		query(':leave', useAnimation(fadeOut), optional),
		query(':enter', useAnimation(fadeIn), optional),
	]),
]);
