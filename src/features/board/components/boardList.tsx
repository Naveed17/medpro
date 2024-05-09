import React, {useLayoutEffect, useRef} from 'react';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import type {
    DroppableProvided,
    DroppableStateSnapshot
} from 'react-beautiful-dnd';
import {BoardItem, heightOffset} from "@features/board";
import {areEqual, VariableSizeList} from "react-window";

const Row = React.memo(function Row(props) {
    const {data: {quotes, handleEvent, windowWidth, setSize}, index, style} = props as any;
    const item = quotes[index];

    // We are rendering an extra item for the placeholder
    if (!item) {
        return null;
    }

    return (
        <Draggable draggableId={item.id} index={index} key={item.id} isDragDisabled={!item?.content.isDraggable}>
            {provided => <BoardItem {...{index, provided, style, handleEvent, windowWidth, setSize}} quote={item}/>}
        </Draggable>
    );
}, areEqual);

function BoardList({...props}) {
    const {
        index,
        listId = 'LIST',
        quotes,
        handleEvent
    } = props;

    const getRowHeight = (data: any) => {
        const elementHeight = document.querySelectorAll(`[data-rbd-draggable-id="${data?.id}"]`)[0]?.getBoundingClientRect().height;
        let defaultHeight;
        switch (data?.column.id.toString()) {
            case "1":
            case "4,8":
                if (data.content.startTime === "00:00") {
                    defaultHeight = 56;
                } else {
                    defaultHeight = 76;
                }
                break;
            case "3":
                if (data.content.startTime === "00:00") {
                    defaultHeight = 76;
                } else {
                    defaultHeight = 87;
                }
                break;
            default:
                defaultHeight = 76;
                break;
        }
        return ((elementHeight && elementHeight >= defaultHeight) ? elementHeight : (defaultHeight + heightOffset))
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
                    <VariableSizeList
                        height={600}
                        itemCount={itemCount}
                        itemSize={index => getRowHeight(quotes[index])}
                        width={320}
                        ref={listRef}
                        outerRef={droppableProvided.innerRef}
                        itemData={{quotes, handleEvent}}>
                        {Row}
                    </VariableSizeList>
                );
            }}
        </Droppable>
    );
}

export default React.memo(BoardList);
