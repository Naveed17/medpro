import {Box, Typography} from "@mui/material";
import moment from "moment-timezone";

function Header({...props}) {
    const {isGridWeek, event} = props;

    return (
        <div className="header-day-main">
            <Box
                className="header-day-main-box"
                sx={{
                    display: event.view.type === "timeGridDay" ? "flex" : "inline-flex",
                    justifyContent: event.view.type === "timeGridDay" ? "flex-start" : "space-between",
                    px: event.view.type === "listWeek" ? 0 : 1,
                    width: event.view.type === "timeGridDay" ? 200 : "auto",
                }}
            >
                {(isGridWeek || event.view.type === "timeGridDay") &&
                    <Typography variant="subtitle1" color="text.primary" fontSize={18} mr={2}>
                        {moment(event.date).format("DD")}
                    </Typography>}

                <Typography variant="subtitle1" color="text.primary" fontSize={14}>
                    <div>
                        {moment(event.date).format(
                            isGridWeek || event.view.type === "timeGridDay" ? "MMM/dddd" : "dddd"
                        ).replace('.', '')}
                    </div>
                </Typography>
                {/*                {view !== "listWeek" && (
                    <IconButton
                        sx={{width: {xl: 24, lg: 20}, height: {xl: 24, lg: 20}}}
                    >
                        <MoreVertIcon sx={{fontSize: {xl: 16, lg: 18}}}/>
                    </IconButton>
                )}*/}
            </Box>
        </div>
    )
}

export default Header;
