import {ListItem, FormControlLabel, Checkbox, IconButton, Collapse, List} from '@mui/material';
import IconUrl from '@themes/urlIcon';
import React from 'react'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import {capitalizeFirst} from "@lib/hooks";

function TreeViewCheckbox({...props}) {
    const {data, onNodeCheck} = props;

    const renderNode = (node: any) => {
        const hasChildren = node.children && node.children.length > 0;

        const handleNodeCheck = () => {
            onNodeCheck(node.uuid, !node.value);
        }

        return (
            <React.Fragment key={node.uuid}>
                <ListItem className="main-list">
                    <FormControlLabel
                        {
                            ...(hasChildren && {
                                className: hasChildren ? "bold-label" : "simple-label",
                            })
                        }

                        control={
                            <Checkbox
                                onChange={handleNodeCheck}
                                checked={hasChildren ? node.children.every((child: any) => child.value) : node.value}
                                {...(hasChildren && {
                                    icon: node.children.some((child: any) => child.value) ?
                                        <IndeterminateCheckBoxIcon color="primary"/> : node.value ?
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
                                transform: node.value ? "scale(-1)" : "none",
                            },
                        }}
                        disableRipple
                        className="collapse-icon">
                        <IconUrl path="setting/ic-down-arrow" width={12} height={12}/>
                    </IconButton>
                </ListItem>
                {hasChildren &&
                    <Collapse in={node.children.some((child: any) => child.value)} className="inner-collapse">
                        <List className="inside-list">
                            {node.children.map((childNode: any) => renderNode(childNode))}
                        </List>
                    </Collapse>
                }
            </React.Fragment>

        )
    }

    return (
        <List sx={{p: 0}}>
            {data.map((node: any) => renderNode(node))}
        </List>
    )
}

export default TreeViewCheckbox
