import {Avatar, AvatarGroup, Box, Stack, Tooltip, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import React, {useEffect, useState} from "react";
import Zoom from "react-medium-image-zoom";
import Image from "next/image";
import {getBirthdayFormat} from "@app/hooks";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {WidgetForm} from "@features/widget";
import {setModelPreConsultation} from "@features/dialog";
import {dashLayoutSelector} from "@features/base";

function PreConsultationDialog({...props}) {
    const {data} = props;
    const {patient, uuid} = data;
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {t} = useTranslation("consultation", {keyPrefix: "filter"});
    const {config: agenda} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [insurances, setInsurances] = useState<PatientInsuranceModel[]>([]);
    const [changes, setChanges] = useState([
        {name: "patientInfo", icon: "ic-text", checked: false},
        {name: "fiche", icon: "ic-text", checked: false},
        {index: 0, name: "prescription", icon: "ic-traitement", checked: false},
        {
            index: 3,
            name: "requested-analysis",
            icon: "ic-analyse",
            checked: false,
        },
        {
            index: 2,
            name: "requested-medical-imaging",
            icon: "ic-soura",
            checked: false,
        },
        {index: 1, name: "medical-certificate", icon: "ic-text", checked: false},
    ]);
    const [isClose, setIsClose] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: `/api/public/insurances/${router.locale}`,
    }, SWRNoValidateConfig);

    const {data: httpPatientPhotoResponse} = useRequest(
        patient?.hasPhoto
            ? {
                method: "GET",
                url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patient?.uuid}/documents/profile-photo/${router.locale}`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
            : null,
        SWRNoValidateConfig
    );

    const {data: httpSheetResponse} = useRequest(medicalEntityHasUser && agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/appointments/${uuid}/consultation-sheet/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: httpModelResponse} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/modals`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;
    const allInsurances = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];
    const models = (httpModelResponse as HttpResponse)?.data as ModalModel[];
    const sheetModal = (httpSheetResponse as HttpResponse)?.data?.modal;

    useEffect(() => {
        if (patient) {
            setInsurances(patient.insurances as any);
        }
    }, [patient]);

    useEffect(() => {
        if (sheetModal) {
            const storageWidget = localStorage.getItem(`Modeldata${uuid}`);
            (!storageWidget && sheetModal) && localStorage.setItem(`Modeldata${uuid}`, JSON.stringify(sheetModal?.data));
            setSelectedModel(sheetModal);
            dispatch(setModelPreConsultation(sheetModal.default_modal.uuid));
            setLoading(false);
        }
    }, [dispatch, sheetModal]); // eslint-disable-line react-hooks/exhaustive-deps

    return (<Stack direction={"column"} spacing={1.2}>
        <Stack direction={"row"} alignItems={"flex-start"}>
            <Stack direction={"column"} alignItems={"center"} spacing={.4}>
                <label htmlFor="contained-button-file">
                    <Zoom>
                        <Avatar
                            src={
                                patientPhoto
                                    ? patientPhoto
                                    : patient?.gender === "M"
                                        ? "/static/icons/men-avatar.svg"
                                        : "/static/icons/women-avatar.svg"
                            }
                            sx={{
                                width: 59,
                                height: 59,
                                marginLeft: 2,
                                marginRight: 2,
                                borderRadius: 2,
                            }}>
                            <IconUrl width={"59"} height={"59"} path="men-avatar"/>
                        </Avatar>
                    </Zoom>
                </label>
                {insurances && insurances.length > 0 &&
                    <Stack direction='row' alignItems="center" spacing={1}>
                        <AvatarGroup max={3} sx={{"& .MuiAvatarGroup-avatar": {width: 24, height: 24}}}>
                            {insurances.map((insuranceItem: { insurance: InsuranceModel }) =>
                                <Tooltip key={insuranceItem.insurance?.uuid}
                                         title={insuranceItem.insurance?.name}>
                                    <Avatar variant={"circular"}>
                                        <Image
                                            style={{borderRadius: 2}}
                                            alt={insuranceItem.insurance?.name}
                                            src="static/icons/Med-logo.png"
                                            width={20}
                                            height={20}
                                            loader={({src, width, quality}) => {
                                                return allInsurances?.find((insurance: any) => insurance.uuid === insuranceItem.insurance?.uuid)?.logoUrl as string
                                            }}
                                        />
                                    </Avatar>
                                </Tooltip>
                            )}
                        </AvatarGroup>
                    </Stack>}
            </Stack>

            <Box style={{cursor: "pointer"}}>
                <Typography
                    variant="body1"
                    color="primary.main"
                    sx={{fontFamily: "Poppins"}}>
                    {patient.firstName} {patient.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {patient?.birthdate} {patient?.birthdate && <>({" "}{getBirthdayFormat(patient, t)}{" "})</>}
                </Typography>

                {patient.contact.length > 0 && (
                    <Typography
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            "& .react-svg": {mr: 0.8},
                            mb: 0.3,
                        }}
                        variant="body2"
                        color="text.secondary">
                        <Icon path="ic-phone"/>
                        {patient.contact[0]?.code ? patient.contact[0].code : ""} {patient.contact[0].value}
                    </Typography>
                )}

                {patient?.email && (
                    <Typography
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            "& .react-svg": {mr: 0.8},
                        }}
                        variant="body2"
                        color="text.secondary">
                        <Icon path="ic-message-contour"/>
                        {patient.email}
                    </Typography>
                )}
            </Box>
        </Stack>

        {(models && sheetModal && !loading) && <WidgetForm
            {...{models, changes, setChanges, isClose}}
            expandButton={false}
            modal={selectedModel}
            data={sheetModal.data}
            appuuid={uuid}
            setSM={setSelectedModel}
            handleClosePanel={(v: boolean) => setIsClose(v)}></WidgetForm>}
    </Stack>)
}

export default PreConsultationDialog
