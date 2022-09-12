import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

function MotifAppointmentDialog({...props}) {
    const {t, reason, onChangeReason} = props;

    const router = useRouter();
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpConsultReasonResponse, error: errorHttpConsultReason} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/consultation-reasons/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[];

    return (
        <>
            <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                {t('consultation_reson')}
            </Typography>
            <FormControl fullWidth size="small">
                <Select
                    labelId="select-reason"
                    id="select-reason"
                    value={reason}
                    displayEmpty
                    onChange={onChangeReason}
                    sx={{
                        "& .MuiSelect-select svg": {
                            position: "absolute",
                            border: .1,
                            borderColor: 'divider',
                            borderRadius: '50%',
                            p: 0.05
                        },
                        "& .MuiTypography-root": {
                            ml: 3.5
                        }
                    }}
                    renderValue={selected => {
                        if (selected.length === 0) {
                            return <em>{t("stepper-1.reason-consultation-placeholder")}</em>;
                        }

                        const motif = reasons.find(reason => reason.uuid === selected);
                        return (
                            <Box sx={{display: "inline-flex"}}>
                                <FiberManualRecordIcon
                                    fontSize="small"
                                    sx={{
                                        color: motif?.color
                                    }}
                                />
                                <Typography>{motif?.name}</Typography>
                            </Box>

                        )
                    }}
                >
                    {reasons?.map((consultationReason) => (
                        <MenuItem value={consultationReason.uuid} key={consultationReason.uuid}>
                            <FiberManualRecordIcon
                                fontSize="small"
                                sx={{
                                    border: .1,
                                    borderColor: 'divider',
                                    borderRadius: '50%',
                                    p: 0.05,
                                    mr: 1,
                                    color: consultationReason.color
                                }}
                            />
                            {consultationReason.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}

export default MotifAppointmentDialog;
