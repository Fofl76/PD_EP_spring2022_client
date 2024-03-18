import type { IMapItemRaw } from '@models/Maps'
import _ from 'lodash'

import getRecalculatedColumn from './getRecalculatedColumn'

/**
 * @desc Утилита для конвертирования сырых данных в матрицу для таблицы
 * @param {IMapItemRaw[]} list - Массив данных для конвертирования
 * @return {IMapItemRaw[][]}
 */
const buildMapList = (list: IMapItemRaw[]) => {
	const copyTable = list
	const columns = _.groupBy(copyTable, 'num_col')

	const sortedColumns = [] as IMapItemRaw[][]

	for (const key in columns) {
		sortedColumns.push(_.sortBy(columns[key], ['num_row']))
	}

	// Воизбежаня ошибок из-за бека
	const recalculateColumns = sortedColumns.map(column => {
		return getRecalculatedColumn(column)
	})

	return recalculateColumns
}

export default buildMapList
