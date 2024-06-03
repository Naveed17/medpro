import {List, ListItem, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";
import React from "react";
import {ImageHandler} from "@features/image";
import {useAppSelector} from "@lib/redux/hooks";
import {stepperSelector} from "@features/stepper";
import moment from "moment/moment";

function Step3({...props}) {
    const {t,insurances} = props;
    const {agreement} = useAppSelector(stepperSelector);

    return (
        <Stack
            component={motion.div}
            key="step3"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            spacing={2}
            pb={3}>
            <Stack direction="row" spacing={1} alignItems="center">
                {agreement.insurance && <ImageHandler
                    style={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        borderRadius: 0.4,
                    }}
                    alt={"insurance"}
                    src={insurances.find((insc:any) => insc.uuid === agreement.insurance.uuid)?.logoUrl.url}
                />}
                <Typography variant="subtitle1"
                            fontWeight={700}>{agreement.insurance ? agreement.insurance.name : agreement.name}</Typography>
            </Stack>
            <List
                disablePadding
                sx={{
                    maxHeight: 150,
                    overflowY: "auto",
                }}>
                <ListItem
                    sx={{
                        bgcolor: (theme) => theme.palette.info.main,
                        borderRadius: 1,
                        mb: 0.5,
                    }}
                >
                    <Typography width={1} variant="body2" color="text.secondary">
                        {t("dialog.stepper.label")}
                    </Typography>
                    <Typography width={1} variant="body2" fontWeight={500}>
                        {agreement.label ? agreement.label : " -"}
                    </Typography>
                </ListItem>
                <ListItem
                    sx={{
                        bgcolor: (theme) => theme.palette.info.main,
                        borderRadius: 1,
                        mb: 0.5,
                    }}
                >
                    <Typography width={1} variant="body2" color="text.secondary">
                        {t("dialog.stepper.start_date")}
                    </Typography>
                    <Typography width={1} variant="body2" fontWeight={500}>
                        {agreement.startDate ? moment(agreement.startDate,"DD-MM-YYYY").format("DD/MM/YYYY") : "-"}
                    </Typography>
                </ListItem>
                <ListItem
                    sx={{
                        bgcolor: (theme) => theme.palette.info.main,
                        borderRadius: 1,
                        mb: 0.5,
                    }}
                >
                    <Typography width={1} variant="body2" color="text.secondary">
                        {t("dialog.stepper.end_date")}
                    </Typography>
                    <Typography width={1} variant="body2" fontWeight={500}>
                        {agreement.endDate ? moment(agreement.endDate,"DD-MM-YYYY").format("DD/MM/YYYY"): "-"}
                    </Typography>
                </ListItem>
                <ListItem
                    sx={{
                        bgcolor: (theme) => theme.palette.info.main,
                        borderRadius: 1,
                        mb: 0.5,
                    }}
                >
                    <Typography width={1} variant="body2" color="text.secondary">
                        {t("dialog.stepper.acts")}
                    </Typography>
                    <Typography width={1} variant="body2" fontWeight={500}>
                        {agreement.acts.length}
                    </Typography>
                </ListItem>
            </List>
        </Stack>
    );
}

export default Step3;
