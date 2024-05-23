import {
    DragDropContext, Draggable, DraggableLocation, Droppable, DropResult
} from "@hello-pangea/dnd";
import React, { useCallback, useEffect, useState } from "react";
import styled from '@emotion/styled';
import { BoardList } from "@features/board";
import { Badge, Button, ButtonGroup, Card, CardHeader, Grid, IconButton, Stack, Theme, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@lib/redux/hooks";
import { sideBarSelector } from "@features/menu";
import IconUrl from "@themes/urlIcon";
import { CustomIconButton, CustomSwitch } from "@features/buttons";

const ParentContainer = styled.div`
    margin-top: -1rem;
    padding-bottom: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
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

const Column = React.memo(function Column(props) {
    const { id, column, index, handleEvent } = props as any;
    return (
        <Draggable draggableId={id} index={index}>
            {provided => (
                <div
                    className="column"
                    {...provided.draggableProps}
                    ref={provided.innerRef}>
                    <h3 className="column-title" {...provided.dragHandleProps}>
                        {column.title}
                    </h3>
                    <BoardList listId={id} quotes={column} {...{ index, handleEvent }} />
                </div>
            )}
        </Draggable>
    );
});

function Board({ ...props }) {
    const {
        columns,
        data,
        isUnpaidFilter,
        handleEvent,
        handleDragEvent,
        handleSortData,
        handleUnpaidFilter
    } = props;

    const { t } = useTranslation('waitingRoom');
    const { opened } = useAppSelector(sideBarSelector);
    const theme: Theme = useTheme()
    const [boardData, setBoardData] = useState<any>({});
    const [status, setStatus] = React.useState<string | null>('All');
    const handleStatus = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null,
    ) => {
        setStatus(newAlignment);
    };

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
                ...current[source.index]?.content,
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
        <DragDropContext onDragEnd={handleOnDragBoard}>
            <ParentContainer>
                <Droppable
                    droppableId="all-droppables"
                    direction="horizontal"
                    type="column">
                    {provided => (
                        <Container
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                            <Grid container spacing={1}>
                                {Object.keys(boardData).length > 0 && columns.map((column: any, index: number) => (
                                    <Grid key={index} item md={3}>
                                        <Header>
                                            <Title
                                                aria-label={`${column.name} quote list`}>
                                                <Card sx={{ border: (theme: Theme) => `1px solid ${theme.palette.grey[200]}`}}>
                                                    <CardHeader
                                                        avatar={
                                                            <CustomIconButton size="small" sx={{ minWidth: 32, minHeight: 32, bgcolor: (theme: Theme) => theme.palette.primary.lighter }}>
                                                                {columns[index].icon}
                                                            </CustomIconButton>
                                                        }
                                                        sx={{
                                                            p: 1,
                                                            ".MuiCardHeader-avatar": { mr: 1 },
                                                            ".MuiCardHeader-action": { alignSelf: 'center' }
                                                        }}
                                                        title={
                                                            <Stack direction={"row"} alignItems={"center"}
                                                                spacing={(boardData[column.name].length > 0 && index !== 2) ? 2 : 0}>
                                                                <Typography
                                                                    color={"text.primary"} fontWeight={700}
                                                                    fontSize={14}

                                                                    sx={{
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        width: columns[index].action && opened ? (columns[index].id === "3" ? 90 : 110) : 'auto',
                                                                    }}>
                                                                    {t(`tabs.${column.name}`)}
                                                                </Typography>

                                                                <Badge
                                                                    sx={{ pl: 1 }}
                                                                    invisible={!(boardData[column.name].length > 0 && index !== 2)}
                                                                    badgeContent={boardData[column.name].length}
                                                                    color="info" />
                                                                <IconUrl path="ic-outline-arrow-right" width={16} height={16} />
                                                            </Stack>
                                                        }
                                                        action={<Stack direction={"row"} alignItems={"center"}
                                                            spacing={1}>
                                                            {columns[index].id === "3" &&
                                                                <IconButton
                                                                    size={"small"}
                                                                    onClick={event => handleSortData(event)}>
                                                                    <IconUrl width={20} height={20}
                                                                        path={"sort"} />
                                                                </IconButton>}

                                                            {columns[index].id === "5" &&
                                                                <Stack direction={"row"} alignItems={"center"}
                                                                    justifyContent={"flex-end"}
                                                                    sx={{ height: 28 }}>
                                                                    {/* <CustomSwitch
                                                                        className="custom-switch"
                                                                        name="active"
                                                                        onChange={handleUnpaidFilter}
                                                                        checked={isUnpaidFilter}
                                                                    /> */}
                                                                    <ToggleButtonGroup
                                                                        size="small"
                                                                        value={status}
                                                                        onChange={handleStatus}
                                                                        exclusive
                                                                        sx={{ '.Mui-selected': { '&.Mui-selected': { bgcolor: theme.palette.grey[200], "&:hover": { bgcolor: theme.palette.grey[200] } } } }}
                                                                    >
                                                                        <ToggleButton sx={{ p: .5, px: 1, color: 'text.primary', minWidth: 48 }} value="All">
                                                                            {t('all', { ns: 'common' })}
                                                                        </ToggleButton>
                                                                        <ToggleButton sx={{ p: .5, px: 1, minWidth: 48 }} value="unpaid">
                                                                            <IconUrl path="ic-filled-money-remove" width={16} height={16} color={theme.palette.text.secondary} />
                                                                        </ToggleButton>
                                                                    </ToggleButtonGroup>
                                                                </Stack>
                                                            }
                                                            {!!columns[index].action && columns[index].action}
                                                        </Stack>}
                                                    />
                                                </Card>
                                            </Title>
                                        </Header>
                                        <Column
                                            {...{
                                                handleEvent,
                                                index,
                                                id: column.name,
                                                column: boardData[column.name]
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            {provided.placeholder}
                        </Container>
                    )}
                </Droppable>
            </ParentContainer>
        </DragDropContext>)
}

export default Board;
