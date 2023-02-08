import React, {useEffect, useState} from "react";
import Prescription from "./prescription";
import moment from "moment";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@app/constants";

function PreviewDialog({...props}) {
    const {eventHandler, data, values, state, loading, date, t} = props;

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const drugs = ['X'];
    let rows: any[] = [];
    const [pages, setPages] = useState<any[]>([]);
    const [title, setTitle] = useState("Titre");
    const prescriptionRows = [
        {name: 'name', style: {'margin-bottom': 0, 'font-size': '14px'}},
        {name: 'dosage', style: {color: 'gray', 'font-size': '12px', 'margin-top': 0, 'margin-bottom': 0}},
        {name: 'duration', style: {color: 'gray', 'font-size': '12px', 'margin-top': 0, 'margin-bottom': 0}},
        {name: 'note', style: {color: 'gray', 'font-size': '12px', 'margin-top': 0}}
    ];

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

            list.map((el: any) => {
                if (state) {
                    switch (state.type) {
                        case "prescription":
                            prescriptionRows.map((pr) => {
                                const elx = document.createElement('p');
                                elx.style.maxWidth = data.content.maxWidth ? `${data.content.maxWidth}mm` : '130mm'
                                let val = ""
                                switch (pr.name) {
                                    case "name":
                                        val = el.standard_drug.commercial_name;
                                        break;
                                    case "dosage":
                                        val = `• ${el.dosage}`
                                        break;
                                    case "duration":
                                        val = `• ${el.duration} ${t(el.duration_type)}`
                                        break;
                                    case "note":
                                        val = el.note ? `• ${el.note}` : '';
                                        break;
                                }
                                elx.append(val)
                                Object.assign(elx.style, pr.style)

                                rows.push({
                                    value: val,
                                    name: pr.name,
                                    element: "p",
                                    style: pr.style
                                })
                                pageX.appendChild(elx)

                            });
                            setTitle("ORDONNANCE MEDICALE");
                            break;
                        case "requested-analysis":
                            const elx = document.createElement('p');
                            elx.style.maxWidth = data.content.maxWidth ? `${data.content.maxWidth}mm` : '130mm'
                            elx.append(`• ${el.name}`)
                            rows.push({
                                value: `• ${el.name}`,
                                name: "name",
                                element: "p",
                                style: {color: "gray"}
                            })
                            pageX.appendChild(elx)
                            setTitle("Bilan Biologique");
                            break;
                        case "requested-medical-imaging":
                            const imgLine = document.createElement('p');
                            imgLine.style.maxWidth = data.content.maxWidth ? `${data.content.maxWidth}mm` : '130mm'
                            imgLine.append(`• ${el['medical-imaging'].name}`)
                            rows.push({
                                value: `• ${el['medical-imaging'].name}`,
                                name: "name",
                                element: "p",
                                style: {color: "black"}
                            })

                            if (el.note) {
                                imgLine.append(`• ${el.note}`)
                                rows.push({
                                    value: `${el.note}`,
                                    name: "note",
                                    element: "p",
                                    style: {color: "gray", fontSize: "10px"}
                                })
                            }

                            pageX.appendChild(imgLine)
                            setTitle("Imagerie médicale");
                            break;
                        case "write_certif":
                            const certifLine = document.createElement('div');
                            certifLine.style.maxWidth = data.content.maxWidth ? `${data.content.maxWidth}mm` : '130mm'

                            let txt = el.name.replaceAll('{patient}', state.patient)
                            txt = txt.replaceAll('{aujourd\'hui}', moment().format('DD/MM/YYYY'))
                            txt = txt.replaceAll('{doctor}', session?.user?.name)
                            txt = txt.replaceAll('&nbsp;', '')
                            const parser = new DOMParser();
                            const noeuds = parser.parseFromString(txt, 'text/html').getElementsByTagName('body')[0];

                            noeuds.childNodes.forEach(item => {
                                /*const nblines = countLines(item);
                                if ( nblines > 1 ){*/
                                const lines = getLines(item);
                                lines.map((line) => {
                                    rows.push({
                                        value: line.row,
                                        name: "name",
                                        element: "div",
                                        style: {}
                                    })
                                })

                                /*}else{
                                    rows.push({
                                        value: item,
                                        name: "name",
                                        element: "div",
                                        style: {}
                                    })
                                }*/
                                certifLine.append(item.cloneNode(true))
                            })

                            pageX.appendChild(certifLine)
                            setTitle("CERTIFICAT MEDICAL");
                            break;
                        case "fees":
                            const FeesLine = document.createElement('table');
                            FeesLine.append(`${el.fees} • ${el.act.name}`)
                            rows.push({
                                value: {
                                    qte: el.qte,
                                    name: el.act.name,
                                    fees: el.fees,
                                    hiddenData: el.hiddenData,
                                    total: el.qte * el.fees
                                },
                                name: "name",
                                element: "table",
                                style: {}
                            })
                            pageX.appendChild(FeesLine)
                            setTitle("Note d'honoraires");
                            break;
                    }
                } else {
                    const elx = document.createElement('p');
                    elx.append(el)
                    pageX.appendChild(elx)
                }
            })
        }

        let lastPos = 0
        for (let i = 0; i < Math.ceil(pageX.clientHeight / data.content.maxHeight); i++) {
            const el = document.createElement("div")
            el.id = `page${i}`
            el.style.position = "absolute"
            el.style.top = "0"
            document.body.appendChild(el)
            if (state && state.type === 'fees') {
                let total = 0;
                const elx = document.createElement("table");
                elx.style.width = data.content.maxWidth ? `${data.content.maxWidth}mm` : '130mm'

                const header = document.createElement("tr");
                header.innerHTML = `<td style="text-align: left !important;">ACTE</td><td>QTE</td><td>PU</td><td>TOTAL</td>`
                header.style.fontSize = "12px"
                header.style.fontWeight = "bold"
                header.style.textAlign = "center"
                elx.appendChild(header)

                if (state.consultationFees > 0) {
                    const line = document.createElement("tr");
                    line.innerHTML = `<td style="text-align: left !important;">Consultation</td><td></td><td></td><td style="text-align: center">${state.consultationFees} <span style="font-size: 10px;color: gray">${devise}</span></td>`
                    elx.appendChild(line)
                    total += Number(state.consultationFees);
                }
                for (let i = lastPos; i < rows.length; i++) {
                    if (!rows[i].value.hiddenData) {
                        const line = document.createElement("tr");
                        line.innerHTML = `<tr><td style="text-align: left !important;">${rows[i].value.name}</td><td>${rows[i].value.qte}</td><td>${rows[i].value.fees} <span style="font-size: 10px;color: gray">${devise}</span></td><td>${rows[i].value.total} <span style="font-size: 10px;color: gray">${devise}</span></td></tr>`
                        line.style.textAlign = "center"
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

                tt.innerHTML = `<td style="text-align: left !important;">Total</td><td></td><td></td><td>${total} <span style="font-size: 10px;color: gray">${devise}</span></td>`
                tt.style.fontWeight = "bold"
                tt.style.textAlign = "center"
                elx.appendChild(tt)

            } else {
                for (let i = lastPos; i < rows.length; i++) {
                    const elx = document.createElement(rows[i].element);
                    elx.style.maxWidth = data.content.maxWidth ? `${data.content.maxWidth}mm` : '130mm'
                    elx.append(rows[i].value)
                    Object.assign(elx.style, rows[i].style)
                    el.append(elx)
                    if (el.clientHeight >= data.content.maxHeight) {
                        lastPos = i + 1;
                        break;
                    }
                }
            }

            pages.push({page: i, content: el})
        }

        setPages(pages)
    }

    const getLines = (element: any) => {
        const clone = element.cloneNode(true);
        const words = clone.innerText.replaceAll('&nbsp;', '').split(' ');
        const rows = [];
        let nbLine = 1;
        const row = document.createElement('p');
        row.style.lineHeight = '21px';
        row.style.width = data.content.maxWidth ? `${data.content.maxWidth - 15}mm` : '115mm'
        document.body.appendChild(row);
        for (let word of words) {
            row.innerHTML += word + ' '
            if (row.clientHeight > 21) {
                row.innerHTML = row.innerHTML.slice(0, -1)
                rows.push({nb: nbLine, row: row.innerHTML})
                nbLine++
                row.innerText = word + ' '
            }
        }
        rows.push({nb: nbLine, row: row.innerHTML})
        document.body.removeChild(row);
        return rows;
    }

    /*     const countLines = (element: any) => {
            const clone = element.cloneNode(true);
            document.body.appendChild(clone);
            clone.style.height = "auto";
            clone.style.width = data.content.maxWidth ? `${data.content.maxWidth}mm`:'130mm';
            clone.style.lineHeight = '21px';
            const divHeight = clone.offsetHeight
            const lineHeight = parseInt(clone.style.lineHeight);
             document.body.removeChild(clone);
             return divHeight / lineHeight;
        }*/

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

            const footer = document.getElementById('footer')
            if (footer && data.footer) footer.innerHTML = data.footer.content;

        }
    }, [data])

    return (
        <>
            {pages.map((el, idx) => (
                <div key={idx}>
                    <Prescription {...{
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
                    }}></Prescription>
                </div>
            ))}
        </>
    );
}

export default PreviewDialog;
