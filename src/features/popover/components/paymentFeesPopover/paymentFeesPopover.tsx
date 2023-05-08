import {useRequest} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useAppSelector} from "@app/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useRouter} from "next/router";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {DefaultCountry} from "@app/constants";
import {LinearProgress, Stack} from "@mui/material";
import React from "react";
import PaymentFeesPopoverStyled from "./overrides/PaymentFeesPopoverStyled";
import {useUrlSuffix} from "@app/hooks";

function PaymentFeesPopover({...props}) {
    const {uuid} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const urlMedicalEntitySuffix = useUrlSuffix();

    const {config: agenda} = useAppSelector(agendaSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const {data: httpAppointmentResponse} = useRequest(
        medical_professional && agenda ? {
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${uuid}/professionals/${medical_professional?.uuid}/${router.locale}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        } : null);

    const appointment = (httpAppointmentResponse as HttpResponse)?.data as any;

    return (
        <PaymentFeesPopoverStyled>
            <LinearProgress sx={{visibility: !appointment ? "visible" : "hidden"}} color="warning"/>
            {appointment && <List sx={{p: 0}} aria-label="secondary mailbox folders">
                <ListItemButton sx={{p: 0}} disableRipple disableGutters>
                    <ListItemText primary={`Consultation: ${appointment.consultation_fees} ${devise}`}/>
                </ListItemButton>
                {appointment.acts.map((act: any, index: number) => <ListItemButton sx={{p: 0}} key={index} disableRipple
                                                                                   disableGutters>
                    <ListItemText primary={`${act.name}: ${act.qte} x ${act.price} ${devise}`}/>
                </ListItemButton>)}
            </List>}
            <Divider/>
            {appointment && <List aria-label="main mailbox folders">
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <ListItemText primary={`Total`}/>
                    <ListItemText sx={{textAlign: "right"}} primary={`${appointment?.fees} ${devise}`}/>
                </Stack>
            </List>}
        </PaymentFeesPopoverStyled>
    )
}

export default PaymentFeesPopover;
