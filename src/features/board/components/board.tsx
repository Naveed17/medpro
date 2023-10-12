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
import {grid, QuoteList} from "@features/board";

const ParentContainer = styled.div`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;


const ContainerColumn = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
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
        name: 'Jake',
        url: '#',
        avatarUrl: "/static/icons/men-avatar.svg",
    },
    {
        id: '2',
        name: 'Bom',
        url: '#',
        avatarUrl: "/static/icons/men-avatar.svg",
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
            "status": 5
        },
        author: authors[1],
    }]

const getByAuthor = (author: any, items: any[]): any[] =>
    items.filter((quote: any) => quote.author === author);

export const authorQuoteMap: any = authors.reduce(
    (previous: any, author: any) => ({
        ...previous,
        [author.name]: getByAuthor(author, quotes),
    }),
    {},
);

function Board() {
    console.log("authorQuoteMap", Object.keys(authorQuoteMap));
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
                        <Container ref={provided.innerRef} {...provided.droppableProps}>
                            {Object.keys(authorQuoteMap).map((key: any, index: number) => (
                                <Draggable key={index} draggableId={key} index={index}>
                                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                        <ContainerColumn ref={provided.innerRef} {...provided.draggableProps}>
                                            <Header isDragging={snapshot.isDragging}>
                                                <Title
                                                    isDragging={snapshot.isDragging}
                                                    {...provided.dragHandleProps}
                                                    aria-label={`${key} quote list`}>
                                                    {key}
                                                </Title>
                                            </Header>
                                            <QuoteList
                                                listId={key}
                                                listType="QUOTE"
                                                quotes={authorQuoteMap[key]}
                                                internalScroll
                                                isCombineEnabled
                                                useClone
                                            />
                                        </ContainerColumn>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Container>
                    )}
                </Droppable>
            </DragDropContext>
        </ParentContainer>)
}

export default Board;
