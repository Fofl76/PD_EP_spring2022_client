const downloadAsFile = (data, filename) => {
	const file = new Blob([data])

	console.log(file)

	const link = document.createElement('a')
	link.download = filename
	link.href = URL.createObjectURL(file)

	link.click()
	URL.revokeObjectURL(link.href)
}

export default downloadAsFile
