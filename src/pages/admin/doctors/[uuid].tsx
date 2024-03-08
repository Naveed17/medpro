import {GetStaticProps, GetStaticPaths} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {useTranslation} from "next-i18next";
import {Box, useTheme, MenuItem, Typography, Stack, Button,} from "@mui/material";
import {useRouter} from "next/router";
import {DashLayout} from "@features/base";
import {LoadingScreen} from "@features/loadingScreen";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {DoctorAboutTab} from "@features/tabPanel";
import {Dialog} from "@features/dialog";
import {ActionMenu, toggleSideBar} from "@features/menu";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch} from "@lib/redux/hooks";
import {useRequestQuery} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";

function DoctorDetails() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready, i18n} = useTranslation("doctors", {keyPrefix: "config"});

    const [open, setOpen] = useState<boolean>(false)
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const userUuid = router.query["uuid"];

    const {data: httpUsersResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/admin/users/${userUuid}/${router.locale}`
    }, {
        refetchOnWindowFocus: false
    });

    const handleCloseMenu = () => {
        setContextMenu(null);
    }


    const popoverActions = [
        {
            title: "demoData",
            icon: <IconUrl color={"white"} path="/ic-voir"/>,
            action: "onDemoAction",
        },

    ];
    const error = false;

    const OnMenuActions = (action: string) => {
        handleCloseMenu();
    }

    const handleOpenMeun = (event: any) => setContextMenu(
        contextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
            } : null,
    );


    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        //reload locize resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["doctors"]);
        dispatch(toggleSideBar(true));
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready || error) {
        return <LoadingScreen
            button
            {...(error ? {
                OnClick: () => router.push('/dashboard/admin/doctors'),
                text: 'loading-error-404-reset'
            } : {})}
        />
    }

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        py: {md: 0, xs: 2},
                    },
                }}>
                <Stack
                    direction={{xs: 'column', md: 'row'}}
                    justifyContent="space-between"
                    width={1}
                    alignItems={{xs: "flex-start", md: "center"}}>
                    <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                        {t("sub-header.doctor_title")}
                    </Typography>
                    <Button variant={"text"} onClick={() => router.back()} startIcon={<ArrowBackIosRoundedIcon/>}>
                        {t("back_doctors")}
                    </Button>
                </Stack>
            </SubHeader>

            <Box className="container">
                <DoctorAboutTab {...{t, theme, handleOpenMeun, handleOpenRestPass: () => setOpen(true)}} />
            </Box>
            <Dialog
                action="rest-password"
                title={t("dialog.title")}
                sx={{p: 0}}
                open={open}
                data={{t, theme, handleClose}}
                onClose={handleClose}
                dialogClose={handleClose}
            />
            <ActionMenu {...{contextMenu, handleClose: handleCloseMenu}}>
                {popoverActions.map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{color: "#fff"}}>
                                {t(`popover-action.${v.title}`)}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'doctors']))
    }
})


export default DoctorDetails;

DoctorDetails.auth = true;

DoctorDetails.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
