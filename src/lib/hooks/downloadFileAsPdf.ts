import {generatePdfFromHtml} from "@lib/hooks/generatePdfFromHtml";

export const downloadFileAsPdf = async (componentRef: any, fileName: string, isNew = false, setDownloadMode: any, format: string, orientation: string) => {
    const file = await generatePdfFromHtml(componentRef, "blob", format, orientation);
    const fileURL = window.URL.createObjectURL((file as Blob));
    let alink = document.createElement('a');
    alink.href = fileURL;
    alink.download = fileName;
    alink.click();
    setDownloadMode && setDownloadMode(false);

}
