import React, {useEffect, useState} from "react";
import Prescription from "./prescription";

function PreviewDialog({...props}) {
    const {eventHandler, data, values} = props;

   // const drugs = ['AaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaa', '2', '3', '4', '5', '6', '7', '8Aaaaaaaaaaaaaaaaaaaa', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    const drugs = ['X'];
    const [pages, setPages] = useState<any[]>([]);

    const createPageContent = (pageX: HTMLDivElement) => {

        if (pageX) {
            drugs.map((el) => {
                const elx = document.createElement('p');
                elx.append(el)
                pageX.appendChild(elx)
            })
        }

        let lastPos = 0
        for (let i = 0; i < Math.ceil(pageX.clientHeight / data.content.maxHeight); i++) {
            const el = document.createElement("div")
            el.id = `page${i}`
            el.style.position= "absolute"
            el.style.top="0"
            document.body.appendChild(el)
            for (let i = lastPos; i < drugs.length; i++) {
                const elx = document.createElement('p');
                elx.append("Test" + i)

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
        pageX.style.position= "absolute"
        pageX.style.top="0"
        document.body.append(pageX)
        createPageContent(pageX)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (data){
            const content = document.getElementById('content0')
            if (content) {
                content.style.height = data.content.maxHeight+'px'
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
                        pages
                    }}></Prescription>
                </div>
            ))}
        </>
    );
}

export default PreviewDialog;
