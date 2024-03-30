import {degrees, PDFDocument, rgb} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {PsychomotorDevelopmentXY} from "@lib/constants";
import {useCallback} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks/index";
import {useRouter} from "next/router";

function useGeneratePdfTemplate() {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {trigger: triggerAntecedentsPatient} = useRequestQueryMutation("/antecedents/patient/get");

    const generatePdfTemplate = useCallback(async (patient: PatientModel, sheet: any) => {
        // init doc
        const pdfDoc = await PDFDocument.create();
        //init font kit
        pdfDoc.registerFontkit(fontkit);
        //load font and embed it to pdf document
        const fontBytes = await fetch("/static/fonts/KidsBoys/KidsBoys.otf").then((res) => res.arrayBuffer());
        const customFont = await pdfDoc.embedFont(fontBytes);
        // load template pdf
        const docFile = await fetch(`/static/files/bebe-template-${patient.gender === "M" ? 'bleu' : 'pink'}.pdf`).then((res) => res.arrayBuffer());
        const templatePdfDoc = await PDFDocument.load(docFile);
        const pinkColor = rgb(0.9450980392156862, 0.4470588235294118, 0.6);
        const bleuColor = rgb(0, 0.6823529411764706, 0.9372549019607843);
        const textColor = patient.gender === "M" ? bleuColor : pinkColor;
        const copiedPages = await pdfDoc.copyPages(templatePdfDoc, templatePdfDoc.getPageIndices());
        // ApexCharts export chart image
        ApexCharts.exec("chart-growth", "dataURI").then(async ({imgURI}: any) => {
            const chartGrowthBytes = await fetch(imgURI).then((res) => res.arrayBuffer())
            const chartGrowth = await pdfDoc.embedPng(chartGrowthBytes);
            const chartGrowthDims = chartGrowth.scale(0.35);
            copiedPages[0].drawImage(chartGrowth, {
                x: 420,
                y: 68,
                width: chartGrowthDims.width,
                height: chartGrowthDims.height,
            })
            // draw bebe coordination
            copiedPages[0].drawText('Je m\'appelle', {
                x: 115,
                y: 342,
                size: 12,
                rotate: degrees(2),
                font: customFont,
                color: textColor
            })
            copiedPages[0].drawText(`${patient.firstName} ${patient.lastName}`, {
                x: 170,
                y: 344,
                size: 16,
                rotate: degrees(2),
                font: customFont,
                color: textColor
            })
            copiedPages[0].drawText(`née le ${patient.birthdate}`, {
                x: 134,
                y: 326,
                size: 12,
                rotate: degrees(2),
                font: customFont,
                color: textColor
            })
            copiedPages[0].drawText(`Ma Maman Salma & Mon Papa Sélim`, {
                x: 110,
                y: 310,
                size: 12,
                rotate: degrees(2),
                font: customFont,
                color: textColor
            })
            // Draw bebe weight / size
            const weight = Object.values(sheet.poids.data).slice(-1)[0] as string;
            copiedPages[0].drawText(`${weight} Kg`, {
                x: 98,
                y: 240,
                size: 14,
                font: customFont,
                color: textColor
            })

            const size = Object.values(sheet.taille.data).slice(-1)[0]?.toString();
            copiedPages[0].drawText(`${size?.slice(-3, 1) ?? "0"} m ${size?.slice(-2)}`, {
                x: 216,
                y: 240,
                size: 14,
                font: customFont,
                color: textColor
            })
            // Draw bebe eye color
            copiedPages[0].drawCircle({
                x: 91.2,
                y: 58.8,
                size: 2.6,
                color: textColor
            })

            // Get patient antecedents
            medicalEntityHasUser && triggerAntecedentsPatient({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient.uuid}/antecedents/${router.locale}`
            }, {
                onSuccess: (result) => {
                    // Draw bebe First acts
                    const antecedents = ((result?.data as HttpResponse)?.data['Développementpsychomoteur'] ?? []) as AntecedentsModel[];
                    if (antecedents) {
                        antecedents.forEach((antecedent) => {
                            const data = PsychomotorDevelopmentXY.find(item => item.key === antecedent.name)
                            data?.coordinates && Object.keys(data.coordinates).forEach(key => {
                                if (antecedent[key as keyof typeof antecedent]) {
                                    const coordinates = data?.coordinates[key as keyof typeof data.coordinates];
                                    copiedPages[0].drawText(antecedent[key as keyof typeof antecedent], {
                                        x: coordinates?.x,
                                        y: coordinates?.y,
                                        size: coordinates?.size,
                                        font: customFont,
                                        color: textColor
                                    })
                                }
                            })
                        })

                    }
                },
                onSettled: async () => {
                    // Add page tok pdf file
                    pdfDoc.addPage(copiedPages[0]);
                    // Save as base64
                    const mergedPdf = await pdfDoc.saveAsBase64();
                    // Dynamic import print-js and print file
                    const printJS = (await import('print-js')).default
                    printJS({printable: mergedPdf, type: 'pdf', base64: true})
                }
            });
        });
    }, [medicalEntityHasUser, router.locale, triggerAntecedentsPatient, urlMedicalEntitySuffix])

    return {generatePdfTemplate}
}

export default useGeneratePdfTemplate;
