import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided
} from "react-beautiful-dnd";
import React, {useEffect, useState} from "react";
import styled from '@emotion/styled';
import {BoardList} from "@features/board";
import {Card, CardHeader, Grid, IconButton, Typography, useTheme} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarIcon from "@themes/overrides/icons/calendarIcon";
import IconUrl from "@themes/urlIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {CustomIconButton} from "@features/buttons";
import {Theme} from "@mui/system";

const ParentContainer = styled.div`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 1px;
  border-top-right-radius: 1px;
  transition: background-color 0.2s ease;

  &:hover {
    
  }
`;

const Title = styled.h4`
  padding: 1px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;

  &:focus {
  
    outline-offset: 2px;
  }
`;

function Board({...props}) {
    const {columns, data, handleEvent} = props;

    const [boardData, setBoardData] = useState<any>({});

    const getByColumn = (column: any, items: any[]): any[] =>
        items.filter((data: any) => data.column === column);

    const columnDataMap = (data: BoardModel[]) => columns.reduce(
        (previous: any, column: any) => ({
            ...previous,
            [column.name]: getByColumn(column, data),
        }), {});

    useEffect(() => {
        const quotes: BoardModel[] = [];
        if (data) {
            Object.entries(data).map(itemGroup => {
                data[itemGroup[0]].map((item: any) => {
                    quotes.push({
                        id: item.uuid,
                        content: item,
                        column: columns.find((column: BoardColumnsModel) => column.id === itemGroup[0]),
                    })
                })
            });
            setBoardData(columnDataMap(quotes));
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ParentContainer>
            <DragDropContext onDragEnd={(e) => console.log("onDragEnd", e)}>
                <Droppable
                    droppableId="board"
                    type="COLUMN"
                    direction="horizontal"
                    ignoreContainerClipping={true}
                    isCombineEnabled={true}>
                    {(provided: DroppableProvided) => (
                        <Grid container spacing={1} ref={provided.innerRef} {...provided.droppableProps}>
                            {Object.keys(boardData).map((key: any, index: number) => (
                                <Draggable key={index} draggableId={key} index={index}>
                                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                        <Grid item md={3} ref={provided.innerRef} {...provided.draggableProps}>
                                            <Header isDragging={snapshot.isDragging}>
                                                <Title
                                                    isDragging={snapshot.isDragging}
                                                    {...provided.dragHandleProps}
                                                    aria-label={`${key} quote list`}>
                                                    <Card sx={{mr: 2, minWidth: 235}}>
                                                        <CardHeader
                                                            avatar={columns[index].icon}
                                                            {...(columns[index].action && {action: columns[index].action})}
                                                            title={<Typography
                                                                color={"text.primary"} fontWeight={700}
                                                                fontSize={14}>
                                                                {key} {boardData[key].length > 0 && index < 3 ? `(${boardData[key].length})` : ""}
                                                            </Typography>}
                                                        />
                                                    </Card>
                                                </Title>
                                            </Header>
                                            <BoardList
                                                {...{handleEvent}}
                                                listId={key}
                                                listType="QUOTE"
                                                quotes={boardData[key]}
                                                internalScroll
                                                isCombineEnabled
                                                useClone
                                            />
                                        </Grid>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>
        </ParentContainer>)
}

export default Board;
