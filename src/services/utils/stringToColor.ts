/**
 * @description Генерирует цвет на основе строки
 * @param {string} str Строка
 * @returns {string} hsl строки
 */
const stringToColor = (str: string) => {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}

	return `hsl(${hash % 360}, 100%, 30%)`
}

export default stringToColor
