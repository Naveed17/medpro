import RootStyled from './overrides/rootStyled';
import {Avatar, Box, IconButton, Stack, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CloseIcon from '@mui/icons-material/Close';
import moment from "moment-timezone";
import Icon from "@themes/urlIcon";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import Zoom from "react-medium-image-zoom";
import CircularProgress from '@mui/material/CircularProgress';
import {useAppSelector} from "@app/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@app/hooks";

function PatientAppointmentCard({...props}) {
    const {item: patient, handleListItemClick, listing, onReset, onEdit, ...rest} = props;
    const router = useRouter();
    const {data: session} = useSession();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpPatientPhotoResponse} = useRequest(medicalEntityHasUser && patient?.hasPhoto ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/documents/profile-photo/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;
    const [loading, setLoading] = useState(false);

    return (
        <RootStyled
            disableRipple
            {...rest}
            {...{styleprops: listing?.toString()}}
            sx={{
                "& [data-rmiz]": {
                    width: 36
                }
            }}>
            <Stack direction={"row"} alignItems={"center"} sx={{width: "100%"}}>
                <Zoom>
                    <Avatar
                        className={"zoom-list"}
                        src={patientPhoto ? patientPhoto : (patient?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
                        sx={{
                            "& .injected-svg": {
                                margin: 0
                            },
                            width: 30,
                            height: 30,
                            borderRadius: 1
                        }}>
                        <IconUrl width={"30"} height={"30"} path="men-avatar"/>
                    </Avatar>
                </Zoom>
                <Stack ml={1} direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
                    <Box onClick={() => handleListItemClick(patient)}>
                        <Stack spacing={.5} direction="row" alignItems='center'>
                            <Typography color="primary" sx={{fontWeight: 500, display: 'flex'}}>
                                {patient.firstName} {patient.lastName}
                            </Typography>
                        </Stack>
                        {patient.birthdate && <Stack spacing={.5} direction="row" alignItems='center'>
                            <IconUrl path="ic-anniverssaire"/>
                            <Typography color="text.secondary" variant="body2" sx={{fontWeight: 500, display: 'flex'}}>
                                {patient.birthdate} - {moment().diff(moment(patient.birthdate, "DD-MM-YYYY"), 'years')} ans
                            </Typography>
                        </Stack>}
                    </Box>
                    {listing && (
                        <Box>
                            <IconButton
                                size="small"
                                sx={{mr: 1}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLoading(true);
                                    onEdit(patient);
                                }}
                            >
                                {!loading ?
                                    <Icon color={"white"} path="setting/edit"/> :
                                    <Box sx={{display: 'flex'}}>
                                        <CircularProgress size={"20px"} color={"white"}/>
                                    </Box>
                                }
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReset(null);
                                }}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                    )}
                </Stack>
            </Stack>
        </RootStyled>
    )
}

export default PatientAppointmentCard;
