import React, {useEffect, useState} from "react";
import Prescription from "./prescription";

function PreviewDialog({...props}) {
    const {eventHandler, data, values, state, loading, t} = props;

    // const drugs = ['AaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaa', '2', '3', '4', '5', '6', '7', '8Aaaaaaaaaaaaaaaaaaaa', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
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

    const devise = process.env.NEXT_PUBLIC_DEVISE
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
                                elx.style.maxWidth = "130mm"
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
                            elx.style.maxWidth = "130mm"
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
                            imgLine.style.maxWidth = "130mm"
                            imgLine.append(`• ${el['medical-imaging'].name}`)
                            rows.push({
                                value: `• ${el['medical-imaging'].name}`,
                                name: "name",
                                element: "p",
                                style: {color: "gray"}
                            })
                            pageX.appendChild(imgLine)
                            setTitle("Imagerie médicale");
                            break;
                        case "write_certif":
                            const certifLine = document.createElement('p');
                            certifLine.style.maxWidth = "130mm"
                            certifLine.append(`• ${el.name}`)
                            rows.push({
                                value: el.name,
                                name: "name",
                                element: "p",
                                style: {}
                            })
                            pageX.appendChild(certifLine)
                            setTitle("CERTIFICAT MEDICAL");
                            break;
                        case "fees":
                            const FeesLine = document.createElement('table');
                            FeesLine.append(`${el.fees} • ${el.act.name}`)
                            rows.push({
                                value: {qte: el.qte, name: el.act.name, fees: el.fees, total: el.qte * el.fees},
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
                elx.style.width ='130mm';

                const header = document.createElement("tr");
                header.innerHTML = `<td style="text-align: left !important;">ACTE</td><td>QTE</td><td>PU</td><td>TOTAL</td>`
                header.style.fontSize= "12px"
                header.style.fontWeight="bold"
                header.style.textAlign="center"
                elx.appendChild(header)

                if (state.consultationFees > 0){
                    const line = document.createElement("tr");
                    line.innerHTML = `<td style="text-align: left !important;">Consultation</td><td></td><td></td><td style="text-align: center">${state.consultationFees} <span style="font-size: 10px;color: gray">${devise}</span></td>`
                    elx.appendChild(line)
                    total+= state.consultationFees;
                }
                for (let i = lastPos; i < rows.length; i++) {
                    const line = document.createElement("tr");
                    line.innerHTML = `<tr><td style="text-align: left !important;">${rows[i].value.name}</td><td>${rows[i].value.qte}</td><td>${rows[i].value.fees} <span style="font-size: 10px;color: gray">${devise}</span></td><td>${rows[i].value.total} <span style="font-size: 10px;color: gray">${devise}</span></td></tr>`
                    line.style.textAlign="center"
                    elx.appendChild(line)
                    Object.assign(elx.style, rows[i].style)
                    el.append(elx)
                    if (el.clientHeight >= data.content.maxHeight) {
                        lastPos = i + 1;
                        break;
                    }
                    total+=rows[i].value.total
                }

                const tt = document.createElement("tr");

                tt.innerHTML = `<td style="text-align: left !important;">Total</td><td></td><td></td><td>${total} <span style="font-size: 10px;color: gray">${devise}</span></td>`
                tt.style.fontWeight="bold"
                tt.style.textAlign="center"
                elx.appendChild(tt)

            } else {
                for (let i = lastPos; i < rows.length; i++) {
                    const elx = document.createElement(rows[i].element);
                    elx.style.maxWidth = "130mm"
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
                        loading,
                        pages
                    }}></Prescription>
                </div>
            ))}
        </>
    );
}

export default PreviewDialog;
