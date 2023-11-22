import { Label } from "@features/label";
import {Box, Stack, Typography,MenuItem, IconButton} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
import {useTranslation} from "next-i18next";
import { ActionMenu } from "@features/menu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
function Header({...props}) {
    const {isGridWeek, event, isMobile,contextMenuHeader, setContextMenuHeader} = props;
    console.log(props)
    const date = moment(event.date.toLocaleDateString("fr"), "DD/MM/YYYY");
     
const handleCloseMenu = () => {
        setContextMenuHeader(null);
    }   
const OnMenuActions = (action: string) => {
        handleCloseMenu();
        switch (action) {
            case "onPatientView":
            
                break;
        }
    }
    return (
        <div className="header-day-main">
            <Box
                className="header-day-main-box"
                sx={{
                    display: event.view.type === "timeGridDay" ? isMobile ? "grid!important" as any : "flex" : "inline-flex",
                    justifyContent: event.view.type === "timeGridDay" ? "flex-start" : "space-between",
                    px: event.view.type === "listWeek" ? 0 : 1,
                    width: event.view.type === "timeGridDay" ? 200 : isGridWeek ? "100%":"auto"
                }}
            >
                {!isMobile ? <>
                        {(isGridWeek) ?
                        <Stack direction='row' justifyContent='space-between' width={1}>
                            <Stack alignItems='flex-start'>
                            <Typography variant="subtitle1" color="text.primary" fontSize={18} mr={2}>
                                {date.format("DD")}
                            </Typography>
                            <Typography variant="subtitle1" color="text.primary" fontSize={14}>
                            <div>
                                {date.format("dddd").charAt(0).toUpperCase()}{date.format("dddd").slice(1)}
                            </div>
                        
                        </Typography>
                            </Stack>
                            <Stack spacing={1} alignItems='flex-end'>
                                <IconButton size="small" sx={{width:24,height:24}} onClick={(e) =>{  
                                    e.stopPropagation();
                                setContextMenuHeader(
                    contextMenuHeader === null
                        ? {
                            mouseX: e.clientX + 2,
                            mouseY: e.clientY - 6,
                        } : null
                )
                    }
                                }>
                                    <MoreVertIcon/>
                                </IconButton>
                                <Label variant="filled" sx={{justifyContent:'flex-start',bgcolor:"#43E31D"}}>
                                  <IconUrl path="ic-agenda-new"/> 
                                  <Typography ml={.5} fontWeight={700} variant="caption" color="common.white" fontSize={10}>
                                    2
                                    </Typography> 
                                </Label>
                            </Stack>
                            </Stack>
                            :
                            <Typography variant="subtitle1" color="text.primary" fontSize={14}>
                            <div>
                                {date.format("dddd").charAt(0).toUpperCase()}{date.format("dddd").slice(1)}
                            </div>
                        
                        </Typography>
                            
                        }

                        
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
             <ActionMenu {...{contextMenu:contextMenuHeader, handleClose: handleCloseMenu}}>
               
                        <MenuItem>
                           fasfd
                        </MenuItem>
                    
            </ActionMenu>  
        </div>
    )
}

export default Header;
