import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import AddIcon from "@mui/icons-material/Add";
import {Box, width} from "@mui/system";
import {Avatar, Chip, Paper, Skeleton, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {MultiSelect} from "@features/multiSelect";
import BasicAlert from "@themes/overrides/Alert";
import useRequest from "@app/axios/axiosServiceApi";
import {useRouter} from "next/router";
import {RootStyled} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";

function Actes() {

    const {data: session} = useSession();


    const [mainActes, setMainActes] = useState<ActModel[]>([]);
    const [secondaryActes, setSecondaryActes] = useState<ActModel[]>([]);
    const [selected, setSelected] = useState<ActModel>();
    const [suggestion, setSuggestion] = useState<ActModel[]>([]);
    const [alert, setAlert] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isProfil, setIsProfil] = useState<boolean>(false);
    const [secAlert, setSecAlert] = useState<boolean>(false);
    const [acts, setActs] = useState<ActModel[]>([]);
    const [specialities, setSpecialities] = useState<any>({});
    const router = useRouter();
    const initalData = Array.from(new Array(8));

    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const {data: httpProfessionalsResponse, error: errorProfil} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const medical_professional = httpProfessionalsResponse ? (httpProfessionalsResponse as HttpResponse).data : undefined;


    const {data, error} = useRequest(isProfil ? {
        method: "GET",
        url: "/api/public/acts/" + router.locale,
        params: specialities,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);


    useEffect(() => {
        if (data !== undefined) {
            setActs(((data as any).data) as ActModel[])
            setSuggestion(((data as any).data) as ActModel[]);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {

        if (httpProfessionalsResponse !== undefined) {

            const spe ={};
            setMainActes([]);
            setSecondaryActes([]);
            (httpProfessionalsResponse as any).data[0].medical_professional.specialities.map((speciality: any, index: number) => {
                Object.assign(spe, {['specialities['+index+']']: speciality.speciality.uuid});
            });

            setSpecialities(spe);
            setIsProfil(true);
            const infoData = (httpProfessionalsResponse as any).data[0];
            infoData.acts.map((act: MedicalProfessionalActModel) => {
                act.isTopAct ? setMainActes([...mainActes, act.act]) : setSecondaryActes([...secondaryActes, act.act]);
            })
        }
    }, [httpProfessionalsResponse])

    useEffect(() => {
        const selectedActes = [...mainActes, ...secondaryActes];

        setSuggestion(acts.filter((nb) => {
            return !selectedActes.some((item) => item.uuid === nb.uuid);
        }));
    }, [acts, mainActes, secondaryActes]);

    const onDrop = (id: string, ev: any) => {
        const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v.uuid !== (selected as ActModel).uuid);
        setSuggestion([...deleteSuggestion]);
        if (id === "main" && mainActes.length < 10) {
            setMainActes([...mainActes, (selected as ActModel)]);
        } else {
            const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v !== selected);
            setSuggestion([...deleteSuggestion]);
            setSecondaryActes([...secondaryActes, (selected as ActModel)]);
        }
    };

    const onDrag = (prop: any) => (ev: any) => {
        ev.dataTransfer.setData("Text", ev.target.id);
        ev.effectAllowed = "copy";
        setSelected({...prop});
    };

    const allowDrop = (ev: { preventDefault: () => void }) => {
        ev.preventDefault();
    };

    const onClickChip = (prop: any) => () => {
        const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v.uuid !== prop.uuid);
        setSuggestion([...deleteSuggestion]);
        if (mainActes.length < 10) {
            setMainActes([...mainActes, prop]);
        } else {
            setSecondaryActes([...secondaryActes, prop]);
        }
    };

    const onChangeState = (
        val: any[],
        items: any[],
        setItems: (arg0: any[]) => void
    ) => {
        setItems(val.slice(0, 10));
    };

    const {t, ready} = useTranslation("settings", {keyPrefix: "actes"});
    if (!ready) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('path')}</p>
                </RootStyled>
            </SubHeader>
            <Box bgcolor="#F0FAFF"
                 sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <Paper sx={{p: 2}}>
                    <Typography variant="body1" color="text.primary" mb={5}>
                        {t("selectActes")}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight={600}
                        mb={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            svg: {
                                ml: 1,
                                path: {
                                    fill: theme => theme.palette.warning.main,
                                },
                            },
                        }}
                    >
                        {t("main")}{" "}
                        {!alert && (
                            <IconUrl
                                onChange={() => {
                                    setAlert(true);
                                }}
                                path="danger"
                            />
                        )}
                        {alert && (
                            <BasicAlert
                                icon="danger"
                                sx={{
                                    width: "fit-content",
                                    padding: "0  15px 0 0",
                                    margin: "0 10px",
                                }}
                                data={"Actes alert message"}
                                onChange={() => {
                                    setAlert(false);
                                }}
                                color="warning">
                                info
                            </BasicAlert>
                        )}
                    </Typography>

                    <MultiSelect
                        id="main"
                        data={acts.filter((a) => !secondaryActes.some((m) => a.uuid === m.uuid))}
                        onDrop={onDrop}
                        all={[...mainActes, ...secondaryActes]}
                        onDragOver={allowDrop}
                        onChange={(event: React.ChangeEvent, value: any[]) => {
                            onChangeState(value, mainActes, setMainActes);
                        }}
                        label={'name'}
                        initData={mainActes}
                        limit={10}
                        helperText={t("max")}
                        placeholder={t("typing")}
                    />

                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight={600}
                        mb={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 6,
                            svg: {
                                ml: 1,
                                path: {
                                    fill: theme => theme.palette.warning.main,
                                },
                            },
                        }}
                    >
                        {t("secondary")}{" "}
                        {!secAlert && (
                            <IconUrl
                                onChange={() => {
                                    setSecAlert(true);
                                }}
                                path="danger"
                            />
                        )}{" "}
                        {secAlert && (
                            <BasicAlert
                                icon="danger"
                                sx={{
                                    width: "fit-content",
                                    padding: "0  15px 0 0",
                                    margin: "0 10px",
                                }}
                                data={"Actes alert message"}
                                onChange={() => {
                                    setSecAlert(false);
                                }}
                                color="warning"
                            >
                                info
                            </BasicAlert>
                        )}
                    </Typography>

                    <MultiSelect
                        id="second"
                        data={acts.filter((a) => !mainActes.some((m) => a.uuid === m.uuid))}
                        all={[...mainActes, ...secondaryActes]}
                        onDrop={onDrop}
                        onDragOver={allowDrop}
                        onChange={(event: React.ChangeEvent, value: any[]) => {
                            onChangeState(value, secondaryActes, setSecondaryActes);
                        }}
                        label={'name'}
                        initData={secondaryActes}
                        helperText={t("")}
                        placeholder={t("typing")}
                    />

                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight={600}
                        mb={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 6,
                            svg: {
                                ml: 1,
                                path: {
                                    fill: theme => theme.palette.warning.main,
                                },
                            },
                        }}
                    >
                        {t("suggestion")}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" sx={{bgcolor: "transparent"}}>

                        {
                            loading?
                            initalData.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={""}
                                    color="default"
                                    clickable
                                    draggable="true"
                                    avatar={<Skeleton width={90} sx={{ marginLeft: '16px !important'}} variant="text"/>}
                                    deleteIcon={<AddIcon/>}
                                    sx={{
                                        bgcolor: "#E4E4E4",
                                        filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0))",
                                        mb: 1,
                                        mr: 1,
                                        cursor: "move",
                                        "&:active": {
                                            boxShadow: "none",
                                            outline: "none",
                                        },
                                        "& .MuiChip-deleteIcon": {
                                            color: (theme) => theme.palette.text.primary,
                                        },
                                    }}
                                />
                            )):(suggestion as ActModel[]).map((v: ActModel) => (
                            <Chip
                                key={v.uuid}
                                id={v.uuid}
                                label={v.name}
                                color="default"
                                clickable
                                draggable="true"
                                onDragStart={onDrag(v)}
                                onClick={onClickChip(v)}
                                onDelete={onClickChip(v)}
                                deleteIcon={<AddIcon/>}
                                sx={{
                                    bgcolor: "#E4E4E4",
                                    filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0))",
                                    mb: 1,
                                    mr: 1,
                                    cursor: "move",
                                    "&:active": {
                                        boxShadow: "none",
                                        outline: "none",
                                    },
                                    "& .MuiChip-deleteIcon": {
                                        color: (theme) => theme.palette.text.primary,
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                </Paper>
            </Box>
        </>

    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})

export default Actes;

Actes.auth = true;

Actes.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
