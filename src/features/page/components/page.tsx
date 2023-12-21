import React, {useEffect, useState} from "react";
import interact from "interactjs";
import PageStyled from "@features/page/components/overrides/pageStyled";
import {Resizable} from "re-resizable";
import Icon from "@themes/urlIcon";

function Page({...props}) {

    const {data, setData, state, eventHandler, selected, setSelected, id = 0} = props
    const [selectedElement, setSelectedElement] = useState("")
    const [blockDrag, setBlockDrag] = useState(false)

    useEffect(() => {
        if (selectedElement !== "") {
            interact(`.${selectedElement}`)
                .draggable({
                    listeners: {
                        move(event) {
                            if (!blockDrag) {
                                console.log(selectedElement)
                                data[selectedElement].x += event.dx
                                data[selectedElement].y += event.dy
                                setData({...data})
                            }
                        },
                    },
                    modifiers: [
                        interact.modifiers.restrictRect({
                            restriction: 'parent'
                        })
                    ]
                })
        }
    }, [data, blockDrag, selectedElement])

    const addSaveBtn = (id: string) => {
        const el = document.getElementById(id);
        var para = document.createElement("div");
        para.style.width = "30px"
        para.style.height = "30px"
        para.style.background = "blue"
        para.style.position = "absolute"
        para.style.top = data["content"].x + "px";
    }

    return (
        <PageStyled>

            <div
                className={`page ${data.size === "portraitA4" ? `${!data.layout ? "" : data.layout}a4` : `${!data.layout ? "" : data.layout}a5`}`}>
                {/*Title*/}
                {data.title.show && <Resizable
                    className={`${selectedElement === "title" ? "selected" : "notSelected"} title`}
                    style={{
                        transform: `translate(${data.title.x}px, ${data.title.y}px)`,
                        width: `${data.title.width ? data.title.width + "px" : "fit-content"}`,
                        height: `fit-content`
                    }}
                    bounds={"parent"}
                    enable={{
                        right: selectedElement === "title"
                    }}
                    onResizeStart={() => {
                        setBlockDrag(true)
                    }}
                    onResizeStop={(e, direction, ref, d) => {
                        data.title.width += d.width
                        data.title.maxHeight += d.height
                        setData({...data})
                        setBlockDrag(false)
                    }}>
                    <div style={{textAlign: "center"}} onClick={(ev) => {
                        ev.stopPropagation()
                        setSelectedElement("title")
                    }}>{state && state.title ? state.title : "X"}</div>

                    <div className={"menuTop"}>
                        <div onClick={() => {
                            setSelectedElement(selectedElement !== "title" ? "title" : "")
                        }}>
                            <Icon path={selectedElement !== "title" ? "ic-edit-patient" : "ic-check"}/>
                        </div>
                    </div>
                </Resizable>}
                {/*Date*/}
                {data.date.show &&
                    <Resizable className={`${selectedElement === "date" ? "selected" : "notSelected"} date`}
                               style={{
                                   transform: `translate(${data.date.x}px, ${data.date.y}px)`,
                                   width: `${data.date.width ? data.date.width + "px" : "fit-content"}`,
                                   height: `${data.date.maxHeight ? data.date.maxHeight + "px" : "fit-content"}`
                               }}
                               bounds={"parent"}
                               enable={{
                                   right: selectedElement === "date",
                               }}
                               onResizeStart={() => {
                                   setBlockDrag(true)
                               }}
                               onResizeStop={(e, direction, ref, d) => {
                                   data.date.width += d.width
                                   data.date.maxHeight += d.height
                                   setData({...data})
                                   setBlockDrag(false)
                               }}>

                        <div onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("date")
                        }}
                             style={{textAlign: data.date.textAlign}}>{data.date.prefix} {state ? "date" : data.date.content} </div>

                        <div className={"menuTop"}>
                            <div onClick={() => {
                                setSelectedElement(selectedElement !== "date" ? "date" : "")
                            }}>
                                <Icon path={selectedElement !== "date" ? "ic-edit-patient" : "ic-check"}/>
                            </div>
                        </div>
                    </Resizable>}
                {/*patient*/}
                {data.patient.show && <Resizable
                    defaultSize={{
                        width: `${data.patient.width ? data.patient.width + "px" : 300}`,
                        height: "fit-content",
                    }}
                    className={`${selectedElement === "patient" ? "selected" : "notSelected"} patient`}
                    style={{
                        transform: `translate(${data.patient.x}px, ${data.patient.y}px)`,
                        width: `${data.patient.width ? data.patient.width + "px" : "fit-content"}`,
                        height: `fit-content`
                    }}
                    bounds={"parent"}
                    enable={{
                        right: selectedElement === "patient",
                    }}
                    onResizeStart={() => {
                        setBlockDrag(true)
                    }}
                    onResizeStop={(e, direction, ref, d) => {
                        data.patient.width += d.width
                        data.patient.maxHeight += d.height
                        setData({...data})
                        setBlockDrag(false)
                    }}>

                    <div onClick={(ev) => {
                        ev.stopPropagation()
                        setSelectedElement("patient")
                    }}>
                        {data.patient.prefix} {state ? state.patient : data.patient.content}
                    </div>
                    <div className={"menuTop"}>
                        <div onClick={() => {
                            setSelectedElement(selectedElement !== "patient" ? "patient" : "")
                        }}>
                            <Icon path={selectedElement !== "patient" ? "ic-edit-patient" : "ic-check"}/>
                        </div>
                    </div>
                </Resizable>}
                {/*Cin*/}
                {data.cin?.show && <Resizable
                    defaultSize={{
                        width: `${data.cin?.width ? data.cin?.width + "px" : 300}`,
                        height: "fit-content",
                    }}
                    className={`${selectedElement === "cin" ? "selected" : "notSelected"} cin`}
                    style={{
                        transform: `translate(${data.cin?.x}px, ${data.cin?.y}px)`,
                        width: `${data.cin?.width ? data.cin?.width + "px" : "fit-content"}`,
                        height: `fit-content`
                    }}
                    bounds={"parent"}
                    enable={{
                        right: selectedElement === "cin",
                    }}
                    onResizeStart={() => {
                        setBlockDrag(true)
                    }}
                    onResizeStop={(e, direction, ref, d) => {
                        data.patient.width += d.width
                        data.patient.maxHeight += d.height
                        setData({...data})
                        setBlockDrag(false)
                    }}>

                    <div onClick={(ev) => {
                        ev.stopPropagation()
                        setSelectedElement("cin")
                    }}>
                        {data.cin?.prefix} {state ? state.cin : data.cin?.content}
                    </div>
                    <div className={"menuTop"}>
                        <div onClick={() => {
                            setSelectedElement(selectedElement !== "cin" ? "cin" : "")
                        }}>
                            <Icon path={selectedElement !== "cin" ? "ic-edit-patient" : "ic-check"}/>
                        </div>
                    </div>
                </Resizable>}

                {/*Content*/}
                <Resizable className={`${selectedElement === "content" ? "selected" : "notSelected"} content`}
                           style={{
                               transform: `translate(${data.content.x}px, ${data.content.y}px)`,
                               width: `${data.content.width ? data.content.width + "px" : "90%"}`,
                               height: `${data.content.maxHeight}px`
                           }}
                           bounds={"parent"}
                           enable={{
                               right: selectedElement === "content",
                               bottom: selectedElement === "content",
                               bottomRight: selectedElement === "content"
                           }}
                           defaultSize={{
                               width: `${data.content.width ? data.content.width + "px" : "90%"}`,
                               height: `${data.content.maxHeight}px`
                           }}
                           onResizeStart={() => {
                               setBlockDrag(true)
                           }}
                           onResizeStop={(e, direction, ref, d) => {
                               if (data.content.width)
                                   data.content.width += d.width
                               else {
                                   const _width = document.getElementById("content")?.clientWidth;
                                   console.log(_width);
                                   if (_width)
                                       data.content.width = _width - d.width
                               }
                               data.content.maxHeight += d.height
                               console.log(data.content)
                               setData({...data})
                               setBlockDrag(false)
                           }}>
                    <div id={"content"} style={{height: "100%"}}>
                        {state === undefined && <div id={'content' + id}>
                            {data.content.width} {data.content.content}</div>}
                    </div>
                    <div className={"menu"}>
                        <div onClick={() => {
                            setSelectedElement(selectedElement !== "content" ? "content" : "")
                        }}>
                            <Icon path={selectedElement !== "content" ? "ic-edit-patient" : "ic-check"}/>
                        </div>
                    </div>
                </Resizable>
            </div>
        </PageStyled>
    );
}

export default Page;
