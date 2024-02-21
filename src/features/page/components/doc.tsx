import React, {useEffect, useState} from "react";
import {Page} from "@features/page";
import {prescriptionPreviewDosage} from "@lib/hooks";
import {DefaultCountry, tinymcePlugins, tinymceToolbarNotes} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import PageStyled from "@features/page/components/overrides/pageStyled";
import {Box} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {Editor} from "@tinymce/tinymce-react";

function Doc({...props}) {

    const [pages, setPages] = useState<string[]>([])
    const [title, setTitle] = useState("Titre");
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState("");
    const {
        data,
        setData,
        state,
        date,
        header,
        setHeader,
        onReSize,
        setOnResize,
        urlMedicalProfessionalSuffix,
        docs,
        setDocs
    } = props
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const editorInit = {
        branding: false,
        statusbar: false,
        menubar: false,
        height: 200,
        plugins: tinymcePlugins,
        toolbar: tinymceToolbarNotes,
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    }

    const createPageContent = () => {
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

    useEffect(() => {
        if (state) {
            if (state.info)
                createPageContent()
            else if (state && state.content) {
                data.content.content = state.content;
                setData({...data})
            }
            //data.content.content = "x";
            setData({...data})
            data.patient.content = state.patient;
            if (data.cin)
                data.cin.content = state.cin;

        }
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    useEffect(() => {
        if (title && title !== "Titre") {
            data.title.content = title;
            setData({...data})
        } else
            data.title.content = state.title
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title])

    useEffect(() => {
        if (onReSize) {
            splitContent(state && state.content ? state.content : data.content.content ? data.content.content : "OK")
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
                let paragraphs = container.getElementsByTagName('p');
                for (let i = 0; i < paragraphs.length; i++) {
                    paragraphs[i].style.marginTop = paragraphs[i].style.fontSize ? paragraphs[i].style.fontSize + "px" : '14px'; // Ajustez cette valeur au besoin
                    paragraphs[i].style.marginBottom = paragraphs[i].style.fontSize ? paragraphs[i].style.fontSize + "px" : '14px'; // Ajustez cette valeur au besoin
                }

                container.style.visibility = "visible"
                pages.map((_, index) => {
                    if (data.content.width && isNumber(data.content.width)) {
                        const el = resizable[index] as HTMLElement;
                        el.style.width = `${data.content.width}px`;
                    }
                })
                container.style.visibility = "hidden";
                container.style.position = "absolute";
                container.style.top = "0";
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages])

    const isNumber = (str: string) => {
        return /^\d+$/.test(str);
    }

    const splitContent = (content: string) => {
        const contentDiv = document.getElementById("contentDiv")

        if (contentDiv) {
            const _width = data.content.width && isNumber(data.content.width) ? `${data.content.width}px` : "90%";

            contentDiv.innerHTML = content;
            contentDiv.style.width = _width;

            if (data.content.pages) {
                let _rest = contentDiv.clientHeight
                let nbPage = 0
                while (_rest > 10) {
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
                        id: index,
                        onReSize,
                        setOnResize,
                        value, setValue,
                        date,
                        header,
                        setHeader,
                        urlMedicalProfessionalSuffix,
                        docs, setDocs
                    }}/>
                ))
            }
            <PageStyled id={"containerx"} style={{visibility: "hidden", position: "absolute", top: 0}}>
                <div
                    className={`page ${data.size === "portraitA4" ? `${!data.layout ? "" : data.layout}a4` : `${!data.layout ? "" : data.layout}a5`}`}>
                    <div id={"contentDiv"}/>
                </div>
            </PageStyled>


            <Dialog open={value !== ""}
                    onClose={() => {
                        setValue("")
                    }}>
                {data[value] && <Editor
                    value={data[value].content}
                    apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
                    onEditorChange={(event) => {
                        data[value].content = event
                        setData({...data})
                    }}
                    init={editorInit}/>}

                {value.includes("other") && <Editor
                    value={data["other"][value.replace("other", "")].content}
                    apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
                    onEditorChange={(event) => {
                        data["other"][value.replace("other", "")].content = event
                        setData({...data})
                    }}
                    init={editorInit}/>}
            </Dialog>
        </Box>
    )
}

export default Doc
