export default encodedFileName => {
	try {
		const decodedFileName = decodeURIComponent(encodedFileName)
		return decodedFileName
	} catch (error) {
		console.error('Ошибка при декодировании имени файла:', error)
		return null
	}
}
