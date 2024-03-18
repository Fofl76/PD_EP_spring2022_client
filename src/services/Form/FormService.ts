import _ from 'lodash'

import { getDiffObjects, hasDiffObject } from '@utils/getDiffObjects'

/**
 * Класс позволяющий работать с формами, сравнивать изначальное
 * состояние формы и текущее, можно использовать для вывода различных
 * сообщений и выключения кнопки если форма не была изменена
 */
class FormService {
	/* Начальное состояние модели формы */
	private initialModel: object = null!
	/* Состояние модели формы которое мы собираемся видоизменять */
	model: object = null!

	/**
	 * Создания экземпляра класса
	 * @param {object} [initialModel = {}] Начальное состояние формы
	 * */
	constructor(initialModel: object = {}) {
		this.init(initialModel)
	}

	/**
	 * Инициализация и пересоздание экземпляра
	 * @param {object} [initialModel = {}] Начальное состояние формы
	 * */
	init(initialModel: object = {}) {
		this.initialModel = _.cloneDeep(initialModel)
		this.model = _.cloneDeep(initialModel)
	}

	/**
	 * Установка новой формы
	 * @param {object} Новый объект модели формы
	 */
	setModel(newModel: object) {
		this.model = newModel
	}

	/**
	 * Изменение поля формы
	 * @param {string} path - Путь до ключа формы который необходимо изменить/добавить
	 * @param {value} value -Новое значение поля формы
	 */
	setProperty(path: string, value: any) {
		_.set(this.model, path, value)
	}

	/**
	 * Получение изменений в модели формы
	 * @returns {IDiffsObjects} Объект хранящий изменения формы
	 */
	getDiffs(): any {
		return getDiffObjects(this.initialModel, this.model, true)
	}

	/**
	 * Проверка наличия изменений в форме
	 * @returns {boolean} Была ли изменена форма
	 */
	hasDiffs(): boolean {
		return hasDiffObject(this.initialModel, this.model, true)
	}
}

export default FormService
export { FormService }
