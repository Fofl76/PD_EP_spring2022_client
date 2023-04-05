import hexToRGB from './hexToRGB'

/**
 * @description Возвращает белый, либо серый текст в зависимости от заднего фона, чтобы цвет текста не сливался
 * @param {string} hex HEX-цвет
 * @returns {boolean} Возвращает true если нужен темный цвет, или false если светлый
 */
const determinateTextColor = (hex: string) => {
	if (!hex) return false

	const rgb = hexToRGB(hex)

	if (!rgb) return hex

	const brightness = Math.round(
		(rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
	)

	return brightness > 185
}

export default determinateTextColor
