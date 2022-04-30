export const average = (array: number[]) => {
  if (array && array.length > 0) return array.reduce((a, b) => a + b) / array.length
}
