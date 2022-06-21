import { ReactElement } from "react";

// material
import {
    Grid,
    Typography,
    IconButton,
    Button,
    Box,
    Card,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Icon from "@themes/urlIcon";
import DetailCardStyled from "./overrides/detailCardStyle";
import { rows } from "./config";
console.log(rows);
export default function DetailsCard() {
    const theme = useTheme();
    const handlePushRoute = (route) => (e) => {
        if (e.target.tagName === "svg" || e.target.tagName === "path") {
            return;
        } else {
            router.push({
                pathname: `${router.asPath}/${route.name.split(" ").join("-")}`,
            });
        }
    };
    return (
        <>
            {rows.map((item, i) => (
                <DetailCardStyled
                    key={Math.random()}
                    sx={{
                        borderLeft: `6px solid ${item.status === "completed"
                            ? theme.palette.success.main
                            : item.status === "canceled"
                                ? theme.palette.error.main
                                : item.status === "success"
                                    ? theme.palette.success.main
                                    : theme.palette.primary.main
                            }`,
                    }}
                >
                    <Grid container>
                        <Grid item md={10} sm={10} xs={11}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" >
                                <Typography
                                    display="inline"
                                    variant="body2"
                                    color="text.primary"
                                    align="center"
                                    fontSize={12}
                                >{item.id}
                                </Typography>
                                <Box sx={{
                                    display: "flex", alignItems: "center",
                                    color: theme.palette.success.main,
                                    svg: {
                                        height: 14,
                                        width: 14,
                                        mr: 0.5,
                                        path: {
                                            fill: theme.palette.success.main,
                                        }
                                    }
                                }}>
                                    <Icon path="ic-time" />
                                    <span>
                                        {item.arrivaltime}
                                    </span>
                                </Box>
                                <Button

                                    size="small"
                                    color="primary"
                                    sx={{
                                        '& .react-svg svg': {
                                            width: 15,
                                        }
                                    }}
                                    startIcon={
                                        item.type === "cabinet" ? <Icon path="ic-cabinet" /> :
                                            item.type === "teleconsultation" ? <Icon path="ic-video-red" />
                                                :
                                                null

                                    }
                                >
                                    {item.reson}
                                </Button>
                            </Box>
                            <Typography
                                sx={{
                                    mt: 1
                                }}
                                lineHeight={1}
                                variant="body1"
                            >
                                {item.patient}
                            </Typography>
                        </Grid>
                        <Grid item md={2} sm={2} xs={1}>
                            <Box display="flex" alignItems="center" height="100%">
                                <IconButton sx={{ display: "block", ml: "auto" }} size="small">
                                    <Icon path="more-vert" />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </DetailCardStyled>
            ))
            }
        </>
    );
}
