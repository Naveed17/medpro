import Draggable from "react-draggable";
import {DocHeader} from "@features/files";
import React, {useRef} from "react";
import moment from "moment";

const Prescription = ({...props}) => {
    const {eventHandler, data, pages, id, values, state} = props;
    const content = useRef<HTMLDivElement>(null);
    content.current?.append(pages[id].content)

    return (
        <>
            {data !== undefined && <div className={"page"}>
                {data.background.show && data.background.content !== '' && id === 0 &&
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={"page"}
                         style={{position: "absolute", height: '210mm'}}
                         src={data.background.content} alt={'backgroud'}/>}


                <Draggable onStop={(ev, data) => {
                    eventHandler(ev, data, 'header')
                }}
                           bounds={{left: 0, top: 0, right: 0, bottom: 710}}>
                    <div style={{padding: "1.5rem 1.5rem 0", width: "100%", border: '0 solid red', height: '35mm'}}>
                        {data.header.show && <DocHeader data={values}></DocHeader>}
                    </div>
                </Draggable>

                {id === 0 && <>
                    <Draggable onStop={(ev, data) => {
                        eventHandler(ev, data, 'title')
                    }}
                               defaultPosition={{x: data.title.x, y: data.title.y}}
                               bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                        <div style={{width: "100%", border: '0 solid red', textAlign: "center", height: '6mm'}}>
                            {data.title.show && <div className="handle">{data.title.content}</div>}
                        </div>
                    </Draggable>

                    <Draggable onStop={(ev, data) => {
                        eventHandler(ev, data, 'date')
                    }}
                               defaultPosition={{x: data.date.x, y: data.date.y}}
                               bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                        <div style={{width: "fit-content", border: '0 solid red'}}>
                            {data.date.show && <div
                                className="handle">{data.date.prefix} {state ? moment(state.createdAt).format('DD/MM/YYYY') : data.date.content}</div>}
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
                    <div style={{width: "100%", padding: '0 10mm', overflowWrap: 'break-word'}}>
                        {state === undefined && <div id={'content' + id} className="box"
                                                     style={{height: `${data.content.maxHeight}px`}}>
                            {data.content.content}</div>}

                        {state !== undefined && <div id={id} ref={content}></div>}
                    </div>
                </Draggable>

            </div>}
        </>
    )
}
export default Prescription;
