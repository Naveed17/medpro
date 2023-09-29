import React, {useCallback} from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {TypeIcon} from "@features/treeView";
import CustomNodeStyled from "./overrides/customNodeStyled";
import {IconButton, Stack} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';

export const CustomNode = ({...props}) => {
    const {
        switchModel = null,
        handleDeleteModel = null,
        handleMoveModel = null,
        handleEditModel = null,
        node: {droppable, data},
        depth: {indent}
    } = props;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    }

    const handleClickEvent = useCallback((data: any) => {
        switchModel(data);
    }, [switchModel]);

    return (
        <>
            <CustomNodeStyled
                {...(props.node.parent !== 0 && {
                    onClick: event => {
                        event.stopPropagation();
                        handleClickEvent(props.node.data);
                    }
                })}
                className={`tree-node`}
                style={{paddingInlineStart: indent}}>
                <div
                    className={`expandIconWrapper ${
                        props.isOpen ? "isOpen" : ""
                    }`}>
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
                <Stack direction={"row"} alignItems={"center"}>
                    {(props.node.parent !== 0 && handleMoveModel) && <IconButton
                        disableRipple
                        sx={{mt: "-2px"}}
                        className="btn-del"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleMoveModel(props);
                        }}>
                        <DriveFileMoveOutlinedIcon sx={{width: 16, height: 16}}/>
                    </IconButton>}
                    {(props.node.parent !== 0 && handleEditModel) && <IconButton
                        disableRipple
                        sx={{mt: "-6px"}}
                        className="btn-del"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleEditModel(props);
                        }}>
                        <IconUrl width={12} height={12} path="ic-edit"/>
                    </IconButton>}
                    {(!props.node.isDefault && handleDeleteModel) && <IconButton
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
