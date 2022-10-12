import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect, useState } from "react";
import { DashLayout } from "@features/base";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { Box, Drawer } from "@mui/material";
import { Button, DialogActions } from "@mui/material";
import { useTranslation } from "next-i18next";
import IconUrl from "@themes/urlIcon";
import { useRequest, useRequestMutation } from "@app/axios";
import { useRouter } from "next/router";
import { RootStyled } from "@features/toolbar";
import { SubHeader } from "@features/subHeader";
import { Otable } from '@features/table'
import { Dialog } from '@features/dialog'
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "@app/redux/hooks";
import { configSelector } from "@features/base";
import { ActFeesDialog } from "@features/dialog";

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
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "acts",
        sortable: true,
        align: "left",
    },
    {
        id: "fees",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "center",
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
    const [mainActes, setMainActes] = useState<any>([]);
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selected, setselected] = useState();
    const [edit, setEdit] = useState(false);
    const { direction } = useAppSelector(configSelector);
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
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const { trigger } = useRequestMutation(null, "/settings/acts");

    const { data: httpProfessionalsActs, error: errorActs, mutate } = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/acts/${router.locale}`,
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    });

    useEffect(() => {
        if (httpProfessionalsActs !== undefined) {
            setMainActes(((httpProfessionalsActs as any).data) as ActModel[])
        }
    }, [httpProfessionalsActs]);
    const handleCloseDialogAct = () => {
        setOpenDialog(false);
    }
    const closeDraw = () => {
        setEdit(false);
    }
    const handleSaveDialog = () => {
        const form = new FormData();
        form.append('name', JSON.stringify({
            "fr": stateAct.act.name,
        }));
        form.append('price', `${stateAct.fees}`)
        trigger({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/new-acts/${router.locale}`,
            data: form,
            headers: {
                ContentType: 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, { revalidate: true, populateCache: true }).then(r => mutate())
        setOpenDialog(false);

    }
    const handleEdit = (v: any) => {
        setselected(v)
        setEdit(true)
    };
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
                    rows={mainActes}
                    from={"actfees"}
                    edit={handleEdit}
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
                sx={{ height: 200 }}
                dialogClose={handleCloseDialogAct}
                actionDialog={
                    <DialogActions>
                        <Button onClick={handleCloseDialogAct}
                            startIcon={<CloseIcon />}>
                            {t('cancel')}
                        </Button>
                        <Button disabled={!(stateAct.fees && stateAct.act.name)} variant="contained"
                            onClick={handleSaveDialog}
                            startIcon={<IconUrl
                                path='ic-dowlaodfile' />}>
                            {t('save')}
                        </Button>
                    </DialogActions>
                } />
            <Drawer
                anchor={'right'}
                open={edit}
                dir={direction}
                onClose={closeDraw}>
                <ActFeesDialog
                    data={selected}
                    mutateEvent={mutate}
                    closeDraw={closeDraw}
                />
            </Drawer>
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
