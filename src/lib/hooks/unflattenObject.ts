export function unflattenObject(ob: any) {
    return Object.keys(ob).reduce((res, k) => {
        k.split('.').reduce((acc, e, i, keys) =>
                acc[e] || (acc[e] = isNaN(Number(keys[i + 1]))
                    ? keys.length - 1 === i
                        ? ob[k]
                        : {}
                    : []), res);
        return res;
    }, {} as any)
}
