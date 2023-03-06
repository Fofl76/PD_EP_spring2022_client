/**
 * @description Собирает объект карты из массива для последующего прямого доступа к элементам по их внутренним полям id
 * @param {Object[]} array Массив объектов, по которому нужно собрать карту
 * @param {string|function|false} [idKey=rowId] Имя поля в объекте, под которым лежит id, по умолчанию "rowId".
 * Можно передать функцию, которая первым аргументом примет элемент массива, вторым его индекс и
 * должна будет вернуть значение, которое будет являться ключом.
 * Можно передать false, тогда в качестве ключа будет взят сам элемент. Нужно для случаев, когда
 * аргумент array будет иметь тип string[]
 * @returns {Object} Возвращает объект карты вида {id: index}
 */
const buildIdMap = (array, idKey = 'rowId') => {
	let map = {}
	array.forEach((elem, index) => {
		let key
		if (typeof idKey === 'string') {
			key = elem[idKey]
		} else if (typeof idKey === 'function') {
			key = idKey(elem, index)
		} else {
			key = elem
		}

		map[key] = index
	})

	return map
}

export default buildIdMap
