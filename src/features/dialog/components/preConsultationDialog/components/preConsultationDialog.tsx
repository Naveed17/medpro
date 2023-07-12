import {Avatar, AvatarGroup, Box, Stack, Tooltip, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import React, {useEffect, useState} from "react";
import Zoom from "react-medium-image-zoom";
import {getBirthdayFormat, useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {WidgetForm} from "@features/widget";
import {setModelPreConsultation} from "@features/dialog";
import {dashLayoutSelector} from "@features/base";
import {useInsurances} from "@lib/hooks/rest";
import {useProfilePhoto} from "@lib/hooks/rest";
import {ImageHandler} from "@features/image";
import PreConsultationDialogStyled from "./overrides/preConsultationDialogStyled";

function PreConsultationDialog({...props}) {
    const {data} = props;
    const {patient, uuid} = data;
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {insurances: allInsurances} = useInsurances();
    const {patientPhoto} = useProfilePhoto({patientId: patient?.uuid, hasPhoto: patient?.hasPhoto});

    const {t} = useTranslation("consultation", {keyPrefix: "filter"});
    const {config: agenda} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [insurances, setInsurances] = useState<InsuranceModel[]>([]);
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

    const {data: httpSheetResponse} = useRequest(medicalEntityHasUser && agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/appointments/${uuid}/consultation-sheet/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: httpModelResponse} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/modals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

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

    return (
        <PreConsultationDialogStyled direction={"column"} spacing={1.2}>
            <Stack direction={"row"} alignItems={"flex-start"}>
                <Stack direction={"column"} alignItems={"center"} spacing={.4}>
                    <label htmlFor="contained-button-file">
                        <Zoom>
                            <Avatar
                                src={
                                    patientPhoto
                                        ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
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
                            <AvatarGroup max={3}>
                                {insurances.map((insuranceItem: any) =>
                                    <Tooltip key={insuranceItem.uuid}
                                             title={insuranceItem.name}>
                                        {allInsurances?.find((insurance: any) => insurance.uuid === insuranceItem.uuid) ?
                                            <Avatar variant={"circular"}>
                                                <ImageHandler
                                                    alt={insuranceItem?.name}
                                                    src={allInsurances?.find((insurance: any) => insurance.uuid === insuranceItem.uuid)?.logoUrl.url as string}
                                                />
                                            </Avatar> : <></>}
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

                    {patient.contact?.length > 0 && (
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
        </PreConsultationDialogStyled>)
}

export default PreConsultationDialog
