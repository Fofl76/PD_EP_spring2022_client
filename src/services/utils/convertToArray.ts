/** Оборачивает значение в массив если это значение не является массивом
 *  @param { any } value
 * */
const convertToArray = value => (!Array.isArray(value) ? [value] : value)

export default convertToArray
