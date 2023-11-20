import Vue from 'vue'
import { POSITION } from 'vue-toastification'

enum DefaultMessages {
	SUCCESS = 'Операция успешно выполнена',
	ERROR = 'Произошла неизвестная ошибка',
}

/**
 *  Сервис, позволяющий запускать уведомления из любого места.
 *
 *  Инициализация Vue-плагина происходит в main.ts
 *  @see {@link https://vue-toastification.maronato.dev | Сайт плагина}
 */
abstract class ToastService {
	static defaultOptions = {
		position: POSITION.BOTTOM_RIGHT,
		draggable: false,
		closeOnClick: false,
	}

	static showSuccess(msg: string = DefaultMessages.SUCCESS): void {
		Vue.$toast.success(msg, this.defaultOptions)
	}

	static showError(msg: string = DefaultMessages.ERROR): void {
		Vue.$toast.error(msg, this.defaultOptions)
	}
}

Object.defineProperty(window, '_ToastService', { value: ToastService })

export default ToastService
export { ToastService }
