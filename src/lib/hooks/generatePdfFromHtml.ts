import {MutableRefObject} from "react";
import {PDFDocument} from "pdf-lib";
import generatePDF from "react-to-pdf";

export const generatePdfFromHtml = async (componentRef: MutableRefObject<any[]>, type: any) => {
    const pdfDoc = await PDFDocument.create();

    for (const ref of componentRef?.current) {
        ref.classList.remove('menuTop')
        console.log("ref", ref);
        const doc = await generatePDF(() => ref, {
            filename: `report${new Date().toISOString()}.pdf`,
            method: "build",
            canvas: {
                // default is 'image/jpeg' for better size performance
                mimeType: 'image/png',
                qualityRatio: 1
            },
            overrides: {
                // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
                pdf: {
                    compress: true
                },
                // see https://html2canvas.hertzen.com/configuration for more options
                canvas: {
                    useCORS: true
                }
            }
        });
        const docData = await PDFDocument?.load(doc?.output("arraybuffer"));
        const [docPage] = await pdfDoc.copyPages(docData, [0]);
        pdfDoc.addPage(docPage);
    }

    const data = await pdfDoc.save();
    return type === "blob" ? new File([new Blob([data])], `report${new Date().toISOString()}`, {type: "application/pdf"}) : data;
}
