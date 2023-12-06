const isObject = (obj: any) => {
	return obj !== null && typeof obj === 'object'
}

const getDiffObjects = (oldObj: {}, newObj: {}, deep = false) => {
	const added = {}
	const updated = {}
	const removed = {}
	const unchanged = {}

	for (const oldProp in oldObj) {
		if (Object.prototype.hasOwnProperty.call(oldObj, oldProp)) {
			const newPropValue = newObj[oldProp]
			const oldPropValue = oldObj[oldProp]
			if (Object.prototype.hasOwnProperty.call(newObj, oldProp)) {
				if (newPropValue === oldPropValue) {
					unchanged[oldProp] = oldPropValue
				} else {
					updated[oldProp] =
						deep && isObject(oldPropValue) && isObject(newPropValue)
							? getDiffObjects(oldPropValue, newPropValue, deep)
							: { newValue: newPropValue }
				}
			} else {
				removed[oldProp] = oldPropValue
			}
		}
	}

	for (const newProp in newObj) {
		if (Object.prototype.hasOwnProperty.call(newObj, newProp)) {
			const oldPropValue = oldObj[newProp]
			const newPropValue = newObj[newProp]
			if (Object.prototype.hasOwnProperty.call(oldObj, newProp)) {
				if (oldPropValue !== newPropValue) {
					if (!deep || !isObject(oldPropValue)) {
						updated[newProp].oldValue = oldPropValue
					}
				}
			} else {
				added[newProp] = newPropValue
			}
		}
	}

	return { added, updated, removed, unchanged }
}

const hasDiffObject = (oldObj: {}, newObj: {}, deep = false) => {
	const diffs = getDiffObjects(oldObj, newObj, deep)

	return (
		Object.keys(diffs.added).length > 0 ||
		Object.keys(diffs.removed).length > 0 ||
		Object.keys(diffs.updated).length > 0
	)
}

export default getDiffObjects
export { hasDiffObject, getDiffObjects }
