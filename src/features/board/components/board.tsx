import {
    DragDropContext,
    Draggable, DraggableLocation,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided, DropResult
} from "react-beautiful-dnd";
import React, {useCallback, useEffect, useState} from "react";
import styled from '@emotion/styled';
import {BoardList} from "@features/board";
import {Card, CardHeader, Grid, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useAppSelector} from "@lib/redux/hooks";
import {sideBarSelector} from "@features/menu";

const ParentContainer = styled.div`
  margin-top: -1rem;
  padding-bottom: 1rem;
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
    const {columns, data, handleEvent, handleDragEvent} = props;
    const {opened} = useAppSelector(sideBarSelector);

    const {t} = useTranslation('waitingRoom', {keyPrefix: 'config.tabs'});

    const [boardData, setBoardData] = useState<any>({});

    const getByColumn = (column: any, items: any[]): any[] =>
        items.filter((data: any) => data.column === column);

    // a little function to help us with reordering the result
    const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const reorderQuoteMap = ({
                                 quoteMap,
                                 source,
                                 destination,
                             }: any) => {
        const current: any[] = [...quoteMap[source.droppableId]];
        const next: any[] = [...quoteMap[destination.droppableId]];
        const target: any = {
            ...current[source.index],
            content: {
                ...current[source.index].content,
                status: parseInt(columns.find((column: BoardColumnsModel) => column.name === destination.droppableId)?.id)
            }
        };

        // moving to same list
        if (source.droppableId === destination.droppableId) {
            const reordered: any[] = reorder(
                current,
                source.index,
                destination.index,
            );
            const result: any = {
                ...quoteMap,
                [source.droppableId]: reordered,
            };
            return {
                quoteMap: result,
            };
        }

        // moving to different list

        // remove from original
        current.splice(source.index, 1);
        // insert into next
        next.splice(destination.index, 0, target);

        const result: any = {
            ...quoteMap,
            [source.droppableId]: current,
            [destination.droppableId]: next,
        };

        return {
            quoteMap: result,
        };
    };

    const columnDataMap = (data: BoardModel[]) => columns.reduce(
        (previous: any, column: any) => ({
            ...previous,
            [column.name]: getByColumn(column, data),
        }), {});

    const handleOnDragBoard = useCallback((result: DropResult) => {
        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source: DraggableLocation = result.source;
        const destination: DraggableLocation = result.destination;

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // reordering column
        if (result.type === 'COLUMN') {
            return;
        }

        // skip drag to 3 and 4 column
        if (["4", "5"].includes(columns.find((column: any) => column.name === destination.droppableId).id)) {
            return;
        }

        const data = reorderQuoteMap({
            quoteMap: boardData,
            source,
            destination,
        });

        setBoardData(data.quoteMap);

        handleDragEvent(result, boardData[source.droppableId][source.index]);

    }, [handleDragEvent, boardData]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const quotes: BoardModel[] = [];
        if (data) {
            Object.entries(data).map(itemGroup => {
                data[itemGroup[0]].map((item: any) => {
                    quotes.push({
                        id: item.uuid,
                        content: {...item, isDraggable: (![4, 5].includes(item.status) && !item.patient?.isArchived)},
                        column: columns.find((column: BoardColumnsModel) => column.id.split(",").includes(itemGroup[0])),
                    })
                })
            });
            setBoardData(columnDataMap(quotes));
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
    console.log(boardData)
    return (
        <ParentContainer>
            <DragDropContext onDragEnd={handleOnDragBoard}>
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
                                                    <Card>
                                                        <CardHeader
                                                            avatar={columns[index].icon}
                                                            {...(columns[index].action && {action: columns[index].action})}
                                                            sx={{
                                                                minHeight: 60,
                                                                ".MuiCardHeader-action": {alignSelf: 'center'}
                                                            }}
                                                            title={<Typography
                                                                color={"text.primary"} fontWeight={700}
                                                                fontSize={14}
                                                                sx={{
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    width: columns[index].action && opened ? 110 : "auto",
                                                                }}>
                                                                {t(key)} {boardData[key].length > 0 && index < 3 ? `(${boardData[key].length})` : ""}
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
