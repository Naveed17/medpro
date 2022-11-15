import React, {ReactElement, useState} from "react";
import {DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {Box, Button} from "@mui/material";
import {useTranslation} from "next-i18next";
import {Otable} from "@features/table";
import {styled} from "@mui/material/styles";
import {useRouter} from "next/router";
import {useAppSelector} from "@app/redux/hooks";
import {tableActionSelector} from "@features/table";
import {NoDataCard} from "@features/card";
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

const CardData = {
    mainIcon: "ic-user",
    title: "no-data.user.title",
    description: "no-data.user.description",
    buttonText: "no-data.user.button-text",
    buttonIcon: "ic-agenda-+",
    buttonVariant: "warning",
};

const ButtonStyled = styled(Button)(({theme}) => ({
    margin: theme.spacing(1),
    minWidth: 210,

    [theme.breakpoints.down("sm")]: {
        minWidth: 32,
        height: 32,
        //paddingLeft: 8,
        //paddingRight: 8,
        "& .MuiButton-startIcon": {
            margin: 0,
        },
        "& .txt": {
            display: "none",
        },
    },
}));

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        align: "left",
        sortable: true,
    },
    {
        id: "fonction",
        numeric: false,
        disablePadding: false,
        label: "fonction",
        align: "center",
        sortable: true,
    },
    {
        id: "status",
        numeric: false,
        disablePadding: false,
        label: "request",
        align: "center",
        sortable: true,
    },
    {
        id: "admin",
        numeric: false,
        disablePadding: false,
        label: "accessSetting",
        align: "center",
        sortable: true,
    },
    {
        id: "access",
        numeric: true,
        disablePadding: false,
        label: "access",
        align: "center",
        sortable: true,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: false,
        label: "action",
        align: "center",
        sortable: false,
    },
];

function Users() {
    const router = useRouter();
    const {data: session} = useSession();
    const {addUser} = useAppSelector(tableActionSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpUsersResponse} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/users/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
    });

    const users = (httpUsersResponse as HttpResponse)?.data as UserModel[];

    const [edit, setEdit] = useState(false);
    const [selected, setSelected] = useState<any>("");

    const handleChange = (props: any) => {

    };

    const onDelete = (props: any) => {

    };

    const {t, ready} = useTranslation("settings", {
        keyPrefix: "users.config",
    });

    if (!ready) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>

                <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {
                        router.push(`/dashboard/settings/users/new`);
                    }}
                    color="success">
                    {t("add")}
                </Button>
            </SubHeader>
            <Box className="container">
                {users && users.length > 0 ? (
                    <Otable
                        headers={headCells}
                        rows={users}
                        state={null}
                        from={"users"}
                        t={t}
                        edit={onDelete}
                        handleConfig={null}
                        handleChange={handleChange}
                    />
                ) : (
                    <NoDataCard t={t} ns={"settings"} data={CardData}/>
                )}
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings",
        ])),
    },
});

export default Users;

Users.auth = true;

Users.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
