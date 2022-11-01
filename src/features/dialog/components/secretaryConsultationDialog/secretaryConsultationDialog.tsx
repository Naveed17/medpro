import React, {useState} from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Grid,
    IconButton,
    InputAdornment,
    InputBase,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import RootStyled from "./overrides/rootSyled";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from '@mui/icons-material/Check';
import IconUrl from "@themes/urlIcon";
import {Label} from "@features/label";

const limit = 255;

function SecretaryConsultationDialog({...props}) {
    const {
        data: {t, changes, total},
    } = props;
    const [value, setvalue] = useState("");
    const [checked, setChecked] = useState(false);
    const [meeting, setMeeting] = useState<number>(15);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setvalue(event.target.value.slice(0, limit));
    };
    return (
        <RootStyled>
            <Grid container>
                <Grid item md={6} sm={12} xs={12}>
                    <Stack
                        alignItems="center"
                        spacing={2}
                        maxWidth={{xs: "100%", md: "80%"}}
                        mx="auto"
                        width={1}>
                        <Typography variant="subtitle1">
                            {t("finish_the_consutation")}
                        </Typography>
                        <Typography>{t("type_the_instruction_for_the_secretary")}</Typography>
                        <TextField
                            fullWidth
                            multiline
                            value={value}
                            onChange={handleChange}
                            placeholder={t("type_instruction_for_the_secretary")}
                            rows={4}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {value.length} / {limit}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Stack direction={"row"} alignItems={"center"}>
                            <Typography mr={1}>Montant a payé : </Typography>

                            <Label
                                variant="filled"
                                color="success"
                                sx={{ color: (theme) => theme.palette.text.primary }}>
                                <Typography
                                    color="text.primary"
                                    variant="subtitle1"
                                    mr={0.3}
                                    fontWeight={600}>
                                    {total}
                                </Typography>
                                {process.env.NEXT_PUBLIC_DEVISE}
                            </Label>

                        </Stack>


                        <Button
                            className="counter-btn"
                            disableRipple
                            color="info"
                            variant="outlined"
                            onClick={() => setChecked(!checked)}>
                            <Checkbox checked={checked}/>
                            {t("plan_a_meeting")}
                            {checked && (
                                <>
                                    <InputBase
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={meeting}
                                        startAdornment={
                                            <IconButton
                                                size="small"
                                                disabled={meeting <= 1}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMeeting(meeting - 1);
                                                }}>
                                                <RemoveIcon/>
                                            </IconButton>
                                        }
                                        endAdornment={
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMeeting(meeting + 1);
                                                }}>
                                                <AddIcon/>
                                            </IconButton>
                                        }
                                    />

                                    {t("day")}
                                </>
                            )}
                        </Button>
                    </Stack>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                    <Stack
                        alignItems="center"
                        spacing={2}
                        maxWidth={{xs: "100%", md: "80%"}}
                        mx="auto"
                        width={1}>
                        <Typography variant="subtitle1">
                            {t("recap")}
                        </Typography>

                        <Box display='grid' sx={{
                            gridGap: 16,
                            gridTemplateColumns: {
                                xs: "repeat(1,minmax(0,1fr))",
                                md: "repeat(3,minmax(0,1fr))",
                                lg: "repeat(3,minmax(0,1fr))",
                            }
                        }}>

                            {changes.map((item: { checked: boolean; icon: string; name: string; }, idx: number) => (
                                <Badge key={'feat' + idx} color="success" invisible={!item.checked}
                                       badgeContent={<CheckIcon sx={{width: 8}}/>}>
                                    <Card style={{width: '100%'}}>
                                        <CardContent>
                                            <Stack spacing={2} className="document-detail" alignItems="center">
                                                <IconUrl path={item.icon}/>
                                                <Typography variant='subtitle2' textAlign={"center"}
                                                            whiteSpace={"nowrap"} fontSize={11}>
                                                    {t("consultationIP." + item.name)}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Badge>
                            ))}

                        </Box>
                    </Stack>
                </Grid>

            </Grid>

        </RootStyled>
    );
}

export default SecretaryConsultationDialog;
