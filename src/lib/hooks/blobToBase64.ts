export const blobToBase64 = (blob: any) => {
    return new Promise(resolve => {
        const reader: any = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result?.split(',')[1]);
        };
        reader.readAsDataURL(blob);
    });
};
