import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {Box, Button, IconButton, InputAdornment, Stack, TextField, Typography, useTheme} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {RootStyled} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";
import {Otable} from '@features/table';
import {TriggerWithoutValidation} from "@app/swr/swrProvider";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

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
        numeric: true,
        disablePadding: false,
        label: "actions",
        sortable: true,
        align: "right",
    },

];

function ActFees() {
    const {data: session} = useSession();
    const theme = useTheme();
    const devise = process.env.devise;
    const [mainActes, setMainActes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [create, setCreate] = useState(false)
    const router = useRouter();
    const [setselected] = useState<any>({});
    const [consultationFees, setConsultationFees] = useState(0);
    const [newFees, setNewFees] = useState({name: '', fees: ''});


    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {trigger} = useRequestMutation(null, "/settings/acts");

    const {data: httpProfessionalsActs, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/acts/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {data: httpMPResponse} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/professionals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    });

    useEffect(() => {
        if (httpMPResponse) {
            const mpRes = (httpMPResponse as HttpResponse)?.data[0];
            setConsultationFees(Number(mpRes.consultation_fees))
        }
    }, [httpMPResponse])

    useEffect(() => {
        setLoading(true)
        if (httpProfessionalsActs !== undefined) {
            const response = ((httpProfessionalsActs as HttpResponse).data).reverse()
            setMainActes(response as ActModel[])
            setLoading(false)
        }
    }, [httpProfessionalsActs]);

    const handleCreate = () => {
        setCreate(true)
    }

    const handleRemove = () => {
        setCreate(false)
    }

    const editFees = () => {
        const form = new FormData();
        form.append("consultation_fees", consultationFees.toString());
        trigger({
            method: "PATCH",
            url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + medical_professional.uuid + '/' + router.locale,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then((r) => console.log(r));
    }

    const removeFees = (uuid: string) => {
        trigger({
            method: "DELETE",
            url: "/api/medical-entity/" + medical_entity.uuid + "/acts/" + uuid + '/' + router.locale,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then(() => mutate());
    }

    const saveFees = () => {
        if (newFees.name !== '' && newFees.fees !== '') {
            const form = new FormData();
            form.append('name', JSON.stringify({
                "fr": newFees.name,
            }));
            form.append('price', `${newFees.fees}`)
            trigger({
                method: "POST",
                url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/new-acts/${router.locale}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, TriggerWithoutValidation).then(() => {
                mutate().then(() => {
                    setCreate(false)
                    setNewFees({name: '', fees: ''})
                })
            })
        }
    }

    const {t, ready} = useTranslation("settings", {keyPrefix: "actfees"});
    if (!ready) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('path')}</p>
                </RootStyled>

                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    {
                        create ?
                            <Button variant="contained" color={"warning"}
                                    onClick={handleRemove}>{t('cancel')}</Button> :
                            <Button variant="contained" color={"success"}
                                    onClick={() => handleCreate()}>{t("add_a_new_act")}</Button>
                    }
                    <span>|</span>
                    <TextField id="outlined-basic"
                               value={consultationFees}
                               size="small"
                               InputProps={{
                                   endAdornment: <InputAdornment position="end">{devise}</InputAdornment>,
                                   style: {width: 120, backgroundColor: "white"}
                               }}
                               onChange={(ev) => {
                                   setConsultationFees(Number(ev.target.value))
                               }}
                               variant="outlined"/>
                    <IconButton color={"primary"} onClick={() => {
                        editFees()
                    }}>
                        <SaveRoundedIcon color={"primary"}/>
                    </IconButton>

                </Stack>
            </SubHeader>
            <Box sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}, 'table': {tableLayout: 'fixed'}}}>
                {create && <Stack
                    style={{
                        background: "white",
                        padding: '10px 15px',
                        border: `1px solid ${theme.palette.warning.main}`,
                        borderRadius: 10
                    }}
                    spacing={2}
                    mb={2}>
                    <Typography style={{color: theme.palette.grey[400], fontSize: 10}}>{t('newAct')}</Typography>
                    <Stack direction={"row"} alignItems={"center"} spacing={3}>
                        <TextField id="outlined-basic"
                                   value={newFees.name}
                                   size="small"
                                   label={t('name')}
                                   InputProps={{
                                       style: {width: 450, backgroundColor: "white"}
                                   }}
                                   onChange={(ev) => {
                                       newFees.name = ev.target.value
                                       setNewFees({...newFees})
                                   }}
                                   variant="outlined"/>
                        <TextField id="outlined-basic"
                                   value={newFees.fees}
                                   type={"number"}
                                   size="small"
                                   label={t('price')}
                                   InputProps={{
                                       endAdornment: <InputAdornment position="end">{devise}</InputAdornment>,
                                       style: {width: 150, backgroundColor: "white"}
                                   }}
                                   onChange={(ev) => {
                                       newFees.fees = ev.target.value
                                       setNewFees({...newFees})
                                   }}
                                   variant="outlined"/>
                        <Button disabled={newFees.name === '' || newFees.fees === ''} onClick={() => {
                            saveFees()
                        }}>{t('save')}</Button>
                    </Stack>

                </Stack>}

                <Otable
                    headers={headCells}
                    rows={mainActes}
                    from={"actfees"}
                    edit={setselected}
                    remove={removeFees}
                    {...{t, loading}}
                />
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

export default ActFees;

ActFees.auth = true;

ActFees.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
