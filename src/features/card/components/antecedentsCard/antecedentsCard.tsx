// hooks
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
// material
import {Button, DialogActions, Grid, Paper, Skeleton, Typography,} from "@mui/material";
// ____________________________________
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import RootStyled from "./overrides/rootStyled";
// utils
import Icon from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {openDrawer} from "@features/calendar";
import {useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {configSelector, dashLayoutSelector} from "@features/base";
import {LoadingScreen} from "@features/loadingScreen";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {HtmlTooltip} from "@features/tooltip";
import {useAntecedentTypes} from "@lib/hooks/rest";

const emptyObject = {
    title: "",
    value: "",
};

function AntecedentsCard({...props}) {
    const {loading, patient, antecedentsData, mutateAntecedents} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();
    const {allAntecedents: antecedentsType} = useAntecedentTypes();

    const {direction} = useAppSelector(configSelector);
    const {t, ready} = useTranslation("patient", {keyPrefix: "background"});
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [info, setInfo] = useState<string>("");
    const [infoDynamic, setInfoDynamic] = useState<string>("");
    const [size, setSize] = useState<string>("sm");
    const [state, setState] = useState<AntecedentsModel[] | FamilyAntecedentsModel[]>([]);

    const {trigger} = useRequestMutation(null, "/antecedent");

    const isObject = (val: any) => {
        if (val === null) {
            return false;
        }
        return typeof val === 'object' && !Array.isArray(val)
    }

    const handleClickDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        const form = new FormData();
        form.append("antecedents", JSON.stringify(state));
        form.append("patient_uuid", patient.uuid);
        medicalEntityHasUser && trigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/antecedents/${antecedentsType?.find((ant: {
                slug: any;
            }) => ant.slug === infoDynamic).uuid}/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then(() => {
            setOpenDialog(false);
            setInfo("");
            setInfoDynamic("");
            mutateAntecedents();
        });
    };

    const handleOpen = (action: string) => {
        if (action === "consultation") {
            dispatch(openDrawer({type: "add", open: true}));
            return;
        }
        if (antecedentsData && Object.keys(antecedentsData).find(key => key === action)) { // @ts-ignore
            setState(antecedentsData[action]);
        } else setState([])

        setInfo("dynamicAnt");
        setInfoDynamic(action);
        action === "add_treatment" ? setSize("lg") : setSize("sm");
        handleClickDialog();
    };

    const getTitle = () => {
        const info = antecedentsType?.find((ant: { slug: any; }) => ant.slug === infoDynamic);

        if (info) {
            return info.name;
        }
        return t(infoDynamic)
    }

    const getAntecedents = (antecedent: any) => {
        if (!antecedentsData)
            return Array.from(new Array(3));
        else if (antecedentsData[antecedent.slug])
            return antecedentsData[antecedent.slug];
        else return [];

    }
    const getNote = (item: { response: string | any[]; }) => {
        if (item?.response)
            if (typeof item?.response === "string")
                return item?.response;
            else if (item?.response.length > 0)
                return item?.response[0]?.value;
            else return '-';
        else return '-';
    }
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
                            {antecedent.slug && antecedent.slug !== "antecedents" && antecedent.slug !== "treatment" &&
                                <Grid item md={6} sm={12} xs={12}>
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
                                                <Typography className={"ant-title"}> {antecedent.name}</Typography>
                                            )}
                                        </Typography>
                                        {getAntecedents(antecedent).map((item: any, index: number) => (
                                            <HtmlTooltip
                                                key={`antecedent-${index}`}
                                                title={
                                                    <React.Fragment>
                                                        <Typography fontWeight={"bold"}
                                                                    fontSize={12}>{item?.name}</Typography>
                                                        <Typography fontSize={12}>Date début
                                                            : {item?.startDate ? item?.startDate : "-"}</Typography>
                                                        <Typography fontSize={12}>Date fin
                                                            : {item?.endDate ? item?.endDate : "-"}</Typography>
                                                        {item?.ascendantOf && <Typography fontSize={12}>{t(item?.ascendantOf)}</Typography>}
                                                        <Typography fontSize={12}>Note : {getNote(item)}</Typography>
                                                        {item?.note && <Typography fontSize={12}>RQ : {item?.note}</Typography>}
                                                        {isObject(item?.response) && Object.keys(item?.response).map((rep: any) => (
                                                            <Typography color="gray" fontSize={12}
                                                                        key={rep}>{rep} : {item?.response[rep]}</Typography>
                                                        ))}
                                                    </React.Fragment>
                                                }
                                            >
                                                <Typography
                                                    mt={0.5}
                                                    color="text.secondary"
                                                    fontSize={11}
                                                >
                                                    {loading ? <Skeleton variant="text"/> : item &&
                                                        <Typography style={{cursor: 'pointer'}} fontSize={11}>
                                                            {item.name}{" "}
                                                            {item.startDate ? " / " + item.startDate : ""}{" "}
                                                            {item.endDate ? " - " + item.endDate : ""}
                                                            {(item as any).ascendantOf && `(${t((item as any).ascendantOf)})`}
                                                            {item.response ? typeof item.response === "string" ? '(' + item.response + ')' : item.response.length > 0 ? '(' + item.response[0]?.value + ')' : '' : ''}
                                                        </Typography>}
                                                </Typography>
                                            </HtmlTooltip>
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
                        action: infoDynamic,
                        antecedents: antecedentsType ? antecedentsType : []
                    }}
                    title={getTitle()}
                    dialogClose={() => {
                        setOpenDialog(false);
                        setInfo("");
                        setInfoDynamic("");
                    }}
                    actionDialog={
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setOpenDialog(false);
                                    setInfo("");
                                    setInfoDynamic("");
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
