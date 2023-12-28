import {Box, Card, Collapse, IconButton, Stack, TextField, Typography, useTheme} from "@mui/material";
import {ExpandMore} from "@features/buttons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Icon from "@themes/urlIcon";
import React from "react";

function NoteCardCollapse({...props}) {
    const {item, t, onExpandHandler, onDeleteItem, onNoteChange} = props;
    const theme = useTheme();

    return (
        <Card>
            <Stack p={2} pt={1} pb={1} direction='row' alignItems="center"
                   justifyContent='space-between'>
                <Typography>{item.name}</Typography>
                <ExpandMore
                    expand={item.expanded as boolean}
                    onClick={onExpandHandler}
                    aria-expanded={item.expanded}
                    aria-label="show more">
                    <ExpandMoreIcon/>
                </ExpandMore>
                <IconButton size="small" onClick={onDeleteItem}>
                    <Icon color={theme.palette.error.main} path="ic-trash"/>
                </IconButton>
            </Stack>
            <Collapse in={item.expanded} timeout="auto" unmountOnExit>
                <Box p={1} m={1}>
                    <TextField
                        fullWidth
                        placeholder={t("note")}
                        multiline={true}
                        style={{backgroundColor: "white", borderRadius: 5}}
                        inputProps={
                            {
                                style: {
                                    padding: 3
                                },
                            }
                        }
                        rows={5}
                        value={item.note}
                        onChange={onNoteChange}
                    />
                </Box>
            </Collapse>
        </Card>
    )
}

export default NoteCardCollapse
