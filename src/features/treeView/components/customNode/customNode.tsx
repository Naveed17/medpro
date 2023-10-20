import React, {useCallback, useState} from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {TypeIcon} from "@features/treeView";
import CustomNodeStyled from "./overrides/customNodeStyled";
import {IconButton, MenuItem} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import {ModelDot} from "@features/modelDot";
import Icon from "@themes/urlIcon";
import StyledMenu from "@features/toolbar/components/appToolbar/overrides/menuStyle";
import {useTranslation} from "next-i18next";

export const CustomNode = ({...props}) => {
    const {
        selectedNode = null,
        switchModel = null,
        handleDeleteModel = null,
        handleMoveModel = null,
        handleEditModel = null,
        node: {droppable, data},
        depth: {indent}
    } = props;

    const {t} = useTranslation("common");

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

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
                {...(!props.node.isDefault && {
                    onClick: event => {
                        event.stopPropagation();
                        handleClickEvent(props.node);
                    }
                })}
                className={`tree-node`}
                style={{paddingInlineStart: indent, ...((props.node.parent !== 0 || props.node.parent === 0 && !props.node.hasOwnProperty("isDefault")) && selectedNode && selectedNode !== props.node.id && {opacity: 0.6})}}>
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
                    {data?.color || props.node?.color ?
                        <ModelDot
                            size={20}
                            sizedot={12}
                            padding={3}
                            marginRight={5}
                            key={data?.color ?? props.node?.color}
                            color={data?.color ?? props.node?.color}>
                        </ModelDot> :
                        <TypeIcon droppable={droppable} fileType={data?.fileType}/>}
                </div>
                <div className={"labelGridItem"} {...(props.node.droppable && {onClick: handleToggle})}>
                    <Typography {...(props.node.parent !== 0 && {color: "primary", sx: {cursor: "pointer"}})}
                                variant="body2">{props.node.text}</Typography>
                </div>
                {(handleMoveModel || handleEditModel) && (props.node.parent !== 0 || props.node.parent === 0 && !props.node.hasOwnProperty("isDefault")) ?
                    <IconButton
                        onClick={(event) => {
                            event.stopPropagation();
                            setAnchorEl(null);
                            setAnchorEl(event.currentTarget);
                        }}
                        sx={{display: "block", ml: "auto"}}
                        size="small">
                        <Icon path="more-vert"/>
                    </IconButton> :
                    (!props.node.isDefault && handleDeleteModel) && <IconButton
                        disableRipple
                        sx={{mt: "-6px"}}
                        className="btn-del"
                        onClick={(event) => {
                            event.stopPropagation();
                            setAnchorEl(null);
                            handleDeleteModel(props);
                        }}>
                        <IconUrl color="red" width={12} height={12} path="icdelete"/>
                    </IconButton>}


                <StyledMenu
                    {...{open, anchorEl}}
                    id="basic-menu"
                    elevation={0}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: (theme) => `drop-shadow(${theme.customShadows.popover})`,
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 8,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'text.primary',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }
                    }}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}>
                    {((props.node.parent !== 0 || props.node.parent === 0 && !props.node.hasOwnProperty("isDefault")) && handleMoveModel) &&
                        <MenuItem
                            onClick={(event) => {
                                event.stopPropagation();
                                setAnchorEl(null);
                                handleMoveModel(props);
                            }}>
                            <DriveFileMoveOutlinedIcon sx={{width: 16, height: 16, mr: 1.2}}/>
                            {t("move")}
                        </MenuItem>}
                    {((props.node.parent !== 0 || props.node.parent === 0 && !props.node.hasOwnProperty("isDefault")) && handleEditModel) &&
                        <MenuItem
                            onClick={(event) => {
                                event.stopPropagation();
                                setAnchorEl(null);
                                handleEditModel(props);
                            }}>
                            <IconUrl width={12} height={12} path="ic-edit"/>
                            {t("edit")}
                        </MenuItem>}
                    {(!props.node.isDefault && handleDeleteModel) && <MenuItem
                        onClick={(event) => {
                            event.stopPropagation();
                            setAnchorEl(null);
                            handleDeleteModel(props);
                        }}>
                        <IconUrl color="red" width={12} height={12} path="icdelete"/>
                        {t("delete")}
                    </MenuItem>}
                </StyledMenu>
            </CustomNodeStyled>
        </>
    );
};

export default CustomNode;
