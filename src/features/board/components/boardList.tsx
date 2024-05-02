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
import ReactDOM from "react-dom";
import {List} from 'react-virtualized';

const DropZone = styled.div`
    /* stop the list collapsing when empty */
    min-height: 250px;

    /*
      not relying on the items for a margin-bottom
      as it will collapse when the list is empty
    */
    padding-bottom: 8px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */


// Using a higher order function so that we can look up the quotes data to retrieve
// our quote from within the rowRender function
const getRowRender = (quotes: any[], handleEvent: any) => ({index, style}: any) => {
    const quote = quotes[index];

    // We are rendering an extra item for the placeholder
    // Do do this we increased our data set size to include one 'fake' item
    if (!quote) {
        return null;
    }

    // Faking some nice spacing around the items
    const patchedStyle = {
        ...style,
        left: 0,
        top: style.top + grid,
        width: `calc(${style.width} - ${grid}px)`,
        height: style.height - grid,
    };

    return (
        <Draggable key={quote.id} draggableId={quote.id} index={index} isDragDisabled={!quote?.content.isDraggable}>
            {(
                dragProvided: DraggableProvided,
                dragSnapshot: DraggableStateSnapshot,
            ) => (
                <div key={index} style={patchedStyle}>
                    <BoardItem
                        {...{
                            index,
                            quote,
                            isDragging: dragSnapshot.isDragging,
                            isGroupedOver: Boolean(dragSnapshot.combineTargetFor),
                            provided: dragProvided,
                            handleEvent
                        }}
                    />
                </div>
            )}
        </Draggable>
    );
};

const InnerQuoteList = React.memo(function InnerQuoteList(props: any) {
    return props.quotes.map((quote: any, index: number) => (
        <Draggable key={quote.id} draggableId={quote.id} index={index} isDragDisabled={!quote?.content.isDraggable}>
            {(
                dragProvided: DraggableProvided,
                dragSnapshot: DraggableStateSnapshot,
            ) => (
                <BoardItem
                    {...{
                        index,
                        quote,
                        isDragging: dragSnapshot.isDragging,
                        isGroupedOver: Boolean(dragSnapshot.combineTargetFor),
                        provided: dragProvided,
                        handleEvent: props.handleEvent
                    }}
                    key={quote.id}
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
    console.log("quotes", quotes)
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

    const ScrollContainer = styled.div`
        overflow-x: hidden;
        overflow-y: auto;
        max-height: ${typeof window !== "undefined" && window.innerHeight > 800 ? '75vh' : '67vh'};
    `;

    const ColumnContainer = styled.div`
        flex-shrink: 0;
        margin: ${grid}px;
        display: flex;
        flex-direction: column;
    `;

    return (
        <ColumnContainer>
            {title}
            <Droppable
                droppableId={listId}
                type={listType}
                mode="virtual"
                ignoreContainerClipping={ignoreContainerClipping}
                isDropDisabled={isDropDisabled}
                isCombineEnabled={isCombineEnabled}
                renderClone={useClone && ((provided, snapshot, descriptor) => (
                    <BoardItem
                        style={{margin: 0}}
                        {...{
                            handleEvent,
                            quote: quotes[descriptor.source.index],
                            provided,
                            isDragging: snapshot.isDragging
                        }}></BoardItem>
                ))}>
                {(
                    droppableProvided: DroppableProvided,
                    snapshot: DroppableStateSnapshot,
                ) => {
                    const itemCount: number = snapshot.isUsingPlaceholder ? quotes.length + 1 : quotes.length;

                    return (
                        <List
                            height={500}
                            rowCount={itemCount}
                            rowHeight={110}
                            estimatedRowSize={100}
                            width={260}
                            ref={(ref) => {
                                // react-virtualized has no way to get the list's ref that I can
                                //  we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                                if (ref) {
                                    // eslint-disable-next-line react/no-find-dom-node
                                    const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                                    if (whatHasMyLifeComeTo instanceof HTMLElement) {
                                        droppableProvided.innerRef(whatHasMyLifeComeTo);
                                    }
                                }
                            }}
                            style={{
                                ...style,
                                transition: 'background-color 0.2s ease',
                            }}
                            rowRenderer={getRowRender(quotes, handleEvent)}
                        />
                    );
                }}
            </Droppable>
        </ColumnContainer>
    );
}
