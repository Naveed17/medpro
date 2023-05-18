import { ListItem,FormControlLabel, Checkbox, IconButton, Collapse, List } from '@mui/material';
import IconUrl from '@themes/urlIcon';
import React from 'react'

function TreeViewCheckbox({...props}) {
const {data, onNodeCheck,t} = props;
   const renderNode = (node:any) => {
    const hasChildren = node.children && node.children.length > 0;
    const handleNodeCheck = () => {
      onNodeCheck(node.uuid, !node.value);
    };
  return (
    <React.Fragment key={node.id}>
    <ListItem className="main-list" >
  <FormControlLabel
      {
          ...(hasChildren && {
              className: hasChildren ? "bold-label" : "simple-label",
          })
      }

      control={
          <Checkbox
              onChange={handleNodeCheck}
              checked={ hasChildren ? node.children.every((child:any) => child.value): node.value}
          />
      }
      label={t("permissions." + node.slug, {ns: 'common'})}
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
      <Collapse in={node.value} className="inner-collapse">
        <List className="inside-list">
            {node.children.map((childNode:any) => renderNode(childNode))} 
        </List>
          </Collapse>
   }
      </React.Fragment>                                                                                    
  )
}
return (
  <List sx={{p: 0}}>
    {data.map((node:any) => renderNode(node))}
  </List>
)
}

export default TreeViewCheckbox