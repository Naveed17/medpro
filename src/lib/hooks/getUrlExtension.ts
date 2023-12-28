export const getUrlExtension = (url: string, key: string) => {
    // The regex to match file name and extension
    const regex = /([^\/]+)\.([^\/]+)$/i;
    // Apply the regex to the URL
    const match = url.match(regex);
    // Get the file extension from the second capture group
    return match ? match[2].split(key)[0] : null;
}
