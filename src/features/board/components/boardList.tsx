import React from 'react';
import styled from '@emotion/styled';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import type {
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import {BoardItem, grid} from "@features/board";
import {useTimer} from "@lib/hooks";


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  opacity: ${({isDropDisabled}: { isDropDisabled: Boolean }) => (isDropDisabled ? 0.5 : 'inherit')};

  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 100%;
`;

const scrollContainerHeight: number = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;

  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${typeof window !== "undefined" && window.innerHeight > 800 ? '75vh' : '67vh'};
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */


const InnerQuoteList = React.memo(function InnerQuoteList(props: any) {
    return props.quotes.map((quote: any, index: number) => (
        <Draggable key={quote.id} draggableId={quote.id} index={index} isDragDisabled={!quote?.content.isDraggable}>
            {(
                dragProvided: DraggableProvided,
                dragSnapshot: DraggableStateSnapshot,
            ) => (
                <BoardItem
                    {...{index}}
                    key={quote.id}
                    quote={quote}
                    isDragging={dragSnapshot.isDragging}
                    isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                    provided={dragProvided}
                    handleEvent={props.handleEvent}
                />
            )}
        </Draggable>
    ));
});

function InnerList({...props}) {
    const {quotes, dropProvided} = props;
    const title = props.title ? <div>{props.title}</div> : null;

    return (
        <Container>
            {title}
            <DropZone ref={dropProvided.innerRef}>
                <InnerQuoteList quotes={quotes} handleEvent={props.handleEvent}/>
                {dropProvided.placeholder}
            </DropZone>
        </Container>
    );
}

export default function BoardList({...props}) {
    const {
        ignoreContainerClipping,
        internalScroll,
        scrollContainerStyle,
        isDropDisabled,
        isCombineEnabled,
        listId = 'LIST',
        listType,
        style,
        quotes,
        title,
        useClone,
        handleEvent
    } = props;

    return (
        <Droppable
            droppableId={listId}
            type={listType}
            ignoreContainerClipping={ignoreContainerClipping}
            isDropDisabled={isDropDisabled}
            isCombineEnabled={isCombineEnabled}
            renderClone={useClone && ((provided, snapshot, descriptor) => (
                <BoardItem
                    handleEvent
                    quote={quotes[descriptor.source.index]}
                    provided={provided}
                    isDragging={snapshot.isDragging}
                    isClone
                />
            ))}>
            {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
                <Wrapper
                    style={style}
                    isDraggingOver={dropSnapshot.isDraggingOver}
                    isDropDisabled={isDropDisabled}
                    isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
                    {...dropProvided.droppableProps}>
                    {internalScroll ? (
                        <ScrollContainer style={scrollContainerStyle}>
                            <InnerList
                                {...{handleEvent, title, quotes, dropProvided}}
                            />
                        </ScrollContainer>
                    ) : (
                        <InnerList
                            {...{handleEvent, title, quotes, dropProvided}}
                        />
                    )}
                </Wrapper>
            )}
        </Droppable>
    );
}
