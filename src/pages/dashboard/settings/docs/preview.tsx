import React, {useEffect, useState} from "react";
import Prescription from "./prescription";

function PreviewDialog({...props}) {
    const {background, header, title, eventHandler, date, patient} = props;

    const drugs = ['AaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaaAaaaaaaaaaaaaaa', '2', '3', '4', '5', '6', '7', '8Aaaaaaaaaaaaaaaaaaaa','11','12','13','14','15','16','17','18','19','20','21','22','23'];
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
        for(let i = 0; i<Math.ceil(pageX.clientHeight / 370);i++){
            const el = document.createElement("div")
            el.id=`page${i}`
            document.body.appendChild(el)
            for(let i=lastPos;i< drugs.length;i++) {
                const elx = document.createElement('p');
                elx.append("Test"+i)

                el.append(elx)
                if (el.clientHeight>=370) {
                    lastPos = i+1;
                    break;
                }
            }
            pages.push({page:i,content:el})
        }

       /* let selectedPage = 0

        const p = document.createElement('div')
        p.id = 'page'+selectedPage
        document.body.appendChild(p)
        drugs.map(drug =>{
            const elx = document.createElement('p');
            elx.append(drug)
            p.append(elx)

            console.log(p)
            if (p.clientHeight > 370) {
                pages.push({page:selectedPage,content:p})
                console.log(selectedPage,pages[selectedPage].content)
                selectedPage ++
            }
        })
        console.log(pages)*/
        setPages(pages)
    }

    useEffect(() => {
        const pageX = document.createElement("div")
        pageX.style.visibility="hidden"
        document.body.append(pageX)
        createPageContent(pageX)
    }, [])

    return (
        <>
            {pages.map((el,idx)=>(
                <div key={idx}>
                    <Prescription {...{
                        background,
                        header,
                        id: idx,
                        title,
                        eventHandler,
                        date,
                        patient,
                        drugs,
                        pages
                    }}></Prescription>
                </div>
            ))}
        </>
    );
}

export default PreviewDialog;
