import React from "react";
import { Button, Stack, Typography, List, ListItem, ListItemIcon, IconButton } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import DrugListCardStyled from "./overrides/drugListCardStyle";
import Icon from '@themes/urlIcon'
function DrugListCard({ ...props }) {
  const { data } = props;
  return (
    <DrugListCardStyled>
      <Stack direction='row' alignItems="center">
        <Stack spacing={1}>
          <Typography variant="body2" textTransform="uppercase">{data.name}</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CircleIcon />
              </ListItemIcon>
              {data.dosage}</ListItem>
            <ListItem>
              <ListItemIcon>
                <CircleIcon />
              </ListItemIcon>
              {data.duration}</ListItem>
          </List>
        </Stack>
        <Stack direction='row' spacing={1} alignItems="center" ml="auto">
          <IconButton size="small">
            <Icon path="ic-duotone" />
          </IconButton>
          <IconButton size="small">
            <Icon path="setting/icdelete" />
          </IconButton>
        </Stack>
      </Stack>
    </DrugListCardStyled>
  );
}
export default DrugListCard;
