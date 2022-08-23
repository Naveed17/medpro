import AddEventIcon from "@themes/overrides/icons/addEventIcon";
import CodeIcon from "@mui/icons-material/Code";
import React from "react";
import RootStyled from "./overrides/rootStyled";
function CalendarAddButton() {
    return (
        <RootStyled size="small">
            <AddEventIcon style={{fontSize: 20}}/>
            <CodeIcon
                fontSize="inherit"
                sx={{
                    transform: "rotate(90deg)",
                    color: (theme) => theme.palette.text.primary
                }}
            />
        </RootStyled>
    )
}

export default CalendarAddButton;
