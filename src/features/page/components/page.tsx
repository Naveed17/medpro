import React, {useEffect, useState} from "react";
import interact from "interactjs";
import PageStyled from "@features/page/components/overrides/pageStyled";
import {Resizable} from "re-resizable";
import Icon from "@themes/urlIcon";
import {useTheme} from "@mui/material";
import {DocHeader} from "@features/files";
import {DocHeaderEditor} from "@features/files/components/docHeaderEditor";
import {tinymcePlugins, tinymceToolbar} from "@lib/constants";
import {Editor} from "@tinymce/tinymce-react";

function Page({...props}) {

    const {data, setData, state, id = 0, setOnResize, date, title, header, setHeader} = props

    const theme = useTheme();

    const [selectedElement, setSelectedElement] = useState("")
    const [blockDrag, setBlockDrag] = useState(false)
    const [resizeContent, setResizeContent] = useState(false)
    const [backgroundImg, setBackgroundImg] = useState<string | null>(null);

    useEffect(() => {
        if (selectedElement !== "") {
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

        const footer = document.getElementById('footer')
        if (footer && data.footer) {
            footer.innerHTML = data.footer.content;
        }
    }, [data, blockDrag, selectedElement]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (data.background.show && data.background.content !== '') {
            if (data.background.content.thumbnails)
                setBackgroundImg(data.background.content.url)
            else
                fetch(data.background.content.url).then(response => {
                    response.blob().then(blob => {
                        setBackgroundImg(URL.createObjectURL(blob));
                    })
                })
        }
    }, [data.background.content.url]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <PageStyled>
            <div className={"dropzone"} id="inner-dropzone">
                <div
                    style={{
                        ...(data.background.show && data.background.content !== '' && id === 0 && backgroundImg && {
                            backgroundImage: `url(${backgroundImg})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "100% 100%"
                        })
                    }}
                    className={`page ${data.size === "portraitA4" ? `${!data.layout ? "" : data.layout}a4` : `${!data.layout ? "" : data.layout}a5`}`}>
                    {/*Header*/}
                    {
                        data.header.show && <Resizable
                            defaultSize={{
                                width: `${data.header.width ? data.header.width + "px" : "100%"}`,
                                height: "fit-content",
                            }}
                            className={`${selectedElement === "header" ? "selected" : "notSelected"} header`}
                            style={{
                                transform: `translate(${data.header.x}px, ${data.header.y}px)`,
                                width: `${data.header.width ? data.header.width + "px" : "fit-content"}`,
                                height: `fit-content`
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

                            <div className={"menuTop"}>

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


                            </div>
                        </Resizable>}

                    {/*Title*/}
                    {data.title.show && <Resizable
                        defaultSize={{
                            width: `${data.title.width ? data.title.width + "px" : "100%"}`,
                            height: "fit-content",
                        }}
                        className={`${selectedElement === "title" ? "selected" : "notSelected"} title`}
                        style={{
                            transform: `translate(${data.title.x}px, ${data.title.y}px)`,
                            width: `${data.title.width ? data.title.width + "px" : "fit-content"}`,
                            height: `fit-content`
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
                            {title ? title : data.title.content}
                        </div>
                        <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.title.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "title" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
                                     setSelectedElement(selectedElement !== "title" ? "title" : "")
                                 }}>
                                <Icon path={selectedElement !== "title" ? "ic-edit-patient" : "ic-check"}/>
                            </div>
                        </div>
                    </Resizable>}
                    {/*Date*/}
                    {data.date.show && <Resizable
                        defaultSize={{
                            width: `${data.date.width ? data.date.width + "px" : 300}`,
                            height: "fit-content",
                        }}
                        className={`${selectedElement === "date" ? "selected" : "notSelected"} date`}
                        style={{
                            transform: `translate(${data.date.x}px, ${data.date.y}px)`,
                            width: `${data.date.width ? data.date.width + "px" : "fit-content"}`,
                            height: `fit-content`
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
                        <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.date.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "date" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
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
                            data.patient.width = document.getElementById(`patient${id}`)?.clientWidth
                            data.patient.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>

                        <div id={`patient${id}`} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("patient")
                        }}>
                            {data.patient.prefix} {state ? state.patient : data.patient.content}
                        </div>
                        <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.patient.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "patient" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
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
                            data.cin.width = document.getElementById(`cin${id}`)?.clientWidth

                            data.cin.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>

                        <div id={`cin${id}`} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("cin")
                        }}>
                            {data.cin?.prefix} {state ? state.cin : data.cin?.content}
                        </div>
                        <div className={"menuTop"}>
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
                        </div>
                    </Resizable>}

                    {/*Content*/}
                    <Resizable
                        className={`${selectedElement === "content" ? "selected" : "notSelected"} content resizable`}
                        style={{
                            paddingLeft: 15, paddingRight: 15,
                            transform: `translate(${data.content.x}px, ${data.content.y}px)`,
                            width: `${data.content.width ? data.content.width + "px" : "90%"}`,
                            height: `${data.content.maxHeight}px`
                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === "content" && id === 0,
                            bottom: selectedElement === "content",
                            bottomRight: selectedElement === "content" && id === 0
                        }}
                        defaultSize={{
                            width: `${data.content.width ? data.content.width + "px" : "90%"}`,
                            height: `${data.content.maxHeight}px`
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                            console.log("start")
                            setResizeContent(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.content.width = document.getElementById(`content${id}`)?.clientWidth
                            const _height = document.getElementById(`content${id}`)?.clientHeight;

                            if (data.content.pages) {
                                const page = data.content.pages.find(page => page.id == id)
                                if (page) {
                                    page.x = data.content.x
                                    page.y = data.content.y
                                    page.height = _height
                                } else data.content.pages.push({id,x:data.content.x,y:data.content.y,height:_height})
                            } else {
                                data.content.pages = [{id,x:data.content.x,y:data.content.y,height:_height}]
                            }

                            data.content.maxHeight = _height;
                            console.log(data.content)
                            setBlockDrag(false)
                            setOnResize(true);
                            setTimeout(() => {
                                setResizeContent(false)
                            }, 1000)
                        }}>

                        {resizeContent && <div style={{marginTop: -14 - id * data.content.maxHeight}}
                                               dangerouslySetInnerHTML={{__html: state && state.content ? state.content : data.content.content}}></div>}

                        <canvas id={`content${id}`} style={{
                            width: "100%",
                            height: "100%",
                            visibility: resizeContent ? "hidden" : "visible"
                        }}></canvas>


                        <div className={"menu"}
                             style={{background: selectedElement === "content" ? theme.palette.success.main : theme.palette.info.main}}>
                            <div onClick={() => {
                                setSelectedElement(selectedElement !== "content" ? "content" : "")
                            }}>
                                <Icon path={selectedElement !== "content" ? "ic-edit-patient" : "ic-check"}/>
                            </div>
                        </div>
                    </Resizable>

                    {/*footer*/}
                    {data.footer.show && <Resizable
                        defaultSize={{
                            width: `${data.footer.width ? data.footer.width + "px" : 300}`,
                            height: "fit-content",
                        }}
                        className={`${selectedElement === "footer" ? "selected" : "notSelected"} footer`}
                        style={{
                            transform: `translate(${data.footer.x}px, ${data.footer.y}px)`,
                            width: `${data.footer.width ? data.footer.width + "px" : "fit-content"}`,
                            height: `fit-content`
                        }}
                        bounds={"parent"}
                        enable={{
                            right: selectedElement === "footer",
                        }}
                        onResizeStart={() => {
                            setBlockDrag(true)
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            data.footer.width = document.getElementById(`footer${id}`)?.clientWidth
                            data.footer.maxHeight += d.height
                            setData({...data})
                            setBlockDrag(false)
                        }}>

                        <div id={`patient${id}`} onClick={(ev) => {
                            ev.stopPropagation()
                            setSelectedElement("footer")
                        }}>
                            {selectedElement === "footer" ? <Editor
                                value={data.footer.content}
                                apiKey={process.env.EDITOR_KEY}
                                onEditorChange={(res) => {
                                    data.footer.content = res;
                                    setData({...data});
                                }}
                                init={{
                                    branding: false,
                                    statusbar: false,
                                    menubar: false,
                                    plugins: tinymcePlugins,
                                    toolbar: tinymceToolbar,
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'

                                }}
                            /> : <div id={"footer"} className={"footer-st"}/>}
                        </div>
                        <div className={"menuTop"}>
                            <div className={"btnMenu"}
                                 onClick={() => {
                                     data.footer.show = false;
                                     setData({...data})
                                 }}>
                                <Icon path={"ic-delete"}/>
                            </div>
                            <div className={"btnMenu"}
                                 style={{backgroundColor: selectedElement === "footer" ? theme.palette.success.main : theme.palette.info.main}}
                                 onClick={() => {
                                     setSelectedElement(selectedElement !== "footer" ? "footer" : "")
                                 }}>
                                <Icon path={selectedElement !== "footer" ? "ic-edit-patient" : "ic-check"}/>
                            </div>
                        </div>
                    </Resizable>}
                </div>
            </div>
        </PageStyled>
    );
}

export default Page;
