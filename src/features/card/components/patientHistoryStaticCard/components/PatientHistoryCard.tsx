import React from "react";
import {Box, Card, IconButton,} from "@mui/material";
import PatientHistoryCardStyled from "./overrides/PatientHistoryCardStyle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function PatientHistoryCard({...props}) {
    const {open, handleOpen, children} = props;

    return (
        <PatientHistoryCardStyled direction="row" className={"patient-history-card"}>
            <Box className="time-line">
                <IconButton className="expand-btn" onClick={handleOpen} >
                    {open ? <RemoveIcon color="primary"/> : <AddIcon color="primary"/>}
                </IconButton>
            </Box>
            <Card>

                {children}
            </Card>
        </PatientHistoryCardStyled>
    );
}

export default PatientHistoryCard;
