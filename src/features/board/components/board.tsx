import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided
} from "react-beautiful-dnd";
import React from "react";
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


const authors: any[] = [
    {
        id: '1',
        name: 'Rdv aujourd\'hui',
        url: '#',
        icon: <CalendarIcon/>,
        action: <CustomIconButton
            variant="filled"
            color={"primary"}
            size={"small"}>
            <AddIcon fontSize={"small"} htmlColor={"white"}/>
        </CustomIconButton>
    },
    {
        id: '2',
        name: 'Salle d’attente',
        url: '#',
        icon: <IconUrl width={24} height={24} path="ic_waiting_room"/>,
        action: <CustomIconButton
            variant="filled"
            color={"primary"}
            size={"small"}>
            <AddIcon fontSize={"small"} htmlColor={"white"}/>
        </CustomIconButton>
    },
    {
        id: '3',
        name: 'En Consultation',
        url: '#',
        icon: <IconUrl width={20} height={20} path="ic-attendre"/>
    },
    {
        id: '4',
        name: 'Terminé',
        url: '#',
        icon: <CheckCircleIcon
            color={"primary"}
            sx={{
                ml: 'auto',
                width: 20
            }}/>
    }];

export const quotes: any[] = [
    {
        id: '1',
        content: {
            "duration": 15,
            "restAmount": 350,
            "dayDate": "14-10-2023",
            "consultationReasons": [],
            "patient": {
                "firstName": "MED",
                "lastName": "ZGHAL",
                "uuid": "db233d6f-1069-4f08-ad0f-7f0ddda5050b",
                "contact": [{
                    "code": "+216",
                    "flag": "tn",
                    "value": "44332211"
                }]
            },
            "isOnline": false,
            "startTime": "08:30",
            "type": {
                "color": "#1BC47D",
                "icon": "ic-consultation",
                "name": "Consultation"
            },
            "uuid": "f9661384-1f46-4498-a99c-742c7dc3d88b",
            "status": 1
        },
        author: authors[0],
    },
    {
        id: '2',
        content: {
            "duration": 15,
            "restAmount": 350,
            "dayDate": "11-10-2023",
            "consultationReasons": [],
            "patient": {
                "firstName": "MED",
                "lastName": "UPDATE",
                "uuid": "db233d6f-1069-4f08-ad0f-7f0ddda5050b",
                "contact": [{
                    "code": "+216",
                    "flag": "tn",
                    "value": "44332211"
                }]
            },
            "isOnline": false,
            "startTime": "09:15",
            "type": {
                "color": "#1BC47D",
                "icon": "ic-consultation",
                "name": "Consultation"
            },
            "uuid": "c9e55c89-cd9f-49e1-a677-0b17a4f910e1",
            "status": 3
        },
        author: authors[1],
    }]

const getByAuthor = (author: any, items: any[]): any[] =>
    items.filter((quote: any) => quote.author === author);

export const authorQuoteMap: any = authors.reduce(
    (previous: any, author: any) => ({
        ...previous,
        [author.name]: getByAuthor(author, quotes),
    }), {});

function Board() {
    const theme = useTheme();

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
                            {Object.keys(authorQuoteMap).map((key: any, index: number) => (
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
                                                            avatar={authors[index].icon}
                                                            {...(authors[index].action && {action: authors[index].action})}
                                                            title={<Typography
                                                                color={"text.primary"} fontWeight={700}
                                                                fontSize={14}>
                                                                {key}
                                                            </Typography>}
                                                        />
                                                    </Card>
                                                </Title>
                                            </Header>
                                            <BoardList
                                                listId={key}
                                                listType="QUOTE"
                                                quotes={authorQuoteMap[key]}
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
