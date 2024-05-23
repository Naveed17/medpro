import React, {useLayoutEffect, useRef} from 'react';
import {Droppable, Draggable} from '@hello-pangea/dnd';
import type {
    DroppableProvided,
    DroppableStateSnapshot
} from '@hello-pangea/dnd';
import {BoardItem, grid, heightOffset} from "@features/board";
import {areEqual, VariableSizeList} from "react-window";

const Row = React.memo(function Row(props) {
    const {data: {quotes, handleEvent}, index, style} = props as any;
    const item = quotes[index];

    // We are rendering an extra item for the placeholder
    if (!item) {
        return null;
    }

    // Faking some nice spacing around the items
    const patchedStyle = {
        ...style,
        left: style.left,
        top: style.top + grid,
        width: style.width,
        height: style.height - grid,
    };

    return (
        <Draggable draggableId={item.id} index={index} key={item.id} isDragDisabled={!item?.content.isDraggable}>
            {(provided, snapshot) =>
                <BoardItem
                    {...{
                        index,
                        provided,
                        style: patchedStyle,
                        handleEvent
                    }}
                    isDragging={snapshot.isDragging}
                    quote={item}/>}
        </Draggable>
    );
}, areEqual);

function BoardList({...props}) {
    const {
        listId = 'LIST',
        quotes,
        handleEvent
    } = props;

    const getRowHeight = (data: any) => {
        const elementHeight = document.querySelectorAll(`[data-rbd-draggable-id="${data?.id}"] .MuiCardContent-root`)[0]?.getBoundingClientRect().height;
        let defaultHeight;
        switch (data?.column.id.toString()) {
            case "1":
            case "4,8":
                if (data.content.startTime === "00:00") {
                    defaultHeight = 56;
                } else if (data?.content.status === 8) {
                    defaultHeight = 87;
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
        !!quotes?.length && listRef?.current?.resetAfterIndex?.(0);
    }, [quotes]);

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
                    <VariableSizeList
                        height={660}
                        itemCount={itemCount}
                        estimatedItemSize={70}
                        itemSize={index => getRowHeight(quotes[index])}
                        width={"auto"}
                        ref={listRef}
                        outerRef={droppableProvided.innerRef}
                        style={{
                            transition: 'background-color 0.2s ease'
                        }}
                        itemData={{quotes, handleEvent}}>
                        {Row}
                    </VariableSizeList>
                );
            }}
        </Droppable>
    );
}

export default React.memo(BoardList);
