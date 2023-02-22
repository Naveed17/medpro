import Draggable from "react-draggable";
import {DocHeader} from "@features/files";
import React, {useEffect, useRef} from "react";
import {Box, useMediaQuery} from "@mui/material";
import {Theme} from "@mui/material/styles";

const Prescription = ({...props}) => {
    const {eventHandler, data, pages, id, values, state, loading,date, title} = props;
    const content = useRef<HTMLDivElement>(null);
    const footer = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        content.current?.append(pages[id].content)
        const footer = document.getElementById('footer')
        if (footer && data.footer) {
            console.log(data.footer)
            footer.innerHTML = data.footer.content;
        }
    },[data, id, loading, pages])

    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("md")
    );

    return (
        <>
            {!loading && <Box>
                {data !== undefined && <div className={"portraitA4"} style={{zoom:isMobile ?'40%':'',marginBottom:isMobile ?80:'',marginLeft:isMobile?30:''}}>

                    {data.background.show && data.background.content !== '' && state === undefined && id === 0 &&
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={"portraitA4"}
                             style={{position: "absolute", height: '421mm',width:'297mm'}}
                             src={data.background.content} alt={'backgroud'}/>}

                    <Draggable onStop={(ev, data) => {
                        eventHandler(ev, data, 'header')
                    }}
                               bounds={{left: 0, top: 0, right: 0, bottom: 710}}>
                        <div style={{padding: "1.5rem 1.5rem 0", width: "100%", border: '0 solid red'}}>
                            {data.header.show && <DocHeader data={values}></DocHeader>}
                        </div>
                    </Draggable>

                    {id === 0 && <>
                        <Draggable onStop={(ev, data) => {
                            eventHandler(ev, data, 'title')
                        }}
                                   defaultPosition={{x: data.title.x, y: data.title.y}}
                                   bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                            <div style={{width: "100%", fontWeight:"bold", textAlign: "center", height: '6mm'}}>
                                {data.title.show && <div
                                    className="handle">{state && state.title ? state.title : title}</div>}
                            </div>
                        </Draggable>

                        <Draggable onStop={(ev, data) => {
                            eventHandler(ev, data, 'date')
                        }}
                                   defaultPosition={{x: data.date.x, y: data.date.y}}
                                   bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                            <div style={{width: "fit-content",border: '0px solid red',margin:"auto"}}>
                                {data.date.show && <div
                                    className="handle" style={{whiteSpace: 'break-spaces'}}>{data.date.prefix} {state ? date : data.date.content} </div>}
                            </div>
                        </Draggable>

                        <Draggable onStop={(ev, data) => {
                            eventHandler(ev, data, 'patient')
                        }}
                                   defaultPosition={{x: data.patient.x, y: data.patient.y}}
                                   bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                            <div style={{width: "fit-content", border: '0 solid red'}}>
                                {data.patient.show && <div
                                    className="handle">{data.patient.prefix} {state ? state.patient : data.patient.content}</div>}
                            </div>
                        </Draggable>
                    </>}

                    <Draggable
                        defaultPosition={{x: data.content.x, y: data.content.y}}
                        onStop={(ev, data) => {
                            eventHandler(ev, data, 'content')
                        }}
                        bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                        <div style={{width: "100%", padding: '0 10mm',border:"0 solid", overflowWrap: 'break-word',height: `${data.content.maxHeight}px`}}>
                            {state === undefined && <div id={'content' + id} className="box"
                                                         style={{height: `${data.content.maxHeight}px`}}>
                                {data.content.content}</div>}

                            {<div id={id} ref={content}></div>}
                        </div>
                    </Draggable>

                    {data.footer && <Draggable defaultPosition={{x: data.footer.x, y: data.footer.y}}
                                               onStop={(ev, data) => {
                                                   eventHandler(ev, data, 'footer')
                                               }}
                                               bounds={{left: 0, top: 0, right: 0, bottom: 710}}>
                        <div style={{padding: "1.5rem 1.5rem 0", width: "100%", border: '0 solid red'}}>
                            {data.footer.show && <div id={"footer"} className={"footer-st"} ref={footer}></div>}
                        </div>
                    </Draggable>}
                </div>}
            </Box>}
        </>
    )
}
export default Prescription;