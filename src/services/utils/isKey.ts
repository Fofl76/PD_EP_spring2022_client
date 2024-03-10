const isKey = value =>
	typeof value === 'string' || (typeof value === 'number' && !isNaN(value))

export default isKey
