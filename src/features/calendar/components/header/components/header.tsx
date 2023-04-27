import {Box, Typography} from "@mui/material";
import moment from "moment-timezone";

function Header({...props}) {
    const {isGridWeek, event, isMobile} = props;
    const date = moment(event.date.toLocaleDateString("fr"), "DD/MM/YYYY");

    return (
        <div className="header-day-main">
            <Box
                className="header-day-main-box"
                sx={{
                    display: event.view.type === "timeGridDay" ? isMobile ? "grid!important" as any : "flex" : "inline-flex",
                    justifyContent: event.view.type === "timeGridDay" ? "flex-start" : "space-between",
                    px: event.view.type === "listWeek" ? 0 : 1,
                    width: event.view.type === "timeGridDay" ? 200 : "auto"
                }}
            >
                {!isMobile ? <>
                        {(isGridWeek) &&
                            <Typography variant="subtitle1" color="text.primary" fontSize={18} mr={2}>
                                {date.format("DD")}
                            </Typography>}

                        <Typography variant="subtitle1" color="text.primary" fontSize={14}>
                            <div>
                                {date.format("dddd").charAt(0).toUpperCase()}{date.format("dddd").slice(1)}
                            </div>
                        </Typography>
                    </>
                    :
                    <>
                        <Typography variant="subtitle1" color="text.primary" fontSize={14}>
                            <div>
                                {event.view.type === "timeGridDay" ?
                                    date.format("dddd") :
                                    date.format("dd").toUpperCase()[0]
                                }
                            </div>
                        </Typography>
                        {(isGridWeek) &&
                            <Typography variant="subtitle1" color="text.primary" fontSize={18} mr={2}>
                                {date.format("DD")}
                            </Typography>}
                    </>
                }

            </Box>
        </div>
    )
}

export default Header;
