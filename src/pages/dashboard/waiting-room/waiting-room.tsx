import React, { useState } from "react";
import { Grid, Paper, Divider, IconButton } from "@mui/material";
import Label from "@components/label";
import { Box } from "@mui/system";
import DetailsCard from "@components/_dashboard/room/detailsCard";
import { useTheme } from "@mui/material/styles";
import Icon from "@utils/icon";
export default function WaitingRoom() {
    const [state, setstate] = useState(true)
    const [observation, setobservation] = useState(true)
    const [observe, setobserve] = useState(true)
    const handleChange = () => {
        setobservation(!observation)
    }
    const changeEvent = () => {
        setobserve(!observe)
    }
    const onClick = () => {

        setstate(!state)

    }
    const theme = useTheme();
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item lg={state === false ? 1 : observe === true ? 4 : 7} md={4} sm={12} xs={12}>
                    <Paper elevation={0} sx={{ borderTop: `4px solid ${theme.palette.success.main}`, height: "100%" }} >
                        <Box sx={state || { transform: "rotate(90deg)", width: "140px", mt: "45px", ml: "-25px" }}>
                            <Box p={1} sx={{ display: "flex", alignItems: "center", }} >
                                <IconButton size="small" onClick={onClick} >
                                    <Icon path="ic-flesh-droite" />
                                </IconButton>
                                <Label variant="filled" color="success" sx={{
                                    color: "#000", svg: {
                                        mr: 1,
                                        width: 14,
                                        height: 14
                                    }
                                }} >
                                    <Icon path="ic-doc" />
                                    Salle 1
                                </Label>
                            </Box>
                        </Box>
                        {
                            state === true ? <Divider /> : ''
                        }
                        <Box p={1} >{
                            state === true ? <DetailsCard /> : ''
                        }
                        </Box>
                    </Paper>
                </Grid>
                <Grid item lg={observation === false ? 1 : state === true ? 4 : 7} md={4} sm={12} xs={12}>
                    <Paper elevation={0} sx={{ borderTop: `4px solid ${theme.palette.success.main}`, height: "100%" }} >
                        <Box sx={observation || { transform: "rotate(90deg)", width: "140px", mt: "45px", ml: "-25px" }}>
                            <Box p={1} sx={{ display: "flex", alignItems: "center" }} >
                                <IconButton size="small" onClick={handleChange}>
                                    <Icon path="ic-flesh-droite" />
                                </IconButton>

                                <Label variant="filled" color="success" sx={{
                                    color: "#000", svg: {
                                        mr: 1,
                                        width: 14,
                                        height: 14
                                    }
                                }} >
                                    <Icon path="ic-doc" />
                                    Salle 1
                                </Label>
                            </Box>
                        </Box>
                        {observation ? <Divider /> : ""}

                        <Box p={1}>{observation ? <DetailsCard />
                            : ""}
                            </Box>
                    </Paper>
                </Grid>
                <Grid item lg={observe === false ? 1 : observation === true ? 4 : 7} md={4} sm={12} xs={12}>
                    <Paper elevation={0} sx={{ borderTop: `4px solid ${theme.palette.success.main}`, height: "100%" }} >
                        <Box sx={observe || { transform: "rotate(90deg)", width: "140px", mt: "45px", ml: "-25px" }}>
                            <Box p={1} sx={{ display: "flex", alignItems: "center" }} >
                                <IconButton size="small" onClick={changeEvent}>
                                    <Icon path="ic-flesh-droite" />
                                </IconButton>

                                <Label variant="filled" color="success" sx={{
                                    color: "#000", svg: {
                                        mr: 1,
                                        width: 14,
                                        height: 14
                                    }
                                }} >
                                    <Icon path="ic-doc" />
                                    Salle 1
                                </Label>
                            </Box>
                        </Box>
                        {observe ? <Divider /> : ""}

                       <Box p={1}> {observe ? <DetailsCard />
                            : ""}
                            </Box>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
