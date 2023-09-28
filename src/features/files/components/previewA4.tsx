import React, {useEffect, useState} from "react";
import moment from "moment";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import PrescriptionA4 from "@features/files/components/prescriptionA4";

function PreviewDialog({...props}) {
    const {eventHandler, data, values, state, loading, date, t, nbPage} = props;

    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const general_information = (user as UserDataResponse).general_information;
    const devise = doctor_country.currency?.name;

    const drugs = ['X'];
    let rows: any[] = [];
    const [pages, setPages] = useState<any[]>([]);
    const [title, setTitle] = useState("Titre");
    const breakStyle = {
        'font-size': '16px',
        'margin-top': 0,
        'margin-bottom': '1px',
        'margin-left': '18px',
    };
    const prescriptionRows = [
        {
            name: 'name',
            style: {
                'margin-bottom': 0,
                'font-size': data.size === 'portraitA4' ? "15px" : '20px',
                'font-weight': 'bold'
            }
        },
        {
            name: 'dosage',
            style: {
                'font-size': data.size === 'portraitA4' ? "14px" : '19px',
                'margin-top': 0,
                'margin-bottom': '1px',
                'margin-left': '14px'
            }
        },
        {
            name: 'duration',
            style: {
                color: 'gray',
                'font-size': data.size === 'portraitA4' ? "9px" : '12px',
                'margin-top': 0,
                'margin-bottom': 0
            }
        },
        {
            name: 'note',
            style: {color: 'gray', 'font-size': data.size === 'portraitA4' ? "9px" : '12px', 'margin-top': 0}
        }];

    const createPageContent = (pageX: HTMLDivElement, list: any) => {
        if (pageX) {
            if (state) {
                const elx = document.createElement('p');
                switch (state.type) {
                    case "requested-analysis":
                        const value = `Prière, Faire pratiquer à ${state.patient} les analyses suivantes:`
                        elx.append(value)
                        rows.push({
                            value,
                            name: 'prefix',
                            element: "p",
                            style: {}
                        })
                        break;
                    case "requested-medical-imaging":
                        const val = `Prière, Faire pratiquer à ${state.patient} les imageries médicales suivantes:`
                        elx.append(val)
                        rows.push({
                            value: val,
                            name: 'pr.name',
                            element: "p",
                            style: {}
                        })
                        break;
                }
            }

            list.map((el: any, index: number) => {
                if (state) {
                    switch (state.type) {
                        case "prescription":
                            prescriptionRows.forEach((pr) => {
                                const elx = document.createElement('p');
                                elx.style.maxWidth = data.content.maxWidth ? `${data.content.maxWidth}mm` : '190mm'
                                switch (pr.name) {
                                    case "name":
                                        const val = `${index + 1} • ${el.standard_drug.commercial_name}`;
                                        elx.append(val)
                                        rows.push({
                                            value: val,
                                            name: pr.name,
                                            element: "p",
                                            style: pr.style
                                        });
                                        break;
                                    case "dosage":
                                        el.cycles.map((cycle: any, index: number) => {
                                            let val = cycle.dosage ? `- ${cycle.dosage}` : ''
                                            if (cycle.duration)
                                                val += ` pendant ${cycle.duration} ${t(cycle.durationType)}`
                                            if (cycle.note)
                                                val += ` (${cycle.note})`;
                                            elx.append(val);
                                            rows.push({
                                                value: val,
                                                name: pr.name,
                                                element: "p",
                                                style: pr.style
                                            });
                                            index < el.cycles.length - 1 && rows.push({
                                                value: t("after"),
                                                name: "break",
                                                element: "p",
                                                style: breakStyle
                                            });
                                        })
                                        break;
                                }
                                Object.assign(elx.style, pr.style)
                                pageX.appendChild(elx)

                            });
                            setTitle("ORDONNANCE MEDICALE");
                            break;
                        case "requested-analysis":
                            const elx = document.createElement('p');
                            elx.style.maxWidth = data.content.maxWidth ? `${data.content.maxWidth}mm` : '190mm'
                            elx.append(`• ${el.analysis.name}`)
                            rows.push({
                                value: `• ${el.analysis.name}`,
                                name: "name",
                                element: "p",
                                style: {marginBottom: 0}
                            })
                            if (el.note) {
                                elx.append(`• ${el.note}`)
                                rows.push({
                                    value: `${el.note}`,
                                    name: "note",
                                    element: "p",
                                    style: {
                                        color: "gray",
                                        fontSize: data.size === 'portraitA4' ? "12px" : "18px",
                                        marginTop: 0
                                    }
                                })
                            }
                            pageX.appendChild(elx)
                            setTitle("Bilan Biologique");
                            break;
                        case "requested-medical-imaging":
                            const imgLine = document.createElement('p');
                            imgLine.style.maxWidth = data.content.maxWidth ? `${data.content.maxWidth}mm` : '190mm'
                            imgLine.append(`• ${el['medical-imaging']?.name}`)
                            rows.push({
                                value: `• ${el['medical-imaging']?.name}`,
                                name: "name",
                                element: "p",
                                style: {
                                    color: "black",
                                    fontSize: data.size === 'portraitA4' ? "15px" : "20px",
                                    fontWeight: "bold",
                                    marginBottom: 0
                                }
                            })

                            if (el.note) {
                                imgLine.append(`• ${el.note}`)
                                rows.push({
                                    value: `${el.note}`,
                                    name: "note",
                                    element: "p",
                                    style: {
                                        color: "black",
                                        fontSize: data.size === 'portraitA4' ? "14px" : "19px",
                                        marginTop: 0
                                    }
                                })
                            }

                            pageX.appendChild(imgLine)
                            setTitle("Imagerie médicale");
                            break;
                        case "write_certif":
                            const certifLine = document.createElement('div');
                            certifLine.style.width = data.content.maxWidth ? `${data.content.maxWidth}mm` : '190mm'

                            let txt = el.name.replaceAll('{patient}', state.patient)
                            txt = txt.replaceAll('{aujourd\'hui}', moment().format('DD/MM/YYYY'))
                            txt = txt.replaceAll('[date]', moment().format('DD/MM/YYYY'))
                            if (state.birthdate)
                                txt = txt.replaceAll('{age}', moment().diff(moment(state.birthdate, "DD-MM-YYYY"), "years") + " ans")
                            if (state.cin)
                                txt = txt.replaceAll('{cin}', state.cin)
                            txt = txt.replaceAll('{doctor}', `${general_information.firstName} ${general_information.lastName}`)
                            txt = txt.replaceAll('[votre nom]', `${general_information.firstName} ${general_information.lastName}`)
                            txt = txt.replaceAll('&nbsp;', '')
                            const parser = new DOMParser();
                            const noeuds = parser.parseFromString(txt, 'text/html').getElementsByTagName('body')[0];

                            noeuds.childNodes.forEach(item => {
                                rows.push({
                                    value: item,
                                    name: "name",
                                    element: "div",
                                    style: {}
                                })
                                certifLine.append(item.cloneNode(true))
                            })

                            pageX.appendChild(certifLine)
                            setTitle("CERTIFICAT MEDICAL");
                            break;
                        case "fees":
                        case "quote":
                            const FeesLine = document.createElement('table');
                            FeesLine.append(`${el.fees} • ${el.act.name}`)
                            rows.push({
                                value: {
                                    qte: el.qte,
                                    name: el.act.name,
                                    fees: el.fees,
                                    hiddenData: el?.hiddenData,
                                    total: el.qte * el.fees
                                },
                                name: "name",
                                element: "table",
                                style: {}
                            })
                            pageX.appendChild(FeesLine)
                            setTitle(state.type == "fees" ? "Note d'honoraires" : "Devis");
                            break;
                        case "glasses":
                            const prescLine = document.createElement('p');
                            const subTitle = ['sphere', 'cylindre', 'axe']

                            let od = ""; let og = ""
                            let odp = ""; let ogp = ""

                            subTitle.map(key => {
                                od += `${key} : ${el.pfl[0].od[key] ? el.pfl[0].od[key] : ' - '}  `;
                                og += `${key} : ${el.pfl[0].og[key] ? el.pfl[0].og[key] : ' - '}  `;
                                odp += `${key} : ${el.pfp[0].od[key] ? el.pfp[0].od[key] : ' - '}  `;
                                ogp += `${key} : ${el.pfp[0].og[key] ? el.pfp[0].og[key] : ' - '}   `
                            })

                            rows = [
                                {
                                    value: `Vision de loin`,
                                    name: "name",
                                    element: "p",
                                    style: {marginBottom: 0}
                                },
                                {
                                    value: `• OD : ${od}`,
                                    name: "name",
                                    element: "p",
                                    style: {marginBottom: 0, marginLeft:30}
                                },
                                {
                                    value: `• OG : ${og}`,
                                    name: "name",
                                    element: "p",
                                    style: {marginBottom: 0}
                                },

                                {
                                    value: `Vision de près`,
                                    name: "name",
                                    element: "p",
                                    style: {marginBottom: 0}
                                },
                                {
                                    value: `• OD : ${odp}`,
                                    name: "name",
                                    element: "p",
                                    style: {marginBottom: 0}
                                },
                                {
                                    value: `• OG : ${ogp}`,
                                    name: "name",
                                    element: "p",
                                    style: {marginBottom: 0}
                                }
                            ]
                            pageX.appendChild(prescLine)

                            setTitle("Ordonnance lunette");
                    }
                } else {
                    const elx = document.createElement('p');
                    elx.append(el)
                    pageX.appendChild(elx)
                }
            })
        }

        let lastPos = 0;
        let updatedPages = [];
        const nbPages = Math.ceil(pageX.clientHeight / data.content.maxHeight);
        for (let i = 0; i < nbPages; i++) {
            const el = document.createElement("div")
            el.id = `page${i}`
            el.style.position = "absolute"
            el.style.top = "0"
            if (state && (state.type === 'fees' || state.type === 'quote')) {
                let total = 0;
                const elx = document.createElement("table");
                elx.style.width = '190mm';
                elx.style.borderCollapse = 'collapse';

                if (rows.length > 0) {
                    const header = document.createElement("tr");
                    header.innerHTML = `<td style="text-align: left !important;">Act</td><td>QTE</td><td>PU</td><td>TOTAL</td>`
                    header.style.fontSize = "20px"
                    header.style.fontWeight = "bold"
                    header.style.textAlign = "center"
                    elx.appendChild(header)
                }

                if (state.consultationFees > 0) {
                    const line = document.createElement("tr");
                    line.innerHTML = `<td style="text-align: left !important;padding-bottom: 10px;padding-top: 10px">Consultation</td><td></td><td></td><td style="text-align: center">${state.consultationFees} <span style="font-size: 10px;color: gray">${devise}</span></td>`
                    line.style.borderBottom = "1px dashed grey";
                    elx.appendChild(line)
                    total += Number(state.consultationFees);
                }
                for (let i = lastPos; i < rows.length; i++) {
                    if (!rows[i].value.hiddenData) {
                        const line = document.createElement("tr");
                        line.innerHTML = `<tr><td style="text-align: left !important;padding-bottom: 10px;padding-top: 10px">${rows[i].value.name}</td><td>${rows[i].value.qte}</td><td>${rows[i].value.fees} <span style="font-size: 10px;color: gray">${devise}</span></td><td>${rows[i].value.total} <span style="font-size: 10px;color: gray">${devise}</span></td></tr>`
                        line.style.textAlign = "center"
                        line.style.borderBottom = "1px dashed grey"

                        elx.appendChild(line);
                        total += rows[i].value.total;
                    }
                    Object.assign(elx.style, rows[i].style)
                    el.append(elx)
                    if (el.clientHeight >= data.content.maxHeight) {
                        lastPos = i + 1;
                        break;
                    }
                }

                const tt = document.createElement("tr");

                tt.innerHTML = `<td style="text-align: left !important;padding-top: 10px">Total</td><td></td><td></td><td>${total} <span style="font-size: 10px;color: gray">${devise}</span></td>`
                tt.style.fontWeight = "bold"
                tt.style.textAlign = "center"
                elx.appendChild(tt)

            } else {
                for (let i = lastPos; i < rows.length; i++) {
                    const elx = document.createElement(rows[i].element);
                    elx.style.width = '190mm'
                    elx.style.fontSize = data.size === 'portraitA4' ? "15px" : "20px"
                    elx.append(rows[i].value)
                    Object.assign(elx.style, rows[i].style)
                    el.append(elx)
                    document.body.append(el)
                    if (el.clientHeight >= data.content.maxHeight) {
                        lastPos = i + 1;
                        break;
                    }

                    document.body.removeChild(el)
                }
            }
            updatedPages.push({page: i, content: el})
        }
        /*
                for(let i = 0; i < nbPages; i++){
                    let p = document.getElementById(`page${i}`)
                    if(p) {
                        p.style.height = "0";
                        document.body.removeChild(p)
                    }
                }
        */
        setPages(updatedPages);
    }

    useEffect(() => {
        const pageX = document.createElement("div")
        pageX.style.visibility = "hidden"
        pageX.style.position = "absolute"
        pageX.style.top = "0"
        document.body.append(pageX)
        if (state) {
            if (state.info)
                createPageContent(pageX, state.info)
            else {
                createPageContent(pageX, [{name: state.content}])
            }
        } else createPageContent(pageX, drugs)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (data) {
            const content = document.getElementById('content0')
            if (content) {
                content.style.height = data.content.maxHeight + 'px'
            }

            /*const footer = document.getElementById('footer')
            if (footer && data.footer) {
                footer.innerHTML = data.footer.content;
                footer.className="footer-st"
            } */

        }
    }, [data])

    return (
        <>
            {pages.slice(0, nbPage ? 1 : pages.length).map((el, idx) => (
                <div key={idx}>
                    <PrescriptionA4 {...{
                        data,
                        id: idx,
                        eventHandler,
                        values,
                        drugs,
                        title,
                        state,
                        date,
                        loading,
                        pages
                    }}></PrescriptionA4>
                </div>
            ))}
        </>
    );
}

export default PreviewDialog;
