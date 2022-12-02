import Draggable from "react-draggable";
import {DocHeader} from "@features/files";
import React, {useRef} from "react";

const Prescription = ({...props}) => {
    const {background, header, title, eventHandler, date, patient, pages, id} = props;
    const content = useRef<HTMLDivElement>(null);
    content.current?.append(pages[id].content)


    return (
        <div className={"page"}>
            {background.show && background.content !== '' && id === 0 &&
                // eslint-disable-next-line @next/next/no-img-element
                <img className={"page"}
                     style={{position: "absolute", height: '210mm'}}
                     src={background.content} alt={'backgroud'}/>}


            <Draggable onStop={eventHandler}
                       bounds={{left: 0, top: 0, right: 0, bottom: 710}}>
                <div style={{padding: "1.5rem 1.5rem 0", width: "100%", border: '0 solid red', height: '35mm'}}>
                    {header.show && <DocHeader></DocHeader>}
                </div>
            </Draggable>

            {id == 0 && <><Draggable onStop={eventHandler}
                                     defaultPosition={{x: title.x, y: title.y}}
                                     bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                <div style={{width: "100%", border: '0 solid red', textAlign: "center", height: '6mm'}}>
                    {title.show && <div className="handle">{title.content}</div>}
                </div>
            </Draggable>

                <Draggable onStop={eventHandler}
                           defaultPosition={{x: date.x, y: date.y}}
                           bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                    <div style={{width: "fit-content", border: '0 solid red'}}>
                        {date.show && <div className="handle">{date.content}</div>}
                    </div>
                </Draggable>

                <Draggable onStop={eventHandler}
                           defaultPosition={{x: patient.x, y: patient.y}}
                           bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                    <div style={{padding: "1rem", width: "30%"}}>
                        {patient.show && <div className="handle">{patient.content}</div>}
                    </div>
                </Draggable></>}

            <Draggable onStop={eventHandler}
                       defaultPosition={{x: 0, y: 0}}
                       bounds={{left: 0, top: 0, right: 460, bottom: 740}}>
                <div style={{width: "100%", padding: '10mm', overflowWrap: 'break-word'}}>
                    <div id={id} ref={content}></div>
                </div>
            </Draggable>

        </div>
    )
}
export default Prescription;
