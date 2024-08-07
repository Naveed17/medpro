import {FormControlLabel, Checkbox, IconButton, Collapse, List, Stack} from '@mui/material';
import IconUrl from '@themes/urlIcon';
import React from 'react'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import {useTranslation} from "next-i18next";
import {ConditionalWrapper} from "@lib/hooks";

function TreeViewCheckbox({...props}) {
    const {data, disabled, onNodeCheck, onCollapseIn} = props;
    const {t} = useTranslation("settings", {keyPrefix: "users.config"});

    const renderNode = (node: any) => {
        const hasChildren = node.children && node.children.length > 0;
        const everyChildrenChecked = node.children && node.children.every((child: any) => child.checked);
        const someChildrenChecked = node.children && node.children.some((child: any) => child.checked);

        const handleNodeCheck = () => {
            onNodeCheck(node.uuid, !node.checked, hasChildren, node?.slug?.split("__")[1]);
        }

        const handleCollapseIn = () => {
            onCollapseIn(node.uuid, !node.collapseIn);
        }

        return (
            <React.Fragment key={node.uuid}>

                <Stack direction={"row"}
                       sx={{
                           cursor: "pointer",
                           ...(!node.collapseIn && {mb: 1})
                       }}
                       alignItems={"center"}
                       {...(!disabled && {onClick: (data.length === 1 && hasChildren ? handleNodeCheck : handleCollapseIn)})}>
                    <FormControlLabel
                        {
                            ...(hasChildren && {
                                sx: {pointerEvents: "none"},
                                className: hasChildren ? "bold-label" : "simple-label",
                            })
                        }
                        control={
                            <Checkbox
                                {...{disabled}}
                                onChange={event => {
                                    event.stopPropagation();
                                    handleNodeCheck()
                                }}
                                checked={hasChildren ? everyChildrenChecked : node.checked}
                                {...(hasChildren && {
                                    sx: {pointerEvents: "auto"},
                                    icon: someChildrenChecked ?
                                        <IndeterminateCheckBoxIcon color="primary"/> : node.checked ?
                                            <IconUrl path="ic_check"/> : <IconUrl path="ic_uncheck"/>,
                                })}
                            />
                        }
                        label={hasChildren ? t(data.length === 1 ? "select-all" : `features.${node.name}`) : node.name}
                    />

                    {data.length > 1 && <IconButton
                        sx={{
                            display: hasChildren ? "block" : "none",
                            ".react-svg": {
                                transform: node.collapseIn ? "scale(-1)" : "none",
                            },
                        }}
                        disableRipple
                        className="collapse-icon">
                        <IconUrl path="setting/ic-down-arrow" width={12} height={12}/>
                    </IconButton>}
                </Stack>

                {hasChildren &&
                    <ConditionalWrapper
                        condition={data.length > 1}
                        wrapper={(children: any) =>
                            <Collapse in={node.collapseIn} className="inner-collapse">
                                {children}
                            </Collapse>}>
                        <List className="inside-list">
                            {node.children.map((childNode: any) => renderNode(childNode))}
                        </List>
                    </ConditionalWrapper>}
            </React.Fragment>
        )
    }

    return data.map((node: any) => renderNode(node))
}

export default TreeViewCheckbox;
