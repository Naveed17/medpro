import {generatePdfFromHtml} from "@lib/hooks/generatePdfFromHtml";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadFileAsPdf = async (componentRef: any, fileName: string, isNew= false,setDownloadMode:any,format:string) => {
        const file = await generatePdfFromHtml(componentRef, "blob",format);
        const fileURL = window.URL.createObjectURL((file as Blob));
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = fileName;
        alink.click();
        setDownloadMode && setDownloadMode(false);

}
