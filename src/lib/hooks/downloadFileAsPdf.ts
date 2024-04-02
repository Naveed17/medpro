import {generatePdfFromHtml} from "@lib/hooks/generatePdfFromHtml";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadFileAsPdf = async (componentRef: any, fileName: string, isNew= false) => {
    if (isNew) {
        const element = document.getElementById('page0');
        element && html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save('capture.pdf');
        });
    } else {
        const file = await generatePdfFromHtml(componentRef, "blob");
        const fileURL = window.URL.createObjectURL((file as Blob));
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = fileName;
        alink.click();
    }
}
