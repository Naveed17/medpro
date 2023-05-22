import React, {useState} from "react";

// Material
import {
    TableCell,
    Stack,
    IconButton,
    Checkbox,
    Button,
    Typography,
    Avatar,
    Box,
    Link,
    useMediaQuery, useTheme,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

// components
import Icon from "@themes/urlIcon";
import {TableRowStyled} from "@features/table";
import IconUrl from "@themes/urlIcon";

// menu data
const menuList = [
    {
        title: "Patient Details",
        icon: <CheckRoundedIcon/>,
        action: "onOpenPatientDrawer",
    },
    {
        title: "Edit Patient",
        icon: <CheckRoundedIcon/>,
        action: "onOpenEditPatient",
    },
    {
        title: "Cancel",
        icon: <CheckRoundedIcon/>,
        action: "onCancel",
    },
];
import KeyboardVoiceRoundedIcon from '@mui/icons-material/KeyboardVoiceRounded';

export default function EnhancedTable({...props}) {
    const {checkedType, t, row, handleEvent} = props;
    const theme = useTheme();
    // useState tooltip
    const [openTooltip, setOpenTooltip] = useState(false);

    // query for mobile view
    const isMobile = useMediaQuery("(max-width:600px)");

    // Avoid a layout jump when reaching the last page with empty rows.
    return (
        <>
            <TableRowStyled key={row.id} className="document-row">
                {!isMobile ? (
                    <>
                        <TableCell>
                            <Stack spacing={1} direction="row" alignItems="center">
                               {/* <Checkbox
                                    checked={checkedType.some(
                                        (item: PatientDocuments) => item.documentType === row.documentType
                                    )}
                                    inputProps={{"aria-label": "controlled"}}
                                />*/}
                                <IconUrl
                                    {...(row.documentType === "photo" && {width: "30", height: "30"})}
                                    path={
                                        row.documentType === "prescription" && "ic-traitement" ||
                                        row.documentType == "requested-analysis" && "ic-analyse" ||
                                        row.documentType == "analyse" && "ic-analyse" ||
                                        row.documentType == "medical-imaging" && "ic-soura" ||
                                        row.documentType == "requested-medical-imaging" && "ic-soura" ||
                                        row.documentType === "photo" && "ic-img" ||
                                        row.documentType === "Rapport" && "ic-text" ||
                                        row.documentType === "medical-certificate" && "ic-text" ||
                                        row.documentType === "video" && "ic-video-outline" ||
                                        row.documentType === "audio" && "ic-son" ||
                                        row.documentType !== "prescription" && "ic-pdf" || ""
                                    }/>
                                <Box>
                                    <Typography color="text.primary" fontWeight={400}>
                                        {t(row?.title)}
                                    </Typography>
                                    <Stack spacing={1} direction="row">
                                        {row?.firstName && row?.lastName && (
                                            <>
                                                <Avatar
                                                    {...(row.img
                                                        ? {
                                                            src: row.img,
                                                            alt: "",
                                                            sx: {bgcolor: "transparent"},
                                                        }
                                                        : {
                                                            children: (
                                                                <span>
                                    {row?.firstName?.slice(0, 1)}{" "}
                                                                    {row?.lastName?.slice(0, 1)}
                                  </span>
                                                            ),
                                                        })}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    fontWeight={400}
                                                >
                                                    {row?.firstName} {row?.lastName}
                                                </Typography>
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                        </TableCell>
                        <TableCell align="center">{row.createdAt}</TableCell>
{/*
                        <TableCell align="left">
                            {row.createdBy === "Interne" ? (
                                <Typography color="text.secondary" fontWeight={400}>
                                    {row.createdBy}
                                </Typography>
                            ) : (
                                <>
                                    <Link underline="none" href={`/profile/${row.createdBy}`}>
                                        {row.createdBy}
                                    </Link>
                                    <Typography
                                        fontSize={10}
                                        color="text.secondary"
                                        fontWeight={400}
                                    >
                                        {row?.specialist}
                                    </Typography>
                                </>
                            )}
                        </TableCell>
*/}
                        <TableCell align="right">
                            <Stack
                                spacing={1}
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                            >
                                {row.documentType !== 'audio' && <Button
                                    onClick={() => handleEvent("MORE", row)}
                                    startIcon={<Icon path={"ic-voir"}/>}>
                                    {t("config.table.see", {ns: 'patient'})}
                                </Button>}
                                {row.documentType === 'audio' && <Button
                                    onClick={() => handleEvent("LISTEN", row)}
                                    startIcon={<KeyboardVoiceRoundedIcon/>}>
                                    {t("config.table.listen", {ns: 'patient'})}
                                </Button>}
                            </Stack>
                        </TableCell>
                    </>
                ) : (
                    <>
                        <TableCell>
                            <Stack direction="row" alignItems="center">
                                <Box>
                                    <Typography color="text.primary" fontWeight={400}>
                                        {t(row?.name)}
                                    </Typography>
                                    <Stack spacing={1} direction="row" alignItems="center">
                                        {row?.firstName && row?.lastName && (
                                            <>
                                                <Avatar
                                                    {...(row.img
                                                        ? {
                                                            src: row.img,
                                                            alt: "",
                                                            sx: {bgcolor: "transparent"},
                                                        }
                                                        : {
                                                            children: (
                                                                <span>
                                    {row?.firstName?.slice(0, 1)}{" "}
                                                                    {row?.lastName?.slice(0, 1)}
                                  </span>
                                                            ),
                                                        })}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    fontWeight={400}
                                                >
                                                    {row?.firstName} {row?.lastName}
                                                </Typography>
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                            <Stack mt={1}>
                                <Stack spacing={1} direction="row">
                                    <Icon path="ic-agenda-jour"/>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        fontWeight={400}
                                    >
                                        {row.createdAt}
                                    </Typography>
                                </Stack>
                                {row.createdBy === "Interne" ? (
                                    <Typography color="text.secondary" fontWeight={400}>
                                        {row.createdBy}
                                    </Typography>
                                ) : (
                                    <>
                                        <Link underline="none" href={`/profile/${row.createdBy}`}>
                                            {row.createdBy}
                                        </Link>
                                        <Typography
                                            fontSize={10}
                                            color="text.secondary"
                                            fontWeight={400}
                                        >
                                            {row?.specialist}
                                        </Typography>
                                    </>
                                )}
                            </Stack>
                        </TableCell>
                        <TableCell align="right">
                            <Stack
                                spacing={1}
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                            >
                                <IconButton>
                                    <Icon color={theme.palette.text.primary} path={"ic-voir"}/>
                                </IconButton>
                            </Stack>
                        </TableCell>
                    </>
                )}
            </TableRowStyled>
        </>
    );
}
