import {
    DragDropContext, DraggableLocation, DropResult
} from "react-beautiful-dnd";
import React, {useCallback, useEffect, useState} from "react";
import styled from '@emotion/styled';
import {BoardList, setIsDragging} from "@features/board";
import {Badge, Card, CardHeader, Grid, IconButton, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {sideBarSelector} from "@features/menu";
import IconUrl from "@themes/urlIcon";
import {CustomSwitch} from "@features/buttons";

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
    height: 80px;
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
    const {
        columns,
        data,
        isUnpaidFilter,
        handleEvent,
        handleDragEvent,
        handleSortData,
        handleUnpaidFilter
    } = props;

    const {t} = useTranslation('waitingRoom');
    const {opened} = useAppSelector(sideBarSelector);

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
        const columnsId = columns.find((column: any) => column.name === destination.droppableId).id.split(',');
        if ((["5"].some(id => columnsId.includes(id)) && source.droppableId !== "ongoing") ||
            (!["5"].some(id => columnsId.includes(id)) && source.droppableId === "ongoing")) {
            return;
        }

        if (!["4"].some(id => columnsId.includes(id)) ||
            (["4", "8"].some(id => columnsId.includes(id)) && boardData[destination.droppableId].length === 0)) {
            const data = reorderQuoteMap({
                quoteMap: boardData,
                source,
                destination,
            });

            setBoardData(data.quoteMap);
        }

        handleDragEvent(result, boardData[source.droppableId][source.index]);

    }, [handleDragEvent, boardData]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const quotes: BoardModel[] = [];
        if (data) {
            Object.entries(data).map(itemGroup => {
                data[itemGroup[0]].map((item: any) => {
                    quotes.push({
                        id: item.uuid,
                        content: {
                            ...item,
                            isDraggable: (![5].includes(item.status) && !item.patient?.isArchived)
                        },
                        column: columns.find((column: BoardColumnsModel) => column.id.split(",").includes(itemGroup[0])),
                    })
                })
            });
            setBoardData(columnDataMap(quotes));
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ParentContainer>
            <DragDropContext onDragEnd={handleOnDragBoard}>
                <Grid container spacing={1}>
                    {Object.keys(boardData).length > 0 && columns.map((column: any, index: number) => (
                        <Grid key={index} item md={3}>
                            <Header>
                                <Title
                                    aria-label={`${column.name} quote list`}>
                                    <Card>
                                        <CardHeader
                                            avatar={columns[index].icon}
                                            sx={{
                                                minHeight: 60,
                                                ".MuiCardHeader-action": {alignSelf: 'center'}
                                            }}
                                            title={
                                                <Stack direction={"row"} alignItems={"center"}
                                                       spacing={1}>
                                                    <Typography
                                                        color={"text.primary"} fontWeight={700}
                                                        fontSize={14}
                                                        sx={{
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            width: columns[index].action && opened ? (columns[index].id === "3" ? 90 : 110) : "auto",
                                                        }}>
                                                        {t(`tabs.${column.name}`)}
                                                    </Typography>

                                                    <Badge
                                                        sx={{pl: 1}}
                                                        invisible={!(boardData[column.name].length > 0 && index !== 2)}
                                                        badgeContent={boardData[column.name].length}
                                                        color="info"/>
                                                </Stack>
                                            }
                                            action={<Stack direction={"row"} alignItems={"center"}
                                                           spacing={1}>
                                                {columns[index].id === "3" &&
                                                    <IconButton
                                                        size={"small"}
                                                        onClick={event => handleSortData(event)}>
                                                        <IconUrl width={20} height={20}
                                                                 path={"sort"}/>
                                                    </IconButton>}

                                                {columns[index].id === "5" &&
                                                    <Stack direction={"row"} alignItems={"center"}
                                                           justifyContent={"flex-end"}
                                                           sx={{height: 28}}>
                                                        <CustomSwitch
                                                            className="custom-switch"
                                                            name="active"
                                                            onChange={handleUnpaidFilter}
                                                            checked={isUnpaidFilter}
                                                        />
                                                        <Typography variant={"body2"}
                                                                    fontSize={12}>{t("tabs.payed")}</Typography>
                                                    </Stack>
                                                }
                                                {!!columns[index].action && columns[index].action}
                                            </Stack>}
                                        />
                                    </Card>
                                </Title>
                            </Header>
                            <BoardList
                                {...{handleEvent}}
                                listId={column.name}
                                quotes={boardData[column.name]}
                                useClone
                            />
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>
        </ParentContainer>)
}

export default Board;
