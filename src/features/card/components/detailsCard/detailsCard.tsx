// material
import {
    Grid,
    Typography,
    IconButton,
    Button,
    Box,
    Stack,
    Link
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Label } from "@features/label";
import Icon from "@themes/urlIcon";
import DetailCardStyled from "./overrides/detailCardStyle";
import CircleIcon from '@mui/icons-material/Circle';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
export default function DetailsCard({ ...props }) {
    const { rows, consultation, waitingRoom, t } = props;
    const theme = useTheme();
    return (
        <>
            {rows?.map((item: any) => (
                <DetailCardStyled
                    key={Math.random()}
                    sx={{
                        borderLeft: `6px solid ${item.status === "completed"
                            ? theme.palette.success.main
                            : item?.status === "canceled"
                                ? theme.palette.error.main
                                : item.status === "success"
                                    ? theme.palette.success.main
                                    : theme.palette.primary.main
                            }`,
                    }}
                >
                    {waitingRoom &&
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
                                    <Stack direction="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <CircleIcon fontSize="small" sx={{
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: '50%',
                                            p: 0.2,
                                        }}
                                            color='primary'
                                        />
                                        <Typography color="primary">
                                            {item.reson}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Stack direction='row' alignItems="center">
                                    <Typography
                                        color="primary"
                                        sx={{
                                            mt: 1
                                        }}
                                        lineHeight={1}
                                        variant="body1"
                                    >
                                        {item.patient}
                                    </Typography>
                                    <Stack spacing={2} direction="row" alignItems="center" ml="auto" mt={2}>
                                        <Label
                                            variant="filled"
                                            color={
                                                item?.status === "completed"
                                                    ? "success"
                                                    : item?.status === "canceled"
                                                        ? "error"
                                                        : "primary"
                                            }
                                        >
                                            {t(`table.${item.status}`)}
                                        </Label>
                                        <PlayCircleRoundedIcon color="success" />
                                        <Typography variant="body2">
                                            120 TND
                                        </Typography>
                                    </Stack>

                                </Stack>

                            </Grid>
                            <Grid item md={2} sm={2} xs={1}>
                                <Box display="flex" alignItems="center" height="100%">
                                    <IconButton sx={{ display: "block", ml: "auto" }} size="small">
                                        <Icon path="more-vert" />
                                    </IconButton>
                                </Box>
                            </Grid>
                        </Grid>
                    }
                    {consultation && (<>
                        <Stack className="consultation-details" direction="row" alignItems='center'>
                            <Stack spacing={1} justifyContent="flex-start" alignItems='flex-start'>
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
                                <Stack direction='row' spacing={2}>
                                    <Stack direction="row" alignItems='center' className="date-container">
                                        <Icon path="ic-agenda" />
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            12/12/2019
                                        </Typography>

                                    </Stack>
                                    <Stack direction="row" alignItems='center' className="time-container">
                                        <Icon path="ic-time" />
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"

                                        >
                                            20:00
                                        </Typography>

                                    </Stack>
                                    <Stack direction="row" alignItems={'center'} className="document-container" ml="auto">
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >

                                            Document
                                        </Typography>
                                        <Link href="/">
                                            <Icon path="iconfinder_link-2_2561254 1" />
                                        </Link>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <IconButton sx={{ display: "block", ml: "auto" }} size="small">
                                <Icon path="more-vert" />
                            </IconButton>
                        </Stack>
                    </>)}
                </DetailCardStyled>
            ))
            }
        </>
    );
}
