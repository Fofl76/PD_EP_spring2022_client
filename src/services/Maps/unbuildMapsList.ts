import { IMapItemRaw } from "@models/Maps"
import _ from "lodash"

/**
 * @desc Утилита для конвертирования двумерной матрицы в стандартный массив
 * @param {IMapItemRaw[][]} list - Двумерная матрица для конвертирования 
 * @return {IMapItemRaw[]}
 */
const unbuildMapList = (list: IMapItemRaw[][]) => {
  const copyTable = list

  return _.flattenDeep(copyTable)
}

export default unbuildMapList