import { Directive } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Directive({
	selector: 'files',
	host: {
		'(onReject)': 'onFileReject($event)',
	},
})
export class FilesInputErrorsDirective {
	constructor(private readonly _notifications: NotificationsService) {}

	onFileReject(error: any) {
		let message: string;

		if ('isNotAllowedType' in error) {
			message = `Próbowano dodać plik w niebsługiwanym formacie. Dozwolone typy to: ${error.allowedTypes.join(
				', '
			)}`;
		} else if ('isFileTooLarge' in error) {
			message = `Próbowano dodać zbyt duży plik. Dozwolony maksymalny rozmiar to: ${
				error.maxSize / (1024 * 1024)
			} MB`;
		}

		this._notifications.danger(message, 'Błąd podczas dodawania pliku');
	}
}
