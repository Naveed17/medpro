import React, {useEffect, useState} from "react";
import {Page} from "@features/page";
import html2canvas from "html2canvas";
import {prescriptionPreviewDosage} from "@lib/hooks";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

function Doc({...props}) {

    const [pages, setPages] = useState<string[]>([])
    const [onReSize, setOnResize] = useState(true)
    const [title, setTitle] = useState("Titre");

    const {data, setData, state, date} = props

    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;


    const createPageContent = () => {
        if (state) {
            let elx = "";

            switch (state.type) {
                case "prescription":
                    state.info.map((el: any, index: number) => {
                        console.log(el)
                        const child = document.createElement('p');
                        child.append()
                        elx += `<p>${index + 1} • ${el.standard_drug.commercial_name}</p>`
                        el.cycles.map((cycle: any, index: number) => {
                            let val = cycle.dosage ? `- ${prescriptionPreviewDosage(cycle.dosage)}` : ''
                            if (cycle.duration)
                                val += ` pendant ${cycle.duration} ${(cycle.durationType)}`
                            if (cycle.note)
                                val += ` (${cycle.note})`;
                            const child = document.createElement('p');
                            child.append(val);
                            elx += `<p>${val}</p>`

                        })
                    })

                    setTitle("ORDONNANCE MEDICALE");
                    break;
                case "requested-analysis":
                    const value = `<p>Prière de faire les explorations biologiques suivantes à ${state.patient} :</p>`
                    elx += value
                    state.info.map((el: any, index: number) => {
                        elx += `<p>• ${el.analysis.name}</p>`
                        if (el.note) elx += `<p>• ${el.note}</p>`
                    })

                    setTitle("Bilan Biologique");
                    break;
                case "requested-medical-imaging":
                    const val = `<p>Prière de faire les explorations radiologiques suivantes à ${state.patient} :</p>`
                    elx += val
                    state.info.map((el: any, index: number) => {
                        elx += `<p>• ${el['medical-imaging']?.name}</p>`
                        if (el.note) elx += `<p>• ${el.note}</p>`
                    })

                    setTitle("Imagerie médicale");
                    break;
                case "fees":
                case "quote":
                    let total = 0;
                    elx = "<table>"
                    elx += `<tr>
                                    <td>NOM</td>
                                    <td>PRIX</td>
                                    <td>QTE</td>
                                    <td>TOTAL</td>
                                </tr>`
                    state.info.map((el: any, index: number) => {
                        total += el.qte * el.fees;
                        elx += `<tr>
                                        <td> ${el.act.name}</td>
                                        <td>${el.fees} ${devise}</td>
                                        <td>${el.qte}</td>
                                        <td>${el.qte * el.fees} ${devise}</td>
                                    </tr>`
                    });

                    elx += `<tr>
                                        <td> Total</td>
                                        <td></td>
                                        <td></td>
                                        <td>${total} ${devise}</td>
                                    </tr>`
                    elx += "</table>"

                    setTitle(state.type == "fees" ? "Note d'honoraires" : "Devis");

                    break;
            }

            data.content.content = elx
            setData({...data})
        }

        console.log(state.info)

    }


    useEffect(() => {
        if (state)
            if (state.info)
                createPageContent()
    }, [state])

    useEffect(() => {
        if (onReSize) {
            splitContent(state && state.content ? state.content : data.content.content)
            setOnResize(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onReSize])

    useEffect(() => {
        if (pages.length > 0) {
            const resizable = document.getElementsByClassName('resizable');
            const contentDiv = document.getElementById("contentDiv")

            if (contentDiv) {
                let canvasWidth = contentDiv.offsetWidth * 2; // Adjust this value as needed
                let canvasHeight = data.content.maxHeight * 2; // Adjust this value as needed

                var paragraphs = contentDiv.getElementsByTagName('p');
                for (let i = 0; i < paragraphs.length; i++) {
                    paragraphs[i].style.margin = '15px'; // Ajustez cette valeur au besoin
                }

                contentDiv.style.visibility = "visible"
                pages.map((_, index) => {
                    let canvas = document.getElementById(`content${index}`) as HTMLCanvasElement;
                    let ctx = canvas.getContext('2d', {willReadFrequently: true});
                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;
                    console.log(ctx)
                    if (ctx)
                        html2canvas(contentDiv).then(function (canvas) {
                            ctx?.drawImage(canvas, 0, index * -1 * data.content.maxHeight * 2);
                        });
                    if (data.content.width) {
                        const el = resizable[index] as HTMLElement;
                        el.style.width = `${data.content.width}px`;
                        el.style.height = `${data.content.maxHeight}px`;
                    }
                })
                contentDiv.style.visibility = "hidden";
                contentDiv.style.position = "absolute";
                contentDiv.style.top = "0";

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages])


    const splitContent = (content: string) => {
        const contentDiv = document.getElementById("contentDiv")
        if (contentDiv) {
            const _width = data.content.width ? `${data.content.width}px` : document.getElementById(`content0`)?.clientWidth + "px";
            contentDiv.innerHTML = content;
            contentDiv.style.width = _width;
            const nbPage = Math.ceil(contentDiv.clientHeight / data.content.maxHeight);
            setPages(new Array(nbPage).fill(''))
        }
    }


    return (
        <>

            {
                pages.map((page, index) => (
                    <Page key={index} {...{data, setData, state, id: index, onReSize, setOnResize, date, title}}/>
                ))
            }
            <div id={"contentDiv"} style={{visibility: "hidden"}}/>
        </>
    )
}

export default Doc
