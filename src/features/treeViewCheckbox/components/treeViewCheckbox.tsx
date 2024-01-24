import {FormControlLabel, Checkbox, IconButton, Collapse, List, Stack} from '@mui/material';
import IconUrl from '@themes/urlIcon';
import React from 'react'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';


function TreeViewCheckbox({...props}) {
    const {data, disabled, onNodeCheck, onCollapseIn} = props;

    const renderNode = (node: any) => {
        const hasChildren = node.children && node.children.length > 0;

        const handleNodeCheck = () => {
            onNodeCheck(node.uuid, !node.checked, hasChildren, node?.slug?.split("__")[1]);
        }

        const handleCollapseIn = () => {
            onCollapseIn(node.uuid, !node.collapseIn);
        }

        return (
            <React.Fragment key={node.uuid}>
                <Stack direction={"row"} sx={{cursor: "pointer"}} alignItems={"center"} onClick={handleCollapseIn}>
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
                                checked={hasChildren ? node.children.every((child: any) => child.checked) : node.checked}
                                {...(hasChildren && {
                                    sx: {pointerEvents: "auto"},
                                    icon: node.children.some((child: any) => child.checked) ?
                                        <IndeterminateCheckBoxIcon color="primary"/> : node.checked ?
                                            <IconUrl path="ic_check"/> : <IconUrl path="ic_uncheck"/>,
                                })}
                            />
                        }
                        label={node.name}
                    />

                    <IconButton
                        sx={{
                            display: hasChildren ? "block" : "none",
                            ".react-svg": {
                                transform: node.collapseIn ? "scale(-1)" : "none",
                            },
                        }}
                        disableRipple
                        className="collapse-icon">
                        <IconUrl path="setting/ic-down-arrow" width={12} height={12}/>
                    </IconButton>
                </Stack>
                {hasChildren &&
                    <Collapse in={node.collapseIn} className="inner-collapse">
                        <List className="inside-list">
                            {node.children.map((childNode: any) => renderNode(childNode))}
                        </List>
                    </Collapse>
                }
            </React.Fragment>
        )
    }

    return data.map((node: any) => renderNode(node))
}

export default TreeViewCheckbox;
