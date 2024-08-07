import {degrees, PDFDocument, PDFFont, rgb} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {ArabicRegExp, PsychomotorDevelopmentXY, Signs} from "@lib/constants";
import {useCallback} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {getMimeTypeFromArrayBuffer, useMedicalEntitySuffix} from "@lib/hooks/index";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import moment from "moment-timezone";

function useGeneratePdfTemplate() {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {data: session} = useSession();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: user} = session as Session;
    const medical_professional = (user as UserDataResponse).medical_professional;

    const {trigger: triggerAntecedentsPatient} = useRequestQueryMutation("/antecedents/patient/get");

    const generatePdfTemplate = useCallback(async (patient: PatientModel, sheet: any) => {
        // init doc
        const pdfDoc = await PDFDocument.create();
        //init font kit
        pdfDoc.registerFontkit(fontkit);
        //load font and embed it to pdf document
        const fontBytes = await fetch("/static/fonts/KidsBoys/KidsBoys.otf").then((res) => res.arrayBuffer());
        const customFont = await pdfDoc.embedFont(fontBytes);
        //load arabic font and embed it to pdf document
        let arabicFontBytes: ArrayBuffer;
        let arabicCustomFont: PDFFont;
        if (ArabicRegExp.test(patient.firstName) || ArabicRegExp.test(patient.lastName)) {
            arabicFontBytes = await fetch("/static/fonts/arabic/arabic_regular.ttf").then((res) => res.arrayBuffer());
            arabicCustomFont = await pdfDoc.embedFont(arabicFontBytes);
        }
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
            copiedPages[0].drawImage(chartGrowth, {
                x: 420,
                y: 68,
                width: 370,
                height: 226
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
            const isArabicFont = ArabicRegExp.test(patient.firstName) || ArabicRegExp.test(patient.lastName);
            copiedPages[0].drawText(`${patient.firstName} ${patient.lastName}`, {
                x: 170,
                y: isArabicFont ? 346 : 344,
                size: isArabicFont ? 14 : 16,
                rotate: degrees(2),
                font: isArabicFont ? arabicCustomFont : customFont,
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
            // Draw Bebe parents names
            const patientParents = patient.contact.reduce((text, contact) => text = contact.contactRelation === 3 ? `${text.length > 0 ? `${text} &` : ""} Ma Maman ${contact.contactSocial?.lastName}` : (contact.contactRelation === 2 ? `${text.length > 0 ? `${text} &` : ""} Mon Papa ${contact.contactSocial?.lastName}` : text), "");
            if (patientParents.length > 0) {
                copiedPages[0].drawText(patientParents, {
                    x: patient.contact.filter(contact => [3, 2].includes(contact.contactRelation as number)).length === 2 ? 88 : 136,
                    y: 310,
                    size: 12,
                    rotate: degrees(2),
                    font: customFont,
                    color: textColor
                })
            }
            // Draw bebe weight / size
            const weight = Object.values(sheet.poids.data).slice(-1)[0] as string;
            copiedPages[0].drawText(`${weight} Kg`, {
                x: 98,
                y: 240,
                size: 14,
                font: customFont,
                color: textColor
            });
            const size = Object.values(sheet.taille.data).slice(-1)[0]?.toString();
            copiedPages[0].drawText(`${size?.slice(-3, 1) ?? "0"} m ${size?.slice(-2)}`, {
                x: 216,
                y: 240,
                size: 14,
                font: customFont,
                color: textColor
            });
            // Draw bebe eye color
            /*copiedPages[0].drawCircle({
                x: 91.2,
                y: 58.8,
                size: 2.6,
                color: textColor
            })*/
            // Draw bebe Zodiac sign
            const birthdate = moment(patient.birthdate, "DD-MM-YYYY");
            const sign = Number(new Intl.DateTimeFormat('fr-TN-u-ca-persian', {month: 'numeric'}).format(birthdate.toDate())) - 1;
            copiedPages[0].drawText(Signs[sign].split(':')[0], {
                x: 157,
                y: 208.5,
                size: 14,
                font: customFont,
                color: textColor
            });
            // Draw bebe photo
            if (patient?.hasPhoto) {
                const photoURL = (patient?.hasPhoto as any).url?.url as string;
                //const photoExtension = (patient?.hasPhoto as any).extension as string;
                const photoUrlBytes = await fetch(photoURL, {
                    // Fix CROSS origin issues with no-cache header
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                }).then((res) => res.arrayBuffer());
                const photoExtension = getMimeTypeFromArrayBuffer(photoUrlBytes);

                try {
                    const photoUrlImage = await (photoExtension?.ext === "png" ? pdfDoc.embedPng(photoUrlBytes) : pdfDoc.embedJpg(photoUrlBytes));
                    copiedPages[0].drawImage(photoUrlImage, {
                        x: 64,
                        y: 370,
                        rotate: degrees(2),
                        width: 210,
                        height: 170
                    })
                } catch (e) {
                    console.log("Draw photo error", e);
                }
            }
            // Get doctor QR code
            const canvas = document.getElementById('qr-canva')?.children[0] as HTMLCanvasElement;
            if (canvas) {
                const contentDataURL = canvas?.toDataURL('image/png');
                const qrCodeBytes = await fetch(contentDataURL).then((res) => res.arrayBuffer());
                const pngImage = await pdfDoc.embedPng(qrCodeBytes);
                const pngImageDims = pngImage.scale(0.3);
                copiedPages[0].drawImage(pngImage, {
                    x: 308.5,
                    y: 32,
                    width: pngImageDims.width,
                    height: pngImageDims.height,
                })
            }
            // Draw doctor details
            copiedPages[0].drawText(`${medical_professional?.civility.shortName} ${medical_professional?.publicName}`, {
                x: 718,
                y: 329,
                size: 16,
                font: customFont,
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
                            const data = PsychomotorDevelopmentXY.find(item => item.key === antecedent.antecedent?.slug)
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
    }, [medicalEntityHasUser, router.locale, triggerAntecedentsPatient, urlMedicalEntitySuffix]) // eslint-disable-line react-hooks/exhaustive-deps

    return {generatePdfTemplate}
}

export default useGeneratePdfTemplate;
