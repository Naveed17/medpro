import React, {useEffect, useState} from "react";
import {Page} from "@features/page";
import {getBirthdayFormat, prescriptionPreviewDosage} from "@lib/hooks";
import {DefaultCountry, tinymcePlugins, tinymceToolbarNotes} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import PageStyled from "@features/page/components/overrides/pageStyled";
import {Box, Stack, TextField, Typography, useTheme} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {Editor} from "@tinymce/tinymce-react";
import moment from "moment/moment";

function Doc({...props}) {

    const [pages, setPages] = useState<string[]>([])
    const [title, setTitle] = useState("Titre");
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState("");
    const {
        data,
        setData,
        state,
        componentRef,
        date,
        header,
        setHeader,
        onReSize,
        setOnResize,
        urlMedicalProfessionalSuffix,
        docs,
        editMode = true,
        bg2ePage = true,
        downloadMode = false,
        setDocs, t
    } = props
    const theme = useTheme();
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const general_information = (user as UserDataResponse).general_information;

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
                    child.append();
                    elx += `<p>${index + 1} • ${el?.drugName ?? ""} ${el?.standard_drug?.form?.name ?? ""} ${el?.standard_drug?.dosages?.map((data: any) => data.dosage).join(" ") ?? ""}</p>`
                    el.cycles.map((cycle: any) => {
                        let val = cycle.dosage ? `- ${prescriptionPreviewDosage(cycle.dosage)}` : ''
                        if (cycle.duration)
                            val += ` pendant ${cycle.duration} ${t(cycle.durationType)}`
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
                    elx += `<p>• ${el.name}</p>`
                    if (el.note) elx += `<p>• ${el.note}</p>`
                })

                setTitle("Bilan Biologique");
                break;
            case "requested-medical-imaging":
                const val = `<p>Prière de faire les explorations radiologiques suivantes à ${state.patient} :</p>`
                elx += val
                state.info.map((el: any) => {
                    elx += `<p>• ${el?.name}</p>`
                    if (el.note) elx += `<p>• ${el.note}</p>`
                })

                setTitle("Imagerie médicale");
                break;
            case "fees":
            case "quote":
                let total = 0;
                elx = "<table style='width: 100%;'>"
                elx += `<tr>
                                    <td class="act-table-title" style="text-align: left">Acte</td>
                                    <td class="act-table-title">PRIX</td>
                                    <td class="act-table-title">QTE</td>
                                    <td class="act-table-title">TOTAL</td>
                                </tr>`
                state.info.map((el: any, index: number) => {
                    total += el.qte * el.fees;
                    elx += `<tr style="background: ${theme.palette.info.main};border-radius: 10px">
                                        <td class="act-table-item" style="padding: 20px;font-weight: bold;border-top-left-radius:  ${index === 0 ? "10px" : 0};border-bottom-left-radius: ${index === state.info.length - 1 ? "10px" : 0}">${el.act.name}</td>
                                        <td class="act-table-item" style="text-align: center">${el.fees} ${devise}</td>
                                        <td style="color: ${theme.palette.grey["400"]};text-align: center">${el.qte}</td>
                                        <td style="text-align: center;font-size: 18px;font-weight: bold;border-top-right-radius: ${index === 0 ? "10px" : 0};border-bottom-right-radius: ${index === state.info.length - 1 ? "10px" : 0}">${el.qte * el.fees} ${devise}</td>
                                    </tr>`
                });
                elx += "</table>"
                elx += `<p style="text-align: right; color: ${theme.palette.grey["400"]};margin-top: 20px">Total</p>`
                elx += `<p style="text-align: right;font-size: 24px;color: ${theme.palette.primary.main};font-weight: bold">${total} ${devise}</p>`


                setTitle(state.type == "fees" ? "Facture" : "Devis");

                break;
            case "glasses":
                const subTitle = ['sphere', 'cylindre', 'axe']
                let od = "";
                let og = "";
                let odp = "";
                let ogp = ""

                state.info.map((el: any) => {
                    subTitle.map(key => {
                        od += `${t(key)} : ${el.pfl[0].od[key] ? el.pfl[0].od[key] : ' - '}  `;
                        og += `${t(key)} : ${el.pfl[0].og[key] ? el.pfl[0].og[key] : ' - '}  `;
                        odp += `${t(key)} : ${el.pfp[0].od[key] ? el.pfp[0].od[key] : ' - '}  `;
                        ogp += `${t(key)} : ${el.pfp[0].og[key] ? el.pfp[0].og[key] : ' - '}   `
                    })

                    elx += `<p>• ${t('farvision')}</p>
                            <p style="margin-left: 20px">${od}</p>
                            <p>• ${t('nearvision')}</p>
                            <p style="margin-left: 20px">${od}</p>`
                })

                setTitle("Ordonnance de lunettes");
                break;
            case "lens":
                let odl = "";
                let ogl = ""
                const st = ['sphere', 'cylindre', 'axe']

                state.info.map((el: any) => {
                    st.forEach(key => {
                        odl += `${t(key)} : ${el.pfl[0].od[key] ? el.pfl[0].od[key] : ' - '}  `;
                        ogl += `${t(key)} : ${el.pfl[0].og[key] ? el.pfl[0].og[key] : ' - '}  `;
                    })
                    elx += `<p>• ${odl}</p><p>• ${ogl}</p>`
                })
                setTitle("Lentille");
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
                let txt = state.content?.replaceAll('{patient}', state.patient)
                txt = txt?.replaceAll('{aujourd\'hui}', moment().format('DD/MM/YYYY'))
                txt = txt?.replaceAll('[date]', moment().format('DD/MM/YYYY'))
                if (state.birthdate) {
                    txt = txt?.replaceAll('{age}', getBirthdayFormat({birthdate: state.birthdate}, t))
                    txt = txt?.replaceAll('{birthdate}', moment(state.birthdate, "DD-MM-YYYY").format('DD-MM-YYYY'))
                }
                if (state.cin)
                    txt = txt?.replaceAll('{cin}', state.cin)
                if (state.tel)
                    txt = txt?.replaceAll('{tel}', state.tel)
                txt = txt?.replaceAll('{doctor}', `${general_information.firstName} ${general_information.lastName}`)
                txt = txt?.replaceAll('[votre nom]', `${general_information.firstName} ${general_information.lastName}`)
                txt = txt?.replaceAll('&nbsp;', '')
                data.content.content = txt;
                setData({...data})
            }
            data.age.content = state.age
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
        }
        if (state && state.title)
            data.title.content = state.title
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title])

    useEffect(() => {
        if (onReSize) {
            splitContent(state && state.content ? state.content : data.content.content ? data.content.content : "change me...")
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
                        componentRef,
                        setData,
                        id: index,
                        onReSize,
                        setOnResize,
                        value, setValue,
                        date,
                        header,
                        setHeader,
                        state,
                        bg2ePage,
                        editMode, downloadMode,
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
                {data[value] ? ["patient", "date", "cin", "age"].includes(value) ? <Stack spacing={1} p={2}>
                    <Typography fontSize={12}>Prefix</Typography>
                    <TextField
                        value={data[value].prefix}
                        onChange={(event) => {
                            data[value].prefix = event.target.value
                            setData({...data})
                        }}
                    />
                </Stack> : <Editor
                    value={data[value].content}
                    apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
                    onEditorChange={(event) => {
                        data[value].content = event
                        setData({...data})
                    }}
                    init={editorInit}/> : null}

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
