import {FormControlLabel, Checkbox, IconButton, Collapse, List, Box} from '@mui/material';
import IconUrl from '@themes/urlIcon';
import React from 'react'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import {capitalizeFirst} from "@lib/hooks";

function TreeViewCheckbox({...props}) {
    const {data, disabled, onNodeCheck} = props;

    const renderNode = (node: any) => {
        const hasChildren = node.children && node.children.length > 0;

        const handleNodeCheck = () => {
            onNodeCheck(node.uuid, !node.checked);
        }

        return (
            <React.Fragment key={node.uuid}>
                <Box>
                    <FormControlLabel
                        {
                            ...(hasChildren && {
                                className: hasChildren ? "bold-label" : "simple-label",
                            })
                        }

                        control={
                            <Checkbox
                                {...{disabled}}
                                onChange={handleNodeCheck}
                                checked={hasChildren ? node.children.every((child: any) => child.checked) : node.checked}
                                {...(hasChildren && {
                                    icon: node.children.some((child: any) => child.checked) ?
                                        <IndeterminateCheckBoxIcon color="primary"/> : node.checked ?
                                            <IconUrl path="ic_check"/> : <IconUrl path="ic_uncheck"/>,
                                })}
                            />
                        }
                        label={capitalizeFirst(node.name)}
                    />

                    <IconButton
                        sx={{
                            display: hasChildren ? "block" : "none",
                            ".react-svg": {
                                transform: node.checked ? "scale(-1)" : "none",
                            },
                        }}
                        disableRipple
                        className="collapse-icon">
                        <IconUrl path="setting/ic-down-arrow" width={12} height={12}/>
                    </IconButton>
                </Box>
                {hasChildren &&
                    <Collapse in={node.children.some((child: any) => child.checked)} className="inner-collapse">
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

export default TreeViewCheckbox
