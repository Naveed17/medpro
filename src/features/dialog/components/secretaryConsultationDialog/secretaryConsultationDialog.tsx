import React from "react";
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
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@app/constants";

const limit = 255;

function SecretaryConsultationDialog({...props}) {
    const {
        data: {t, changes, total, instruction, setInstruction, meeting, setMeeting, checkedNext, setCheckedNext},
    } = props;

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInstruction(event.target.value.slice(0, limit));
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
                            value={instruction}
                            onChange={handleChange}
                            placeholder={t("type_instruction_for_the_secretary")}
                            rows={4}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment defaultValue={instruction} position="end">
                                        {instruction.length} / {limit}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Stack direction={"row"} alignItems={"center"}>
                            <Typography mr={1}>Montant à payer : </Typography>

                            <Label
                                variant="filled"
                                color="success"
                                sx={{color: (theme) => theme.palette.text.primary}}>
                                <Typography
                                    color="text.primary"
                                    variant="subtitle1"
                                    mr={0.3}
                                    fontWeight={600}>
                                    {total}
                                </Typography>
                                {devise}
                            </Label>

                        </Stack>


                        <Button
                            className="counter-btn"
                            disableRipple
                            color="info"
                            variant="outlined"
                            onClick={() => setCheckedNext(!checkedNext)}>
                            <Checkbox checked={checkedNext}/>
                            {t("plan_a_meeting")}
                            {checkedNext && (
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
                        <Typography mt={{xs:3,md:0}} variant="subtitle1">
                            {t("recap")}
                        </Typography>

                        <Box display='grid' sx={{
                            gridGap: 16,
                            gridTemplateColumns: {
                                xs: "repeat(2,minmax(0,1fr))",
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
