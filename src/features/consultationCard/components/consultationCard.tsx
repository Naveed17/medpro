import React from "react";
import {WidgetForm} from "@features/widget";
import {DragDropContext, Draggable as DraggableDnd, Droppable} from "@hello-pangea/dnd";
import {MyCardStyled, MyHeaderCardStyled} from "@features/subHeader";
import {
    Box,
    Collapse,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Stack,
    Typography
} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {ModelDot} from "@features/modelDot";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import {ConsultationDetailCard} from "@features/card";
import {HistoryTab} from "@features/tabPanel";

function ConsultationCard({...props}: any) {

    const {
        cards,
        setCards,
        onDragEnd,
        getListStyle,
        getItemStyle,
        selectedModel,
        sheetExam,
        closeExam,
        theme,
        sheet,
        changes,
        setChanges,
        setIsClose,
        app_uuid,
        mutateSheetData,
        hasDataHistory,
        seeHistory,
        setCloseExam,
        dispatch,
        printGlasses,
        isClose,
        changeModel,
        acts,
        loading,
        urlMedicalEntitySuffix,
        direction,
        setOpenDialog,
        showDoc,
        sheetModal,
        setState,
        mutatePatient,
        setInfo,
        setSelectedModel,
        router,
        setActs,
        previousData,
        setIsViewerOpen,
        setSelectedTab,
        models,
        t,
        triggerAppointmentEdit,
        agenda,
        fullOb,
        setFullOb,
        patient
    } = props
    return (
        <div style={{display: "flex", width: "100%"}}>
            <DragDropContext onDragEnd={onDragEnd}>
                {cards.map((el: any, ind: number) => (
                    <Droppable key={ind} droppableId={`${ind}`}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef}
                                 style={{...getListStyle(snapshot.isDraggingOver), ...(cards.length === 1 && {width: "100%"})}}
                                 {...provided.droppableProps}>
                                {el.map((item: any, index: number) => (
                                    <DraggableDnd
                                        key={item.id}
                                        draggableId={item.id}
                                        isDragDisabled={item.content === 'exam'}
                                        index={index}>
                                        {(provided: any, snapshot: any) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                <MyCardStyled>
                                                    <Stack direction={"row"}
                                                           style={{backgroundColor: item.content === 'widget' && selectedModel ? alpha(selectedModel?.default_modal.color, 0.3) : ""}}
                                                           justifyContent={"space-between"}
                                                           onClick={() => {
                                                               document.activeElement && (document.activeElement as HTMLElement).blur();
                                                               let _cards = [...cards];
                                                               _cards[ind][index].expanded = !item.expanded
                                                               _cards[ind][index].config = false
                                                               const _locPosition = JSON.parse(localStorage.getItem("cardPositions") as string)
                                                               localStorage.setItem(`cardPositions`, JSON.stringify({
                                                                   ..._locPosition,
                                                                   widget: item.expanded
                                                               }))

                                                               setCards([..._cards])
                                                               mutateSheetData()
                                                           }}
                                                           alignItems={"center"}>
                                                        {item.content === 'widget' && selectedModel ?
                                                            <MyHeaderCardStyled>
                                                                <Stack direction={"row"}
                                                                       spacing={1}
                                                                       alignItems={"center"}
                                                                       border={"1px solid white"}
                                                                       onClick={(e) => {
                                                                           e.stopPropagation();
                                                                           let _cards = [...cards];
                                                                           _cards[ind][index].config = !item.config
                                                                           _cards[ind][index].expanded = false
                                                                           setCards([..._cards])
                                                                       }}
                                                                       style={{
                                                                           padding: "3px 8px",
                                                                           borderRadius: 5
                                                                       }}>
                                                                    <ModelDot
                                                                        color={selectedModel?.default_modal?.color}
                                                                        selected={false}/>
                                                                    <Typography
                                                                        className={'card-title'}>{selectedModel?.default_modal.label}</Typography>
                                                                    <IconUrl
                                                                        className={"card-icon"}
                                                                        path="ic-flesh-bas-y"/>
                                                                </Stack>

                                                            </MyHeaderCardStyled> :
                                                            <MyHeaderCardStyled direction={"row"} alignItems={"center"} spacing={1}>
                                                                <Icon className={'card-header'}
                                                                      color={theme.palette.text.primary}
                                                                      width={20}
                                                                      height={20}
                                                                      path={item.icon}/>
                                                                <Typography
                                                                    className={'card-title'}>{item.content !== "widget" ? t(item.content) : ""}</Typography>
                                                            </MyHeaderCardStyled>}
                                                        <Stack direction={"row"}>
                                                            <IconButton className={"btn-full"} style={{marginRight: 5}}>
                                                                <IconUrl path={'reduce'}/>
                                                            </IconButton>
                                                        </Stack>
                                                    </Stack>
                                                    <Collapse in={item.expanded} timeout="auto"
                                                              unmountOnExit>
                                                        {item.content === 'exam' && sheet && sheetExam &&
                                                            <ConsultationDetailCard
                                                                {...{
                                                                    changes,
                                                                    setChanges,
                                                                    app_uuid,
                                                                    exam: sheetExam,
                                                                    hasDataHistory,
                                                                    seeHistory,
                                                                    closed: closeExam,
                                                                    setCloseExam,
                                                                    isClose,
                                                                    agenda,
                                                                    mutateSheetData,
                                                                    fullOb, setFullOb,
                                                                    trigger: triggerAppointmentEdit,
                                                                    loading
                                                                }}
                                                                handleClosePanel={(v: boolean) => setCloseExam(v)}
                                                            />}
                                                        {item.content === 'history' && <div
                                                            id={"histo"}
                                                            style={{
                                                                padding: 10,
                                                                borderTop: "1px solid #DDD",
                                                                borderBottomRightRadius: 3,
                                                                borderBottomLeftRadius: 3,
                                                                maxHeight: "96.4vh",
                                                                overflowY: "auto",
                                                                backgroundColor: theme.palette.grey["A10"]
                                                            }}>
                                                            <HistoryTab
                                                                {...{
                                                                    patient: {
                                                                        uuid: sheet?.patient,
                                                                        ...patient
                                                                    },
                                                                    dispatch,
                                                                    mini: true,
                                                                    t,
                                                                    acts,
                                                                    direction,
                                                                    mutate: mutatePatient,
                                                                    setOpenDialog,
                                                                    showDoc,
                                                                    setState,
                                                                    setInfo,
                                                                    router,
                                                                    setIsViewerOpen,
                                                                    setSelectedTab,
                                                                    appuuid: app_uuid,
                                                                    trigger: triggerAppointmentEdit
                                                                }}
                                                            /></div>}
                                                        {item.content === 'widget' && !loading && models && Array.isArray(models) && models.length > 0 && selectedModel && patient && (
                                                            <WidgetForm
                                                                {...{
                                                                    models,
                                                                    changes,
                                                                    setChanges,
                                                                    isClose,
                                                                    acts,
                                                                    setActs,
                                                                    previousData,
                                                                    selectedModel,
                                                                    appuuid: app_uuid,
                                                                    modal: selectedModel,
                                                                    data: sheetModal?.data,
                                                                    closed: closeExam,
                                                                    setSM: setSelectedModel,
                                                                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
                                                                    mutateSheetData,
                                                                    printGlasses
                                                                }}
                                                                handleClosePanel={(v: boolean) => setIsClose(v)}></WidgetForm>
                                                        )}
                                                    </Collapse>

                                                    <Collapse in={item.config} timeout="auto"
                                                              unmountOnExit>
                                                        <MenuList>
                                                            {(models as any[])?.map((item: any, idx: number) => (
                                                                <Box key={"widgt-x-" + idx}>
                                                                    {item.isEnabled && (
                                                                        <MenuItem
                                                                            key={`model-item-${idx}`}
                                                                            onClick={() => {
                                                                                changeModel(item, ind, index)
                                                                            }}>
                                                                            <ListItemIcon>
                                                                                <ModelDot
                                                                                    color={item.color}
                                                                                    selected={false}
                                                                                    size={21}
                                                                                    sizedot={13}
                                                                                    padding={3}
                                                                                />
                                                                            </ListItemIcon>
                                                                            <ListItemText
                                                                                style={{
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap",
                                                                                    overflow: "hidden",
                                                                                }}>
                                                                                {item.label}
                                                                            </ListItemText>
                                                                        </MenuItem>
                                                                    )}
                                                                </Box>
                                                            ))}
                                                        </MenuList>
                                                    </Collapse>
                                                </MyCardStyled>
                                            </div>
                                        )}
                                    </DraggableDnd>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </div>
    )
}

export default ConsultationCard
