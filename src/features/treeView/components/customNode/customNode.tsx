import React from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {TypeIcon} from "@features/treeView";
import CustomNodeStyled from "./overrides/customNodeStyled";
import {IconButton, Stack} from "@mui/material";
import IconUrl from "@themes/urlIcon";

export const CustomNode = ({...props}) => {
    const {
        switchPrescriptionModel,
        handleDeleteModel,
        handleEditModel,
        node: {droppable, data},
        depth: {indent}
    } = props;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    }

    return (
        <>
            <CustomNodeStyled
                {...(props.node.parent !== 0 && {
                    onClick: event => {
                        event.stopPropagation();
                        switchPrescriptionModel(props.node.data.drugs);
                    }
                })}
                className={`tree-node`}
                style={{paddingInlineStart: indent}}
            >
                <div
                    className={`expandIconWrapper ${
                        props.isOpen ? "isOpen" : ""
                    }`}
                >
                    {props.node.droppable && (
                        <div onClick={handleToggle}>
                            <ArrowRightIcon/>
                        </div>
                    )}
                </div>
                <div>
                    <TypeIcon droppable={droppable} fileType={data?.fileType}/>
                </div>
                <div className={"labelGridItem"}>
                    <Typography {...(props.node.parent !== 0 && {color: "primary", sx: {cursor: "pointer"}})}
                                variant="body2">{props.node.text}</Typography>
                </div>
                <Stack direction={"row"}>
                    {props.node.parent !== 0 && <IconButton
                        disableRipple
                        sx={{mt: "-6px"}}
                        className="btn-del"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleEditModel(props);
                        }}>
                        <IconUrl width={12} height={12} path="ic-edit"/>
                    </IconButton>}
                    {!props.node.isDefault && <IconButton
                        disableRipple
                        sx={{mt: "-6px"}}
                        className="btn-del"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteModel(props);
                        }}>
                        <IconUrl color="red" width={12} height={12} path="icdelete"/>
                    </IconButton>}
                </Stack>
            </CustomNodeStyled>
        </>
    );
};

export default CustomNode;
