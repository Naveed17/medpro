export function mergeArrayByKey(array1: any[], array2: any[], key: string) {
    const mergedMap = new Map();
    array1.forEach((item) => mergedMap.set(item[key], {...item}));
    array2.forEach((item) => mergedMap.set(item[key], {...mergedMap.get(item[key]), ...item}));
    return Array.from(mergedMap.values());
}
