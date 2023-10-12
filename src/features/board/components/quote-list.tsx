// @flow
import React from 'react';
import styled from '@emotion/styled';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import QuoteItem from './quote-item';

import type {
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import {grid} from "@features/board";


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  opacity: ${({isDropDisabled}) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
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
  max-height: 100%;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */


const InnerQuoteList = React.memo(function InnerQuoteList(
    props: any,
) {
    return props.quotes.map((quote: any, index: number) => (
        <Draggable key={quote.id} draggableId={quote.id} index={index}>
            {(
                dragProvided: DraggableProvided,
                dragSnapshot: DraggableStateSnapshot,
            ) => (
                <QuoteItem
                    key={quote.id}
                    quote={quote}
                    isDragging={dragSnapshot.isDragging}
                    isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                    provided={dragProvided}
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
                <InnerQuoteList quotes={quotes}/>
                {dropProvided.placeholder}
            </DropZone>
        </Container>
    );
}

export default function QuoteList({...props}) {
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
    } = props;

    return (
        <Droppable
            droppableId={listId}
            type={listType}
            ignoreContainerClipping={ignoreContainerClipping}
            isDropDisabled={isDropDisabled}
            isCombineEnabled={isCombineEnabled}
            renderClone={
                useClone
                    ? (provided, snapshot, descriptor) => (
                        <QuoteItem
                            quote={quotes[descriptor.source.index]}
                            provided={provided}
                            isDragging={snapshot.isDragging}
                            isClone
                        />
                    )
                    : null
            }
        >
            {(
                dropProvided: DroppableProvided,
                dropSnapshot: DroppableStateSnapshot,
            ) => (
                <Wrapper
                    style={style}
                    isDraggingOver={dropSnapshot.isDraggingOver}
                    isDropDisabled={isDropDisabled}
                    isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
                    {...dropProvided.droppableProps}
                >
                    {internalScroll ? (
                        <ScrollContainer style={scrollContainerStyle}>
                            <InnerList
                                quotes={quotes}
                                title={title}
                                dropProvided={dropProvided}
                            />
                        </ScrollContainer>
                    ) : (
                        <InnerList
                            quotes={quotes}
                            title={title}
                            dropProvided={dropProvided}
                        />
                    )}
                </Wrapper>
            )}
        </Droppable>
    );
}
