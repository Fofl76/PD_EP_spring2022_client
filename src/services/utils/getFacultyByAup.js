export default (aupCode, mapsList) => {
	let direction = null

	const faculty = mapsList.find(faculty => {
		const currentDirection = faculty.data.find(data => data.map_id === aupCode)

		if (currentDirection) {
			direction = currentDirection
			return true
		}
	})

	return { direction, faculty }
}
