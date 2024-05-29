export const getMimeTypeFromArrayBuffer = (arrayBuffer: ArrayBuffer) => {
    const uint8arr = new Uint8Array(arrayBuffer)

    const len = 4
    if (uint8arr.length >= len) {
        let signatureArr = new Array(len)
        for (let i = 0; i < len; i++)
            signatureArr[i] = (new Uint8Array(arrayBuffer))[i].toString(16)
        const signature = signatureArr.join('').toUpperCase()

        switch (signature) {
            case '89504E47':
                return {type: 'image/png', ext: 'png'}
            case '47494638':
                return {type: 'image/gif', ext: 'gif'}
            case '25504446':
                return {type: 'application/pdf', ext: 'pdf'}
            case 'FFD8FFDB':
            case 'FFD8FFE0':
                return {type: 'image/jpeg', ext: 'jpeg'}
            case '504B0304':
                return {type: 'application/zip', ext: 'zip'}
            default:
                return null
        }
    }
    return null
}
