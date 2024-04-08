import React, {useEffect, useState} from "react";
import interact from "interactjs";
import PageStyled from "./overrides/pageStyled";
import {Resizable} from "re-resizable";
import Icon from "@themes/urlIcon";
import {useTheme} from "@mui/material";
import {DocHeader} from "@features/files";
import {DocHeaderEditor} from "@features/files/components/docHeaderEditor";
import {useQRCode} from 'next-qrcode';
import {UploadFile} from "@features/uploadFile";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import html2canvas from "html2canvas";

function Page({...props}) {

    const {
        data, setData, id = 0, setOnResize, date, header, setHeader, setValue,
        state, componentRef, editMode, downloadMode,
        urlMedicalProfessionalSuffix, docs, setDocs
    } = props
    const {Canvas} = useQRCode();

    const theme = useTheme();
    const router = useRouter();
    const [selectedElement, setSelectedElement] = useState("")
    const [blockDrag, setBlockDrag] = useState(false)
    const [backgroundImg, setBackgroundImg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const {trigger: triggerUpload} = useRequestQueryMutation("/documents/upload");

    const getMarginTop = () => {
        let _margin = 0;
        let _prev = id - 1;
        while (_prev >= 0) {
            const el = document.getElementById(`content${_prev}`);
            if (el) _margin += el.clientHeight
            _prev -= 1;
        }
        return -1 * _margin
    }

    const getFile = (uuid: string) => {
        const _file = docs?.find((doc: { uuid: string }) => doc.uuid === uuid)
        return _file ? _file.file.url : "/static/icons/Med-logo.png";
    }

    const handleDrop = React.useCallback((acceptedFiles: File[], index: number) => {
            let fr = new FileReader();
            fr.onload = function () {

                const form = new FormData();
                form.append("files[0]", acceptedFiles[0]);
                triggerUpload({
                    method: "POST",
                    url: `${urlMedicalProfessionalSuffix}/documents/${router.locale}`,
                    data: form
                }, {
                    onSuccess: (res) => {
                        data.other[index].content = res.data.data[0]
                        setDocs((prev: any) => [...prev, {uuid: res.data.data[0], file: {url: fr.result}}])
                        setData({...data})
                    },
                });
            }
            fr.readAsDataURL(acceptedFiles[0]);

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data]
    );

    const getPosition = (index: number, pos: string) => {
        const page = data.content.pages?.find((page: { id: number }) => page.id == index)
        if (page)
            return page[pos]
        else
            return data.content[pos]
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    useEffect(() => {
        let htmlContent = document.getElementById(`content${id}`);

        if (downloadMode) {

            if (htmlContent !== null) {
                htmlContent.style.visibility = "visible"

                let targetCanvas = document.getElementById(`canvas${id}`) as HTMLCanvasElement;
                let targetCtx = targetCanvas?.getContext('2d');

                if (targetCanvas)
                    html2canvas(htmlContent).then(function (canvas) {
                        // Define the region you want to capture
                        let width = htmlContent?.clientWidth || 0;
                        let height = htmlContent?.clientHeight || 0;
                        targetCanvas.width = width
                        targetCanvas.height = height
                        //const htmlHeight = htmlContent?.scrollHeight || 0
                        targetCtx?.setTransform(1, 0, 0, 1, 0, 0);
                        targetCtx && targetCtx.drawImage(canvas, 0, 0, width, height);
                        //targetCtx && targetCtx.drawImage(canvas, 0, 0, width, htmlHeight, 0, -1*getMarginTop(), width, height);

                        if (htmlContent)
                            htmlContent.style.visibility = "hidden"
                    });
            }
        } else if (htmlContent)
            htmlContent.style.visibility = "visible"
    }, [downloadMode])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (selectedElement !== "") {
            if (selectedElement.includes("other")) {
                interact(`.${selectedElement}`)
                    .draggable({
                        listeners: {
                            move(event) {
                                if (!blockDrag) {
                                    let index = selectedElement.replace('other', '')
                                    data["other"][index].x += event.dx
                                    data["other"][index].y += event.dy
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
            } else {
                if (selectedElement.includes("content"))
                    interact(`.${selectedElement}`)
                        .draggable({
                            listeners: {
                                move(event) {
                                    const index = parseInt(selectedElement.replace("content", ""))
                                    if (!blockDrag) {
                                        const _height = document.getElementById(selectedElement)?.clientHeight;

                                        if (data.content.pages) {
                                            const page = data.content.pages.find((page: {
                                                id: number
                                            }) => page.id == index)
                                            if (page) {
                                                page.x += event.dx
                                                page.y += event.dy
                                            } else {
                                                data.content.pages.push({
                                                    id: index,
                                                    x: data.content.x + event.dx,
                                                    y: data.content.y + event.dy,
                                                    height: _height
                                                })
                                            }
                                        } else data.content.pages = [{
                                            id: index,
                                            x: data.content.x + event.dx,
                                            y: data.content.y + event.dy,
                                            height: _height
                                        }]
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
                else
                    interact(`.${selectedElement}`)
                        .draggable({
                            listeners: {
                                move(event) {
                                    if (!blockDrag) {
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
        }

        const footer = document.getElementById('footer')
        if (footer && data.footer) {
            footer.innerHTML = data.footer.content;
        }
    }, [data, blockDrag, selectedElement]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (data.background.show && data.background.content !== '') {
            fetch(data.background.content.url).then(response => {
                response.blob().then(blob => {
                    setBackgroundImg(URL.createObjectURL(blob));
                })
            }).catch(() => setBackgroundImg(data.background.content.url))
        }
    }, [data.background.content.url]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <PageStyled>
            <div className={"dropzone"} id="inner-dropzone">
                <div id={`page${id}`}
                     style={{
                         ...(data.background.show && data.background.content !== '' && id === 0 && backgroundImg && {
                             backgroundImage: `url(${backgroundImg})`,
                             backgroundRepeat: "no-repeat",
                             backgroundSize: "100% 100%"
                         })
                     }}
                     {...(componentRef?.current && {ref: (element) => (componentRef.current as any)[id] = element})}
                     className={`page ${data.size === "portraitA4" ? `${!data.layout ? "" : data.layout}a4` : `${!data.layout ? "" : data.layout}a5`}`}>
                    {/*Header*/}
                    {
                        data.header.show && id == 0 && <Resizable
                            defaultSize={{
                                width: `${data.header.width ? data.header.width + "px" : "100%"}`,
                                height: "fit-content",
                            }}
                            className={`${selectedElement === "header" ? "selected" : "notSelected"} header`}
                            style={{
                                transform: `translate(${data.header.x}px, ${data.header.y}px)`,
                                width: `${data.header.width ? data.header.width + "px" : "fit-content"}`,
                                height: `fit-content`,
                                ...(!editMode && {border: 0})
                            }}
                            bounds={"parent"}
                            enable={{
                                right: selectedElement === "header"
                            }}
                            onResizeStart={() => {
                                setBlockDrag(true)
                            }}
                            onResizeStop={(e, direction, ref, d) => {
                                data.header.width += d.width
                                data.header.maxHeight += d.height
                                setData({...data})
                                setBlockDrag(false)
                            }}>
                            <div style={{textAlign: "center"}} onClick={(ev) => {
                                ev.stopPropagation()
                                setSelectedElement("header")
                            }}>
                                {selectedElement === "header" ? <DocHeaderEditor {...{header, setHeader}}/> :
                                    <DocHeader data={header}/>}
                            </div>

                            {editMode && <div className={"menuTop"}>
                                <div className={"btnMenu"} onClick={() => {
                                    data.header.show = false;
                                    setData({...data})
                                }}>
                                    <Icon path={"ic-delete"}/>
                                </div>
                                <div className={"btnMenu"}
                                     style={{backgroundColor: selectedElement === "header" ? theme.palette.success.main : theme.palette.info.main}}
                                     onClick={() => {
                                         setSelectedElement(selectedElement !== "header" ? "header" : "")
                                     }}>
                                    <Icon path={selectedElement !== "header" ? "ic-edit-patient" : "ic-check"}/>
                                </div>
                            </div>}
                        </Resizable>}

                    {/*Title*/}
                    {data.title.show && id == 0 && <Resizable
                        defaultSize={{
                            width: `${data.title.width ? data.title.width + "px" : "100%"}`,
                            height: "fit-content",
                        }}
                        className={`${selectedElement === "title" ? "selected" : "notSelected"} title`}
                        style={{
                            transform: `translate(${data.title.x}px, ${data.title.y}px)`,
                            width: `${data.title.width ? data.title.width + "px" : "fit-content"}`,
                            height: `fit-content`,
                            ...(!editMode && {border: 0})
                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === "title",
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.title.width = document.getElementById(`title${id}`)?.clientWidth
                            data.title.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>

                        <div id={`title${id}`} style={{textAlign: "center"}} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("title")
                        }}>
                            {data.title.content}
                        </div>
                        {editMode && <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.title.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            {/* <div className={"btnMenu"}>
                                <div onClick={() => {setValue("title")}}>
                                    <Icon path={"focus"} width={20} height={20}/>
                                </div>
                            </div>*/}
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "title" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
                                     setSelectedElement(selectedElement !== "title" ? "title" : "")
                                 }}>
                                {selectedElement === "title" ?
                                    <Icon path={"ic-check"}/> :
                                    <Icon path={"text-selection"} width={20} height={20}/>}
                            </div>
                        </div>}
                    </Resizable>}
                    {/*Date*/}
                    {data.date.show && id == 0 && <Resizable
                        defaultSize={{
                            width: `${data.date.width ? data.date.width + "px" : 300}`,
                            height: "fit-content",
                        }}
                        className={`${selectedElement === "date" ? "selected" : "notSelected"} date`}
                        style={{
                            transform: `translate(${data.date.x}px, ${data.date.y}px)`,
                            width: `${data.date.width ? data.date.width + "px" : "fit-content"}`,
                            height: `fit-content`,
                            ...(!editMode && {border: 0})
                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === "date",
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.date.width = document.getElementById(`date${id}`)?.clientWidth
                            data.date.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>

                        <div id={`date${id}`} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("date")
                        }}>
                            {data.date.prefix} {date ? date : data.date.content}
                        </div>
                        {editMode && <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.date.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}>
                                <div onClick={() => {
                                    setValue("date")
                                }}>
                                    <Icon path={"focus"} width={20} height={20}/>
                                </div>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "date" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
                                     setSelectedElement(selectedElement !== "date" ? "date" : "")
                                 }}>
                                <Icon path={selectedElement !== "date" ? "text-selection" : "ic-check"} width={20}
                                      height={20}/>
                            </div>
                        </div>}
                    </Resizable>}
                    {/*patient*/}
                    {data.patient.show && id == 0 && <Resizable
                        defaultSize={{
                            width: `${data.patient.width ? data.patient.width + "px" : 300}`,
                            height: "fit-content",
                        }}
                        className={`${selectedElement === "patient" ? "selected" : "notSelected"} patient`}
                        style={{
                            transform: `translate(${data.patient.x}px, ${data.patient.y}px)`,
                            width: `${data.patient.width ? data.patient.width + "px" : "fit-content"}`,
                            height: `fit-content`,
                            ...(!editMode && {border: 0})
                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === "patient",
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.patient.width = document.getElementById(`patient${id}`)?.clientWidth
                            data.patient.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>

                        <div id={`patient${id}`} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("patient")
                        }}>
                            {data.patient.prefix} {data.patient.content}
                        </div>
                        {editMode && <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.patient.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}>
                                <div onClick={() => {
                                    setValue("patient")
                                }}>
                                    <Icon path={"focus"} width={20} height={20}/>
                                </div>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "patient" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
                                     setSelectedElement(selectedElement !== "patient" ? "patient" : "")
                                 }}>
                                <Icon path={selectedElement !== "patient" ? "text-selection" : "ic-check"} width={20}
                                      height={20}/>
                            </div>
                        </div>}
                    </Resizable>}
                    {/*Cin*/}
                    {data.cin?.show && id == 0 && <Resizable
                        defaultSize={{
                            width: `${data.cin?.width ? data.cin?.width + "px" : 300}`,
                            height: "fit-content",
                        }}
                        className={`${selectedElement === "cin" ? "selected" : "notSelected"} cin`}
                        style={{
                            transform: `translate(${data.cin?.x}px, ${data.cin?.y}px)`,
                            width: `${data.cin?.width ? data.cin?.width + "px" : "fit-content"}`,
                            height: `fit-content`,
                            ...(!editMode && {border: 0})
                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === "cin",
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.cin.width = document.getElementById(`cin${id}`)?.clientWidth

                            data.cin.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>

                        <div id={`cin${id}`} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("cin")
                        }}>
                            {data.cin?.prefix} {data.cin?.content}
                        </div>
                        {editMode && <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.cin.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "cin" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
                                     setSelectedElement(selectedElement !== "cin" ? "cin" : "")
                                 }}>
                                <Icon path={selectedElement !== "cin" ? "ic-edit-patient" : "ic-check"}/>
                            </div>
                        </div>}
                    </Resizable>}

                    {/*Age*/}
                    {data.age?.show && id == 0 && <Resizable
                        defaultSize={{
                            width: `${data.age?.width ? data.age?.width + "px" : 300}`,
                            height: "fit-content",
                        }}
                        className={`${selectedElement === "age" ? "selected" : "notSelected"} age`}
                        style={{
                            transform: `translate(${data.age?.x}px, ${data.age?.y}px)`,
                            width: `${data.age?.width ? data.age?.width + "px" : "fit-content"}`,
                            height: `fit-content`,
                            ...(!editMode && {border: 0})
                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === "age",
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.age.width = document.getElementById(`age${id}`)?.clientWidth
                            data.age.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>

                        <div id={`age${id}`} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("age")
                        }}>
                            {data.age?.prefix} {data.age?.content}
                        </div>
                        {editMode && <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.age.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "age" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
                                     setSelectedElement(selectedElement !== "age" ? "age" : "")
                                 }}>
                                <Icon path={selectedElement !== "age" ? "ic-edit-patient" : "ic-check"}/>
                            </div>
                        </div>}
                    </Resizable>}

                    {
                        data.other && id == 0 && data.other.map((other: any, index: number) => (
                            <Resizable
                                key={index}
                                defaultSize={{
                                    width: `${other.width ? other.width + "px" : "100%"}`,
                                    height: `${other.height ? other.height + "px" : "fit-content"}`,
                                }}
                                className={`${selectedElement === `other${index}` ? "selected" : "notSelected"} other${index}`}
                                style={{
                                    transform: `translate(${other.x}px, ${other.y}px)`,
                                    width: `${other.width ? other.width + "px" : "fit-content"}`,
                                    height: `${other.height ? other.height + "px" : "fit-content"}`,
                                    ...(!editMode && {border: 0})
                                }}
                                bounds={"parent"}
                                enable={{
                                    right: selectedElement === `other${index}`,
                                    bottom: selectedElement === `other${index}`,
                                    bottomRight: selectedElement === `other${index}`,
                                }}
                                onResizeStart={() => {
                                    setBlockDrag(true)
                                }}
                                onResizeStop={(e, direction, ref, d) => {
                                    other.width = document.getElementById(`other${index}`)?.clientWidth
                                    other.height += d.height
                                    setData({...data})
                                    setBlockDrag(false)
                                }}>

                                {other.type === "text" && <div id={`other${index}`} style={{textAlign: "center"}}
                                                               dangerouslySetInnerHTML={{__html: other.content}}
                                                               onClick={(ev) => {
                                                                   ev.stopPropagation()
                                                                   setSelectedElement(`other${index}`)
                                                               }}/>}
                                {other.type === "image" && <div id={`other${index}`}
                                                                onClick={(ev) => {
                                                                    ev.stopPropagation()
                                                                    setSelectedElement(`other${index}`)
                                                                }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={getFile(other.content)} style={{width: other.width, height: other.height}}
                                         alt={"logo"}/>
                                </div>}
                                {other.type === "qrcode" && <div id={`other${index}`}
                                                                 onClick={(ev) => {
                                                                     ev.stopPropagation()
                                                                     setSelectedElement(`other${index}`)
                                                                 }}>
                                    <Canvas
                                        text={other.content}
                                        options={{
                                            errorCorrectionLevel: 'M',
                                            margin: 0,
                                            scale: 4,
                                            width: other.width,
                                            color: {
                                                dark: '#000000',
                                                light: '#FFFFFF',
                                            },
                                        }}
                                        logo={{
                                            src: '/static/icons/Med-logo.png',
                                            options: {
                                                width: 35,
                                                x: undefined,
                                                y: undefined,
                                            }
                                        }}
                                    />
                                </div>}
                                {editMode && <div className={"menuTop"}>
                                    <div className={"btnMenu"}
                                         onClick={() => {
                                             data.other.splice(index, 1)
                                             setData({...data})
                                         }}>
                                        <Icon path={"ic-delete"}/>
                                    </div>
                                    {
                                        selectedElement === `other${index}` && other.type !== "image" &&
                                        <div className={"btnMenu"}>
                                            <div onClick={() => {
                                                setValue(`other${index}`)
                                            }}>
                                                <Icon path={"focus"} width={20} height={20}/>
                                            </div>
                                        </div>
                                    }
                                    {selectedElement === `other${index}` && other.type === "image" &&
                                        <div className={"btnMenu"}>
                                            <UploadFile
                                                accept={{'image/jpeg': ['.png', '.jpeg', '.jpg']}}
                                                style={{height: 30}}
                                                onDrop={(ev: File[]) => handleDrop(ev, index)}
                                                singleFile={false}/>
                                        </div>}
                                    <div className={"btnMenu"}
                                         style={{backgroundColor: selectedElement === `other${index}` ? theme.palette.success.main : theme.palette.info.main}}
                                         onClick={() => {
                                             setSelectedElement(selectedElement !== `other${index}` ? `other${index}` : "")
                                         }}>
                                        {selectedElement === `other${index}` ?
                                            <Icon path={"ic-check"}/> :
                                            <Icon path={"text-selection"} width={20} height={20}/>}
                                    </div>
                                </div>}
                            </Resizable>
                        ))
                    }


                    {/*Content*/}


                    <Resizable
                        className={`${selectedElement === `content${id}` ? "selected" : "notSelected"} ${downloadMode ? "contentPis" : "content"} resizable content${id}`}
                        style={{
                            paddingLeft: 15, paddingRight: 15,
                            transform: `translate(${getPosition(id, "x")}px, ${getPosition(id, "y")}px)`,
                            width: `${data.content.width ? data.content.width + "px" : "90%"}`,
                            height: `${data.content.maxHeight}px`,
                            ...(!editMode && {border: 0})

                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === `content${id}` && id === 0,
                            bottom: selectedElement === `content${id}`,
                            bottomRight: selectedElement === `content${id}` && id === 0
                        }}
                        defaultSize={{
                            width: `${data.content.width ? data.content.width + "px" : "90%"}`,
                            height: `${data.content.maxHeight}px`
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.content.width += d
                            const _height = document.getElementById(`content${id}`)?.clientHeight;

                            if (id === 0)
                                data.content.maxHeight = _height;
                            if (data.content.pages) {
                                const page = data.content.pages.find((page: { id: number }) => page.id == id)
                                if (page) {
                                    page.height = _height
                                } else data.content.pages.push({
                                    id,
                                    x: data.content.x,
                                    y: data.content.y,
                                    height: _height
                                })
                            } else {
                                data.content.pages = [{id, x: data.content.x, y: data.content.y, height: _height}]
                            }
                            setBlockDrag(false)
                            setOnResize(true);
                        }}>
                        {downloadMode && <canvas id={`canvas${id}`}/>}
                        <div
                            id={`content${id}`}
                            style={{marginTop: loading ? 0 : getMarginTop(), width: "100%", height: "100%"}}
                            dangerouslySetInnerHTML={{__html: data.content.content}}/>
                        {editMode && <div className={"menuTop"} style={{top: 0}}>
                            {state && <div className={"btnMenu"}>
                                <div onClick={() => {
                                    setValue("content")
                                }}>
                                    <Icon path={"focus"} width={20} height={20}/>
                                </div>
                            </div>}
                            <div className={"btnMenu"}
                                 style={{background: selectedElement === `content${id}` ? theme.palette.success.main : theme.palette.info.main}}>
                                <div onClick={() => {
                                    setSelectedElement(selectedElement !== `content${id}` ? `content${id}` : "")
                                    selectedElement === `content${id}` && interact(`.content${id}`).draggable(false);
                                }}>
                                    {selectedElement === `content${id}` ?
                                        <Icon path={"ic-check"}/> :
                                        <Icon path={"text-selection"} width={20} height={20}/>}
                                </div>
                            </div>
                        </div>}
                    </Resizable>

                    {/*footer*/}
                    {data.footer.show && id === 0 && <Resizable
                        defaultSize={{
                            width: `${data.footer.width ? data.footer.width + "px" : 300}`,
                            height: `${data.footer.height ? data.footer.height + "px" : "fit-content"}`,
                        }}
                        className={`${selectedElement === "footer" ? "selected" : "notSelected"} footer`}
                        style={{
                            transform: `translate(${data.footer.x}px, ${data.footer.y}px)`,
                            width: `${data.footer.width ? data.footer.width + "px" : "fit-content"}`,
                            height: `${data.footer.height ? data.footer.height + "px" : "fit-content"}`,
                            ...(!editMode && {border: 0})
                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === "footer",
                            bottom: selectedElement === "footer",
                            bottomRight: selectedElement === "footer",
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.footer.width = document.getElementById(`footer`)?.clientWidth
                            data.footer.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>
                        <div id={`patient${id}`} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("footer")
                        }}>
                            <div id={"footer"} className={"footer-st"}/>
                        </div>
                        {editMode && <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.footer.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}>
                                <div onClick={() => {
                                    setValue("footer")
                                }}>
                                    <Icon path={"focus"} width={20} height={20}/>
                                </div>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "footer" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
                                     setSelectedElement(selectedElement !== "footer" ? "footer" : "")
                                 }}>
                                {selectedElement === "footer" ?
                                    <Icon path={"ic-check"}/> :
                                    <Icon path={"text-selection"} width={20} height={20}/>}
                            </div>
                        </div>}
                    </Resizable>}
                </div>
            </div>
        </PageStyled>
    );
}

export default Page;
