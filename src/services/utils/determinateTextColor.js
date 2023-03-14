import hexToRGB from './hexToRGB'

/**
 * @description Возвращает белый, либо серый текст в зависимости от заднего фона, чтобы цвет текста не сливался
 * @param {string} hex HEX-цвет
 * @returns {boolean} Возвращает true если нужен темный цвет, или false если светлый
 */
const determinateTextColor = hex => {
	const rgb = hexToRGB(hex)

	const brightness = Math.round(
		(parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) /
			1000
	)

	// const textColor = brightness > 170 ? '#333' : '#fff'

	return brightness > 185
}

export default determinateTextColor
