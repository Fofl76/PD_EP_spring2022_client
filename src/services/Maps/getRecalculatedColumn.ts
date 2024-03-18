import type { IMapItemRaw } from '@models/Maps'

/**
 * @desc Утилита для перерасчета индексов строк в колонке
 * @param {IMapItemRaw[]} column - Колонка для перерасчета
 * @return {IMapItemRaw[]}
 */
const getRecalculatedColumn = (column: IMapItemRaw[]) => {
	return column.map((el, index) => ({
		...el,
		num_row: index,
	}))
}

export default getRecalculatedColumn
