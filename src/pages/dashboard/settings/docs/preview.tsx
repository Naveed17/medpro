import React, {useEffect, useState} from "react";
import Prescription from "./prescription";

function PreviewDialog({...props}) {
    const {eventHandler, data, values, state,loading} = props;

    // const drugs = ['AaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaa', '2', '3', '4', '5', '6', '7', '8Aaaaaaaaaaaaaaaaaaaa', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    const drugs = ['X'];
    let rows: any[] = [];
    const [pages, setPages] = useState<any[]>([]);

    const createPageContent = (pageX: HTMLDivElement, list: any) => {

        console.log(list)
        if (pageX) {
            list.map((el: any) => {
                const elx = document.createElement('p');
                const name = document.createElement('p');
                const dosage = document.createElement('p');
                const duree = document.createElement('p');
                const note = document.createElement('p');
                if (state) {
                    name.append('*' + el.standard_drug.commercial_name)
                    rows.push({
                        value: el.standard_drug.commercial_name,
                        name: 'name',
                        style: {'margin-bottom': 0, 'font-size': '14px'}
                    })
                    Object.assign(name.style, {'margin-bottom': 0, 'font-size': '14px'})

                    dosage.append(el.dosage)
                    rows.push({
                        value: `• ${el.dosage}`,
                        name: 'dosage',
                        style: {color: 'gray', 'font-size': '12px', 'margin-top': 0, 'margin-bottom': 0}
                    })
                    Object.assign(dosage.style, {
                        color: 'gray',
                        'font-size': '12px',
                        'margin-top': 0,
                        'margin-bottom': 0
                    })

                    duree.append(el.duration + ' ' + el.duration_type)
                    rows.push({
                        value: `• ${el.duration} ${el.duration_type}`,
                        name: 'duration',
                        style: {color: 'gray', 'font-size': '12px', 'margin-top': 0, 'margin-bottom': 0}
                    })
                    Object.assign(duree.style, {
                        color: 'gray',
                        'font-size': '12px',
                        'margin-top': 0,
                        'margin-bottom': 0
                    })

                    if (el.note !== "") {
                        note.append(`• ${el.note}`)
                        Object.assign(note.style, {color: 'gray', 'font-size': '12px', 'margin-top': 0})
                        rows.push({
                            value: `• ${el.note}`,
                            name: 'duration',
                            style: {color: 'gray', 'font-size': '12px', 'margin-top': 0}
                        })
                    }

                    pageX.appendChild(name)
                    pageX.appendChild(dosage)
                    pageX.appendChild(duree)
                    pageX.appendChild(note)

                } else {
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
            for (let i = lastPos; i < rows.length; i++) {
                const elx = document.createElement('p');
                elx.append(rows[i].value)
                Object.assign(elx.style, rows[i].style)
                el.append(elx)
                if (el.clientHeight >= data.content.maxHeight) {
                    lastPos = i + 1;
                    break;
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

        state ? createPageContent(pageX, state.info) : createPageContent(pageX, drugs)
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
