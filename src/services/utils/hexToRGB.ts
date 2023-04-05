/**
 * @description Конвертирует HEX в RGB
 * @param {string} hex HEX-цвет
 * @returns {Array} Возвращает подобранный цвет текста для переданного фона
 */
const hexToRgb = (hex: string) => {
	if (!hex) return [0, 0, 0]

	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
	hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

	return result
		? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16),
		  ]
		: null
}

export default hexToRgb
