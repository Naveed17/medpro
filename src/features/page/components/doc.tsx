import React, {useEffect, useState} from "react";
import {Page} from "@features/page";
import {prescriptionPreviewDosage} from "@lib/hooks";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import PageStyled from "@features/page/components/overrides/pageStyled";
import {Box} from "@mui/material";

function Doc({...props}) {

    const [pages, setPages] = useState<string[]>([])
    const [title, setTitle] = useState("Titre");
    const [loading, setLoading] = useState(true);

    const {data, setData, state, date, header, setHeader, onReSize, setOnResize} = props
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

                        const child = document.createElement('p');
                        child.append()
                        elx += `<p>${index + 1} • ${el.standard_drug.commercial_name}</p>`
                        el.cycles.map((cycle: any) => {
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
                    state.info.map((el: any) => {
                        elx += `<p>• ${el.analysis.name}</p>`
                        if (el.note) elx += `<p>• ${el.note}</p>`
                    })

                    setTitle("Bilan Biologique");
                    break;
                case "requested-medical-imaging":
                    const val = `<p>Prière de faire les explorations radiologiques suivantes à ${state.patient} :</p>`
                    elx += val
                    state.info.map((el: any) => {
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
                    state.info.map((el: any) => {
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
    }

    useEffect(() => {
        if (state)
            if (state.info)
                createPageContent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            const container = document.getElementById("containerx")

            if (contentDiv && container) {
                var paragraphs = container.getElementsByTagName('p');
                for (let i = 0; i < paragraphs.length; i++) {
                    paragraphs[i].style.marginTop = paragraphs[i].style.fontSize ? paragraphs[i].style.fontSize + "px" : '14px'; // Ajustez cette valeur au besoin
                    paragraphs[i].style.marginBottom = paragraphs[i].style.fontSize ? paragraphs[i].style.fontSize + "px" : '14px'; // Ajustez cette valeur au besoin
                }

                container.style.visibility = "visible"
                pages.map((_, index) => {
                    if (data.content.width) {
                        const el = resizable[index] as HTMLElement;
                        el.style.width = `${data.content.width}px`;
                    }
                })
                container.style.visibility = "hidden";
                container.style.position = "absolute";
                container.style.top = "0";
                setLoading(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages])

    const splitContent = (content: string) => {
        const contentDiv = document.getElementById("contentDiv")
        if (contentDiv) {
            const _width = data.content.width ? `${data.content.width}px` : "90%";
            contentDiv.innerHTML = content;
            contentDiv.style.width = _width;

            if (data.content.pages) {
                let _rest = contentDiv.clientHeight
                let nbPage = 0
                while (_rest > 0) {
                    const _h = data.content.pages.find((page: { id: number }) => page.id === nbPage)
                    _rest -= _h ? _h.height : data.content.maxHeight
                    nbPage++
                }
                setPages(new Array(nbPage).fill(''))
            } else {
                const nbPage = Math.ceil(contentDiv.clientHeight / data.content.maxHeight);
                setPages(new Array(nbPage).fill(''))
            }
        }
    }

    return (
        <Box style={{visibility: loading ? "hidden" : "visible"}}>
            {
                pages.map((page, index) => (
                    <Page key={index} {...{
                        data,
                        setData,
                        state,
                        id: index,
                        onReSize,
                        setOnResize,
                        date,
                        title,
                        header,
                        setHeader
                    }}/>
                ))
            }
            <PageStyled id={"containerx"} style={{visibility: "hidden"}}>
                <div
                    className={`page ${data.size === "portraitA4" ? `${!data.layout ? "" : data.layout}a4` : `${!data.layout ? "" : data.layout}a5`}`}>
                    <div id={"contentDiv"}/>
                </div>
            </PageStyled>
        </Box>
    )
}

export default Doc
