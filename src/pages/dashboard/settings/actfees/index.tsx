import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { DashLayout } from "@features/base";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import { Chip, Paper, Skeleton, Stack, Typography, Button, DialogActions } from "@mui/material";
import { useTranslation } from "next-i18next";
import IconUrl from "@themes/urlIcon";
import { MultiSelect } from "@features/multiSelect";
import BasicAlert from "@themes/overrides/Alert";
import { useRequest, useRequestMutation } from "@app/axios";
import { useRouter } from "next/router";
import { RootStyled } from "@features/toolbar";
import { SubHeader } from "@features/subHeader";
import { Otable } from '@features/table'
import { Dialog } from '@features/dialog'
import CloseIcon from "@mui/icons-material/Close";
interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}
const headCells: readonly HeadCell[] = [

    {
        id: "acts",
        numeric: false,
        disablePadding: true,
        label: "acts",
        sortable: true,
        align: "left",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "left",
    },
    {
        id: "actions",
        numeric: false,
        disablePadding: false,
        label: "actions",
        sortable: false,
        align: "right",
    },

];

function ActFees() {

    const { data: session } = useSession();
    const [mainActes, setMainActes] = useState<ActModel[]>([]);
    const [secondaryActes, setSecondaryActes] = useState<ActModel[]>([]);
    const [selected, setSelected] = useState<ActModel>();
    const [suggestion, setSuggestion] = useState<ActModel[]>([]);
    const [alert, setAlert] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isProfil, setIsProfil] = useState<boolean>(false);
    const [secAlert, setSecAlert] = useState<boolean>(false);
    const [acts, setActs] = useState<ActModel[]>([]);
    const [specialities, setSpecialities] = useState<any>({});
    const router = useRouter();
    const [medical_professional_uuid, setMedicalProfessionalUuid] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [stateAct, setstateAct] = useState({
        "uuid": "",
        "isTopAct": true,
        fees: 0,
        "act": {
            "uuid": "",
            "name": "",
            "description": "",
            "weight": 0
        }
    });
    const initalData = Array.from(new Array(8));

    const { data: user } = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const { data: httpProfessionalsResponse, error: errorProfil } = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + router.locale,
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    });

    const { trigger } = useRequestMutation(null, "/settings/acts");

    const { data, error } = useRequest(isProfil ? {
        method: "GET",
        url: "/api/public/acts/" + router.locale,
        params: specialities,
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    } : null);

    const getData = useCallback(() => {
        let topAct = "";
        let secondaryAct = ""
        mainActes.map(ma => topAct += ma.uuid + ',');
        secondaryActes.map(ms => secondaryAct += ms.uuid + ',');
        topAct = topAct.substring(0, topAct.length - 1);
        secondaryAct = secondaryAct.substring(0, secondaryAct.length - 1);
        setEdit(false);
        const form = new FormData();
        form.append('topAct', topAct)
        form.append('secondaryAct', secondaryAct);
        trigger({
            method: "POST",
            url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + medical_professional_uuid + '/acts/' + router.locale,
            data: form,
            headers: { ContentType: 'application/x-www-form-urlencoded', Authorization: `Bearer ${session?.accessToken}` }
        }, { revalidate: true, populateCache: true }).then(r => console.log('edit qualification', r))

    }, [mainActes, medical_entity.uuid, medical_professional_uuid, router.locale, secondaryActes, session?.accessToken, trigger]);

    useEffect(() => {
        if (edit) {
            getData();
        }
    }, [edit, getData]);

    useEffect(() => {
        if (data !== undefined) {
            setActs(((data as any).data) as ActModel[])
            setSuggestion(((data as any).data) as ActModel[]);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {

        if (httpProfessionalsResponse !== undefined) {

            const professionalSpecialities = {};
            (httpProfessionalsResponse as any).data[0].medical_professional.specialities.map((speciality: any, index: number) => {
                Object.assign(professionalSpecialities, { ['specialities[' + index + ']']: speciality.speciality.uuid });
            });

            setSpecialities(professionalSpecialities);
            setIsProfil(true);
            setMedicalProfessionalUuid((httpProfessionalsResponse as any).data[0].medical_professional.uuid);
            const acts = (httpProfessionalsResponse as any).data[0].acts;
            let main: ActModel[] = [];
            let secondary: ActModel[] = [];
            acts.map((act: MedicalProfessionalActModel) => {
                act.isTopAct ? main.push((act.act) as ActModel) : secondary.push(act.act);
            });
            setMainActes(main);
            setSecondaryActes(secondary);
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

        setEdit(true);
    };

    const onDrag = (prop: any) => (ev: any) => {
        ev.dataTransfer.setData("Text", ev.target.id);
        ev.effectAllowed = "copy";
        setSelected({ ...prop });
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
        setEdit(true);
    };

    const onChangeState = (
        val: any[],
        items: any[],
        setItems: (arg0: any[]) => void
    ) => {
        setItems(val.slice(0, 10));
        setEdit(true);
    };
    const handleCloseDialogAct = () => {
        setOpenDialog(false);
    }

    const handleSaveDialog = () => {
        setOpenDialog(false);

    }

    const { t, ready } = useTranslation("settings", { keyPrefix: "actfees" });
    if (!ready) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{ margin: 0 }}>{t('path')}</p>
                </RootStyled>
            </SubHeader>
            <Box sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 }, 'table': { tableLayout: 'fixed' } }}>
                <Otable
                    headers={headCells}
                    rows={[1, 2]}
                    from={"actfees"}
                    t={t}
                />

                <Button
                    onClick={() => setOpenDialog(true)}
                    size='small' sx={{
                        '& .react-svg svg': {
                            width: theme => theme.spacing(1.5),
                            path: { fill: theme => theme.palette.primary.main }
                        }
                    }} startIcon={<IconUrl path="ic-plus" />}>{t("add_a_new_act")}</Button>
            </Box>
            <Dialog action={'add_act'}
                open={openDialog}
                data={{ stateAct, setstateAct, t }}
                size={"sm"}
                direction={'ltr'}
                title={t('add_a_new_act')}
                dialogClose={handleCloseDialogAct}
                actionDialog={
                    <DialogActions>
                        <Button onClick={handleCloseDialogAct}
                            startIcon={<CloseIcon />}>
                            {t('cancel')}
                        </Button>
                        <Button variant="contained"
                            onClick={handleSaveDialog}

                            startIcon={<IconUrl
                                path='ic-dowlaodfile' />}>
                            {t('save')}
                        </Button>
                    </DialogActions>
                } />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})

export default ActFees;

ActFees.auth = true;

ActFees.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
