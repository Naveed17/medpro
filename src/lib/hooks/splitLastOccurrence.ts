export const splitLastOccurrence = (str: string, substring: string) => {
    const arr = str.split(substring);

    const after = arr.pop();

    const before = arr.join(substring);

    return [before, after];
}
