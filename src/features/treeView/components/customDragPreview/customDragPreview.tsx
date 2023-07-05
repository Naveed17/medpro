import React from "react";
import {TypeIcon} from "@features/treeView";
import CustomDragPreviewStyled from "./overrides/customDragPreviewStyled";

export const CustomDragPreview = ({...props}) => {
    const item = props.monitorProps.item;

    return (
        <CustomDragPreviewStyled>
            <div className={"icon"}>
                <TypeIcon droppable={item.droppable} fileType={item?.data?.fileType}/>
            </div>
            <div className={"label"}>{item.text}</div>
        </CustomDragPreviewStyled>
    );
};

export default CustomDragPreview;
