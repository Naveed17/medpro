import Draggable from "react-draggable";
import {DocHeader} from "@features/files";
import React, {useEffect, useRef, useState} from "react";
import {useMediaQuery} from "@mui/material";
import {Theme} from "@mui/material/styles";

const Prescription = ({...props}) => {
    const {componentRef, eventHandler, data, pages, id, values, state, loading, date, title} = props;
    const content = useRef<HTMLDivElement>(null);
    const footer = useRef<HTMLDivElement>(null);
    const [backgroundImg, setBackgroundImg] = useState<string | null>(null);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const [selected, setSelected] = useState("");
    const [lastSelected, setLastSelected] = useState("");

    useEffect(() => {
        content.current?.append(pages[id].content)
        const footer = document.getElementById('footer')
        if (footer && data.footer) {
            footer.innerHTML = data.footer.content;
        }
    }, [data, id, loading, pages])

    useEffect(() => {
        if (data.background.show && data.background.content !== '') {
            fetch(data.background.content.url).then(response => {
                response.blob().then(blob => {
                    setBackgroundImg(URL.createObjectURL(blob));
                })
            })
        }
    }, [data.background.content.url]); // eslint-disable-line react-hooks/exhaustive-deps

    return (<>
        {<div className={"portraitA4"}
              ref={componentRef}
              style={{
                  position: "relative",
                  zoom: isMobile ? '40%' : '',
                  marginBottom: isMobile ? 80 : '',
                  marginLeft: isMobile ? 30 : '',
                  fontSize: data.size === 'portraitA4' ? '15px' : '',
                  ...(data.background.show && data.background.content !== '' && id === 0 && backgroundImg && {
                      backgroundImage: `url(${backgroundImg})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%"
                  }),

              }}>

            {/*            {data.background.show && data.background.content !== '' && id === 0 && backgroundImg &&
                // eslint-disable-next-line @next/next/no-img-element
                <img className={"portraitA4"}
                     style={{position: "absolute", height: '100%', width: '100%'}}
                     src={backgroundImg} alt={'background'}/>}*/}

            {data.header.show && id === 0 && <Draggable
                onStop={(ev, data) => {
                    eventHandler(ev, data, 'header');
                    setSelected("");
                }}
                onStart={() => {
                    setSelected("header");
                    setLastSelected("header");
                }}
                disabled={eventHandler === null}
                bounds={{left: 0, top: 0, right: 0, bottom: 1000}}>
                <div style={{
                    padding: "1.5rem 1.5rem 0",
                    position: "absolute",
                    zIndex: lastSelected === "header" ? 999 : 1,
                    opacity: selected === "" || selected === "header" ? 1 : 0.5,
                    width: "100%",
                    border: '0 solid red'
                }}>
                    <DocHeader data={values}></DocHeader>
                </div>
            </Draggable>}

            {id === 0 && <>
                {data.title.show &&
                    <Draggable onStop={(ev, data) => {
                        eventHandler(ev, data, 'title');
                        setSelected("");
                    }}
                               onStart={() => {
                                   setSelected("title");
                                   setLastSelected("title");
                               }}
                               disabled={eventHandler === null}
                               defaultPosition={{x: data.title.x, y: data.title.y}}
                               bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                        <div style={{
                            width: "100%",
                            fontWeight: "bold",
                            textAlign: "center",
                            height: '7mm',
                            position: "absolute",
                            zIndex: lastSelected === "title" ? 999 : 1,
                            opacity: selected === "" || selected === "title" ? 1 : 0.5,
                            border: state === undefined ? selected === 'title' ? '2px solid #0096d6' : '1px dashed #0096d6' : '0',
                        }}>
                            <div
                                className="handle">{state && state.title ? state.title : title}</div>
                        </div>
                    </Draggable>}

                {data.date.show && <Draggable
                    onStop={(ev, data) => {
                        eventHandler(ev, data, 'date');
                        setSelected("");
                    }}
                    onStart={() => {
                        setSelected("date");
                        setLastSelected("date");
                    }}
                    disabled={eventHandler === null}
                    defaultPosition={{x: data.date.x, y: data.date.y}}
                    bounds={{left: 0, top: 0, right: 460, bottom: 1000}}>
                    <div style={{
                        width: "100%",
                        border: state === undefined ? selected === 'date' ? '2px solid #0096d6' : '1px dashed #0096d6' : '0',
                        margin: "auto",
                        position: "absolute",
                        zIndex: lastSelected === "date" ? 999 : 1,
                        textAlign: data.date.textAlign ? data.date.textAlign : "",
                        opacity: selected === "" || selected === "date" ? 1 : 0.5,
                        padding: 10
                    }}>
                        <div
                            className="handle"
                            style={{whiteSpace: 'break-spaces'}}>{data.date.prefix} {state ? date : data.date.content} </div>
                    </div>
                </Draggable>}

                <Draggable
                    onStop={(ev, data) => {
                        eventHandler(ev, data, 'patient');
                        setSelected("");
                    }}
                    onStart={() => {
                        setSelected("patient");
                        setLastSelected("patient");
                    }}
                    disabled={eventHandler === null}
                    defaultPosition={{x: data.patient.x, y: data.patient.y}}
                    bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                    <div style={{
                        width: "fit-content",
                        position: "absolute",
                        zIndex: lastSelected === "patient" ? 999 : 1,
                        opacity: selected === "" || selected === "patient" ? 1 : 0.5,
                        border: state === undefined ? selected === 'patient' ? '2px solid #0096d6' : '1px dashed #0096d6' : '0',
                    }}>
                        {data.patient.show && <div
                            className="handle">{data.patient.prefix} {state ? state.patient : data.patient.content}</div>}
                    </div>
                </Draggable>

                {data.cin && <Draggable
                    onStop={(ev, data) => {
                        eventHandler(ev, data, 'cin');
                        setSelected("");
                    }}
                    onStart={() => {
                        setSelected("cin");
                        setLastSelected("cin");
                    }}
                    disabled={eventHandler === null}
                    defaultPosition={{x: data.cin.x, y: data.cin.y}}
                    bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                    <div style={{
                        width: "fit-content",
                        position: "absolute",
                        zIndex: lastSelected === "cin" ? 999 : 1,
                        opacity: selected === "" || selected === "cin" ? 1 : 0.5,
                        border: state === undefined ? selected === 'cin' ? '2px solid #0096d6' : '1px dashed #0096d6' : '0',
                    }}>
                        {data.cin.show && <div
                            className="handle">{data.cin.prefix} {state ? state.cin : data.cin.content}</div>}
                    </div>
                </Draggable>}
            </>}

            <Draggable
                defaultPosition={{x: data.content.x, y: data.content.y}}
                disabled={eventHandler === null}
                allowAnyClick={false}
                onStop={(ev, data) => {
                    eventHandler(ev, data, 'content');
                    setSelected("");
                }}
                onStart={() => {
                    setSelected("content");
                    setLastSelected("content");
                }}
                bounds={{left: 0, top: 0, right: 0, bottom: 1000}}>
                <div style={{
                    width: "100%",
                    padding: '0 10mm',
                    border: "0 solid",
                    overflowWrap: 'break-word',
                    position: "absolute",
                    zIndex: lastSelected === "content" ? 999 : 1,
                    opacity: selected === "" || selected === "content" ? 1 : 0.5,
                    height: `${data.content.maxHeight}px`,
                    overflow: "hidden"
                }}>
                    {state === undefined && <div id={'content' + id} className="box"
                                                 style={{
                                                     height: `${data.content.maxHeight}px`,
                                                     border: selected === 'content' ? '1px solid #0096d6' : '1px dashed #0096d6',
                                                 }}>
                        {data.content.content}</div>}
                    {<div id={id} ref={content}></div>}
                </div>
            </Draggable>

            {data.footer && <Draggable defaultPosition={{x: data.footer.x, y: data.footer.y}}
                                       disabled={eventHandler === null}
                                       onStop={(ev, data) => {
                                           eventHandler(ev, data, 'footer');
                                           setSelected("");
                                       }}
                                       onStart={() => {
                                           setSelected("footer");
                                           setLastSelected("footer");
                                       }}
                                       bounds={{left: 0, top: 0, right: 0, bottom: 1000}}>
                <div style={{
                    padding: "1.5rem 1.5rem 0",
                    position: "absolute",
                    zIndex: lastSelected === "footer" ? 999 : 1,
                    opacity: selected === "" || selected === "footer" ? 1 : 0.5,
                    width: "100%",
                    border: '0 solid red'
                }}>
                    {data.footer.show && <div id={"footer"} className={"footer-st"} ref={footer}></div>}
                </div>
            </Draggable>}
        </div>}
    </>)
}
export default Prescription;
