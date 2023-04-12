// hooks
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
// material
import {Button, DialogActions, Grid, Paper, Skeleton, Typography,} from "@mui/material";
// ____________________________________
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import RootStyled from "./overrides/rootStyled";
// utils
import Icon from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {openDrawer} from "@features/calendar";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import {configSelector} from "@features/base";
import {LoadingScreen} from "@features/loadingScreen";

// selected dumy data
/*const cardItems: PatientDetailsList[] = [
    {
        id: 0,
        title: "title",
        icon: "ic-doc",
        items: [
            {id: 0, name: "Diabète / Hypoglycémie"},
            {id: 1, name: "Problèmes cardiaques / Hypertension"},
        ],
    },
];*/

const emptyObject = {
    title: "",
    value: "",
};

function AntecedentsCard({...props}) {
    const {loading, patient,antecedentsData, mutateAntecedents} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();

    const {direction} = useAppSelector(configSelector);
    const {t, ready} = useTranslation("patient", {keyPrefix: "background"});

    //const [data, setdata] = useState([...cardItems]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [info, setInfo] = useState<string>("");
    const [size, setSize] = useState<string>("sm");
    const [state, setState] = useState<AntecedentsModel[] | FamilyAntecedentsModel[]>([]);

    const [allAntecedents, setallAntecedents] = useState<any>([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger} = useRequestMutation(null, "/antecedent");
    const {data: httpAntecedentsTypeResponse} = useRequest({
        method: "GET",
        url: `/api/private/antecedent-types/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    }, SWRNoValidateConfig);


    const {data: httpAnctecentType} = useRequest({
        method: "GET",
        url: `/api/private/antecedent-types/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    useEffect(() => {
        if (httpAnctecentType) {
            setallAntecedents((httpAnctecentType as HttpResponse).data)
        }
    }, [httpAnctecentType])


    const handleClickDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        const form = new FormData();
        form.append("antecedents", JSON.stringify(state));
        form.append("patient_uuid", patient.uuid);
        trigger(
            {
                method: "POST",
                url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient.uuid}/antecedents/${allAntecedents.find((ant: { slug: any; }) => ant.slug === info).uuid}/${router.locale}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }, TriggerWithoutValidation
        ).then(() => {
            setOpenDialog(false);
            setInfo("");
            mutateAntecedents();
        });
    };

    const handleOpen = (action: string) => {
        if (action === "consultation") {
            dispatch(openDrawer({type: "add", open: true}));
            return;
        }
        if (antecedentsData && Object.keys(antecedentsData).find(key => key === action)) { // @ts-ignore
            console.log(antecedentsData[action]);
            setState(antecedentsData[action]);
        } else setState([])

        setInfo(action);
        action === "add_treatment" ? setSize("lg") : setSize("sm");
        handleClickDialog();
    };

/*    const onChangeList = (prop: PatientDetailsList) => {
        const newState = data.map((obj) => {
            if (obj.id === prop.id) {
                return {...prop};
            }
            return obj;
        });
        setdata(newState);
    }*/

    const antecedentsType = (httpAntecedentsTypeResponse as HttpResponse)?.data as any[];

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <RootStyled>
            <Typography
                variant="body1"
                sx={{fontWeight: "bold", p: 1}}
                gutterBottom>
                {loading ? (
                    <Skeleton variant="text" sx={{maxWidth: 200}}/>
                ) : (
                    t("title")
                )}
            </Typography>
            <Grid container spacing={2}>
                {(loading || !antecedentsType ? [emptyObject] : antecedentsType).map(
                    (antecedent, idx: number) => (
                        <React.Fragment key={idx}>
                            {antecedent.slug &&antecedent.slug !== "antecedents" && antecedent.slug !== "treatment" && <Grid item md={6} sm={12} xs={12}>
                                <Paper sx={{p: 1.5, borderWidth: 0, height: "100%"}}>
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                        className="item"
                                        component="span"
                                    >
                                        {/*<Icon path={antecedent.icon}/>*/}
                                        {loading ? (
                                            <Skeleton
                                                variant="text"
                                                sx={{maxWidth: 150, width: "100%"}}
                                            />
                                        ) : (
                                            t(antecedent.slug)
                                        )}
                                    </Typography>
                                    {(!antecedentsData
                                            ? Array.from(new Array(3))
                                            : antecedentsData[antecedent.slug] ? antecedentsData[antecedent.slug] : []
                                    ).map((antecedentData: any) => (
                                        <Typography
                                            key={Math.random()}
                                            mt={0.5}
                                            color="text.secondary"
                                            fontSize={11}
                                        >
                                            {loading ? <Skeleton variant="text"/> : antecedentData?.name}
                                        </Typography>
                                    ))}
                                    {loading ? (
                                        <Skeleton variant="text" sx={{maxWidth: 200}}/>
                                    ) : (
                                        <Button
                                            variant="text"
                                            color="primary"
                                            size="small"
                                            onClick={() => antecedent.slug && handleOpen(antecedent.slug)}
                                            sx={{
                                                mt: 1,
                                                svg: {width: 15, mr: 0.5, path: {fill: "#0696D6"}},
                                            }}
                                        >
                                            <Icon path="ic-plus"/> {t("add-background")}
                                        </Button>
                                    )}
                                </Paper>
                            </Grid>}
                        </React.Fragment>
                    )
                )}
            </Grid>
            {info && (
                <Dialog
                    {...{
                        direction,
                        size,
                        sx: {
                            minHeight: 460
                        }
                    }}
                    action={info}
                    open={openDialog}
                    data={{
                        state,
                        setState,
                        patient_uuid: patient.uuid,
                        action: info,
                        antecedents: allAntecedents
                    }}
                    title={t(info)}
                    dialogClose={() => {
                        setOpenDialog(false);
                        setInfo("");
                    }}
                    actionDialog={
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setOpenDialog(false);
                                    setInfo("");
                                }}
                                startIcon={<CloseIcon/>}>
                                {t("cancel")}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCloseDialog}
                                startIcon={<Icon path="ic-dowlaodfile"/>}>
                                {t("register")}
                            </Button>
                        </DialogActions>
                    }
                />
            )}
        </RootStyled>
    );
}

export default AntecedentsCard;