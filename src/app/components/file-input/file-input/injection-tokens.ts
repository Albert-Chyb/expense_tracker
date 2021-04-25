import { InjectionToken } from '@angular/core';

const path = '/assets/files-icons/';

const supportedImgTypes = [
	'image/apng',
	'image/avif',
	'image/gif',
	'image/jpeg',
	'image/png',
	'image/svg+xml',
	'image/webp',
];

// Icons made by: https://www.flaticon.com/authors/dimitry-miroliubov
const previewImages = new Map<string, string>([
	['application/pdf', path + 'pdf.svg'],
]);

export type TSupportedImgTypes = string[];
export type TPreviewImages = Map<string, string>;

/** Mime types of elements that can be displayed in an IMG element. */
export const SUPPORTED_IMG_TYPES = new InjectionToken<TSupportedImgTypes>(
	'SUPPORTED_IMG_TYPES',
	{
		factory() {
			return supportedImgTypes;
		},
	}
);

/** Contains previews of files that cannot be displayed in the IMG element. */
export const PREVIEW_IMAGES = new InjectionToken<TPreviewImages>(
	'PREVIEW_IMAGES',
	{
		factory() {
			return previewImages;
		},
	}
);
