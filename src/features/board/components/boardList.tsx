import React from 'react';
import styled from '@emotion/styled';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import type {
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import {BoardItem, grid, heightOffset} from "@features/board";
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
// eslint-disable-next-line react/display-name
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
        top: style.top,
        width: style.width,
        height: style.height - grid,
    };

    return (
        <div key={index} style={patchedStyle}>
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
                            handleEvent
                        }}
                    />
                )}
            </Draggable>
        </div>
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

export default function BoardList({...props}) {
    const {
        ignoreContainerClipping,
        isDropDisabled,
        isCombineEnabled,
        listId = 'LIST',
        listType,
        quotes,
        title,
        useClone,
        handleEvent
    } = props;

    const ColumnContainer = styled.div`
        opacity: ${({isDropDisabled}: { isDropDisabled: Boolean }) => (isDropDisabled ? 0.5 : 'inherit')};
        height: ${typeof window !== "undefined" && window.innerHeight > 800 ? '75vh' : '67vh'};
        flex-shrink: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
    `;

    const getRowHeight = (data: any) => {
        const elementHeight = document.querySelectorAll(`[data-rbd-draggable-id="${data?.id}"]`)[0]?.getBoundingClientRect().height;
        let defaultHeight;
        switch (data?.column.id.toString()) {
            case "1":
            case "4,8":
                defaultHeight = 65;
                break;
            case "3":
                defaultHeight = 87;
                break;
            default:
                defaultHeight = 70;
                break;
        }
        return (elementHeight ?? defaultHeight) + heightOffset
    }

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
                            height={600}
                            rowCount={itemCount}
                            rowHeight={params => getRowHeight(quotes[params.index])}
                            width={340}
                            autoContainerWidth
                            autoWidth
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
