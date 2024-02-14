import React, {ReactElement, useState} from "react";
import {AdminLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {StaffToolbar} from "@features/toolbar";
import {Box, Dialog} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {Otable, resetUser} from "@features/table";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useTranslation} from "next-i18next";
import {useRequestQuery} from "@lib/axios";
import {LoadingScreen} from "@features/loadingScreen";
import {NewUserDialog} from "@features/dialog";
import {setStepperIndex, stepperSelector} from "@features/stepper";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";

const headCells = [
    {
        id: "select-all",
        numeric: false,
        disablePadding: true,
        label: "name",
        sortable: false,
        align: "left",
    },
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        align: "left",
        sortable: true,
    },
    {
        id: "department",
        numeric: false,
        disablePadding: false,
        label: "department",
        align: "center",
        sortable: true,
    },
    {
        id: "function",
        numeric: false,
        disablePadding: false,
        label: "function",
        align: "center",
        sortable: true,
    },
    {
        id: "contact",
        numeric: false,
        disablePadding: false,
        label: "contact",
        align: "center",
        sortable: true,
    },
    {
        id: "email",
        numeric: false,
        disablePadding: false,
        label: "email",
        align: "center",
        sortable: true,
    },
    {
        id: "join-date",
        numeric: true,
        disablePadding: false,
        label: "join-date",
        align: "center",
        sortable: true,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: false,
        label: "empty",
        align: "center",
        sortable: false,
    },
];

function Staff() {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("staff", {keyPrefix: "config"});
    const {currentStep} = useAppSelector(stepperSelector);

    const [newUserDialog, setNewUserDialog] = useState<boolean>(false)

    const {data: httpUsersResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, {refetchOnWindowFocus: false});

    const handleAddStaff = () => {
        dispatch(resetUser());
        setNewUserDialog(true);
    }

    const handleCloseNewUserDialog = () => {
        setNewUserDialog(false)
        dispatch(setStepperIndex(0))
    }

    const handleNextPreviStep = () => {
        if (currentStep == 0) {
            setNewUserDialog(false)
        } else {
            dispatch(setStepperIndex(currentStep - 1))
        }
    }

    const users = ((httpUsersResponse as HttpResponse)?.data?.filter((user: UserModel) => !user.isProfessional) ?? []) as UserModel[];

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: {xs: "column", md: "row"},
                        py: {md: 0, xs: 2},
                    },
                }}>
                <StaffToolbar {...{t, handleAddStaff}}/>
            </SubHeader>
            <Box className="container">
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        rows={users}
                        from={"staff"}
                        {...{t}}
                    />
                </DesktopContainer>
                <Dialog
                    maxWidth="md"
                    PaperProps={{
                        sx: {
                            width: '100%',
                            m: 1
                        }
                    }}
                    open={newUserDialog}
                    onClose={handleCloseNewUserDialog}>
                    <NewUserDialog
                        {...{t}}
                        type={"assignment"}
                        onNextPreviStep={handleNextPreviStep}
                        onClose={handleCloseNewUserDialog}/>
                </Dialog>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'staff', 'settings']))
    }
})

Staff.auth = true

Staff.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}

export default Staff
