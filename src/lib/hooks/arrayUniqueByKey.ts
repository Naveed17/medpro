export const arrayUniqueByKey = (key: string, array: any[]) => {
    return [...new Map(array.map(item => [item[key], item])).values()];
}
