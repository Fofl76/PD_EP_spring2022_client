import isObject from '@utils/isObject'
import _ from 'lodash'

interface IDiffsObjectsUpdate {
	oldValue: any
	newValue: any
}

interface IDiffsObjects {
	added: {} | IDiffsObjects
	updated: {
		[propName: string]: IDiffsObjectsUpdate | IDiffsObjects
	}
	removed: {} | IDiffsObjects
	unchanged: {} | IDiffsObjects
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
				if (_.isEqual(newPropValue, oldPropValue)) {
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
				if (!_.isEqual(newPropValue, oldPropValue)) {
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

Object.defineProperty(window, '_getDiffObjects', { value: getDiffObjects })
Object.defineProperty(window, '_hasDiffObject', { value: hasDiffObject })

export default getDiffObjects
export { hasDiffObject, getDiffObjects }
export { IDiffsObjectsUpdate, IDiffsObjects }
