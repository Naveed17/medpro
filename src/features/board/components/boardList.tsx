import React, {forwardRef, useLayoutEffect, useRef} from 'react';
import styled from '@emotion/styled';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import type {
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import {BoardItem, boardSelector, grid, heightOffset} from "@features/board";
import ReactDOM from "react-dom";
import {useAppSelector} from "@lib/redux/hooks";
import {areEqual, FixedSizeList} from "react-window";

// Using a higher order function so that we can look up the quotes data to retrieve
// our quote from within the rowRender function
// eslint-disable-next-line react/display-name
const getRowRender = (quotes: any[], handleEvent: any, isDragging: boolean) => ({index, style}: any) => {
    const quote = quotes[index];
    // We are rendering an extra item for the placeholder
    // Do this we increased our data set size to include one 'fake' item
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

const Row = React.memo(function Row(props) {
    const {data: items, index, style} = props as any;
    console.log("props", props)
    const item = items[index];

    // We are rendering an extra item for the placeholder
    if (!item) {
        return null;
    }

    return (
        <Draggable draggableId={item.id} index={index} key={item.id}>
            {provided => <BoardItem {...{index, provided, style}} quote={item}/>}
        </Draggable>
    );
}, areEqual);

function BoardList({...props}) {
    const {
        index,
        listId = 'LIST',
        quotes,
        title,
        handleEvent
    } = props;

    const {isDragging} = useAppSelector(boardSelector);

    const ColumnContainer = styled.div`
        opacity: ${({isDropDisabled}: { isDropDisabled: Boolean }) => (isDropDisabled ? 0.5 : 'inherit')};
        height: ${typeof window !== "undefined" && window.innerHeight > 800 ? '75vh' : '67vh'};
        flex-shrink: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
    `;

    // eslint-disable-next-line react/display-name
    const outerElementType = forwardRef((props, ref) => (
        <div ref={ref} handleEvent={handleEvent} {...props} />
    ));
    const getRowHeight = (data: any) => {
        const elementHeight = document.querySelectorAll(`[data-rbd-draggable-id="${data?.id}"]`)[0]?.getBoundingClientRect().height;
        let defaultHeight;
        switch (data?.column.id.toString()) {
            case "1":
            case "4,8":
                if (data.content.startTime === "00:00") {
                    defaultHeight = 50;
                } else {
                    defaultHeight = 65;
                }
                break;
            case "3":
                if (data.content.startTime === "00:00") {
                    defaultHeight = 65;
                } else {
                    defaultHeight = 87;
                }
                break;
            default:
                defaultHeight = 70;
                break;
        }
        return ((elementHeight && elementHeight >= defaultHeight) ? elementHeight : defaultHeight) + heightOffset
    };

    const listRef = useRef<any>();

    useLayoutEffect(() => {
        const list = listRef.current;
        if (list) {
            list.scrollTo(0);
        }
    }, [index]);

    return (
        <Droppable
            droppableId={listId}
            mode="virtual"
            renderClone={((provided, snapshot, descriptor) => (
                <BoardItem
                    style={{margin: 0}}
                    {...{
                        handleEvent,
                        quote: quotes[descriptor.source.index],
                        provided,
                        isDragging: snapshot.isDragging
                    }}></BoardItem>
            ))}>
            {(droppableProvided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
                const itemCount: number = snapshot.isUsingPlaceholder ? quotes.length + 1 : quotes.length;
                return (
                    <FixedSizeList
                        height={600}
                        itemCount={itemCount}
                        itemSize={87}
                        width={320}
                        ref={listRef}
                        outerElementType={outerElementType}
                        outerRef={droppableProvided.innerRef}
                        itemData={quotes}>
                        {Row}
                    </FixedSizeList>
                );
            }}
        </Droppable>
    );
}

export default React.memo(BoardList);
