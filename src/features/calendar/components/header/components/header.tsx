import {Box, IconButton, Typography} from "@mui/material";
import moment from "moment-timezone";
import {Label} from "@features/label";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function Header({...props}) {
    const {isGridWeek, view, sortedData, event} = props;

    return (
        <div className="header-day-main">
            <Box
                className="header-day-main-box"
                sx={{
                    display: view === "listWeek" ? "grid" : "flex",
                    justifyContent: view === "listWeek" ? "start" : "space-between",
                    px: view === "listWeek" ? 0 : 1,
                    width: view === "timeGridDay" ? 200 : "auto",
                }}
            >
                <Typography variant="subtitle1" color="text.primary" fontSize={18}>
                    {(isGridWeek || view === "timeGridDay") &&
                        moment(event.date).format("DD")}
                </Typography>

                <Typography variant="subtitle1" color="text.primary" fontSize={14}>
                    <div>
                        {moment(event.date).format(
                            isGridWeek || view === "timeGridDay" ? "MMM/dddd" : "dddd"
                        ).replace('.','')}
                    </div>
                </Typography>
                {view !== "listWeek" && (
                    <IconButton
                        sx={{width: {xl: 24, lg: 20}, height: {xl: 24, lg: 20}}}
                    >
                        <MoreVertIcon sx={{fontSize: {xl: 16, lg: 18}}}/>
                    </IconButton>
                )}
            </Box>
        </div>
    )
}

export default Header;
