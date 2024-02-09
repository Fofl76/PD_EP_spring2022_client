import Vue from 'vue'
import { POSITION } from 'vue-toastification'
import MToast from '@components/common/MToast.vue'

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
		position: POSITION.BOTTOM_LEFT,
		draggable: false,
		closeOnClick: false,
	}

	static showSuccess(
		text: string = DefaultMessages.SUCCESS,
		title: string = ''
	): void {
		Vue.$toast.success(
			{ component: MToast, props: { title, text } },
			this.defaultOptions
		)
	}

	static showError(
		text: string = DefaultMessages.ERROR,
		title: string = ''
	): void {
		Vue.$toast.error(
			{ component: MToast, props: { title, text } },
			this.defaultOptions
		)
	}
}

Object.defineProperty(window, '_ToastService', { value: ToastService })

export default ToastService
export { ToastService }
