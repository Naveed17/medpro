import React, {useEffect, useRef, useState} from "react";
import moment from "moment";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import PrescriptionA4 from "@features/files/components/prescriptionA4";
import {getBirthdayFormat, prescriptionPreviewDosage} from "@lib/hooks";
import {Box} from "@mui/material";
import Draggable from "react-draggable";
import interact from "interactjs";

function Page({...props}) {

    const {data,state,eventHandler,selected, setSelected} = props
    const offset = 200;
    const id = 0
    const content = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const position = { x: data.content.x, y: data.content.y }

        interact('.draggable').draggable({
            listeners: {
                start (event) {
                    console.log(event.type, event.target)
                },
                move (event) {
                    position.x += event.dx
                    position.y += event.dy

                    event.target.style.transform =
                        `translate(${position.x}px, ${position.y}px)`
                },
            }
        })
    },[data])

    const [lastSelected, setLastSelected] = useState("");

    return (
        <Box className={"portraitA4"} style={{margin:"30px auto"}}>
            <Draggable
                defaultPosition={{
                    x: data.content.x,
                    y: ((id > 0 && data.header.page > 0) ? data.content.y - offset : data.content.y)
                }}
                position={{
                    x: data.content.x,
                    y: ((id > 0 && data.header.page > 0) ? data.content.y - offset : data.content.y)
                }}
                //disabled={eventHandler === null}
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
                    height: `100%`,
                    overflow: "hidden"
                }}>

                    {state === undefined && <div id={'content' + id} className="box"
                                                 style={{
                                                     height: `${data.content.maxHeight}px`,
                                                   //  border: selected === 'content' ? '1px solid #0096d6' : '1px dashed #0096d6',
                                                 }}>
                        {data.content.content}</div>}
                    {<div id={id.toString()} ref={content}></div>}

                </div>
            </Draggable>

            <div className="draggable"> Draggable Element </div>

        </Box>
    );
}

export default Page;
