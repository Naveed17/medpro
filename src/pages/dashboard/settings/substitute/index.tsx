import React, {ReactElement, useState} from "react";
import {DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {Box, Button, Drawer} from "@mui/material";
import {useTranslation} from "next-i18next";
import {Otable} from "@features/table";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import {SubstituteDetails} from "@features/substituteDetails";
import {LoadingScreen} from "@features/loadingScreen";

function Subtitule() {
    const [edit, setEdit] = useState(false);
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Rhouma BHA',
            email: 'rhoumabhat@mail.com',
            fonction: 'Practitioner',
            speciality: 'Dermatologist',
            status: 'En attente',
            bg: 'warning',
            color: 'white',
            access: '2',
        },
        {
            id: 2,
            name: 'Hassen Ounelli',
            email: 'houssemouelli@mail.com',
            fonction: 'Practitioner',
            speciality: 'Dermatologist',
            status: 'Accepté',
            bg: 'success',
            color: 'white',
            access: '1',
        },
        {
            id: 3,
            name: 'Sarra Bent',
            email: 'sarrabent@mail.com',
            fonction: 'Secretary',
            speciality: '',
            status: 'Accepté',
            bg: 'success',
            color: 'white',
            access: '2',
        },
    ]);
    const {direction} = useAppSelector(configSelector);

    const closeDraw = () => {
        setEdit(false);
    };

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
            id: "resquest",
            numeric: false,
            disablePadding: false,
            label: "request",
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
    const {t, ready} = useTranslation("settings", {
        keyPrefix: "substitute.config",
    });
    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);
    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('path')}</p>
                </RootStyled>

                <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {
                        setEdit(true);
                    }}
                    color="success"
                >
                    {t("add")}
                </Button>
            </SubHeader>

            <Box className="container">
                <Otable headers={headCells}
                        rows={rows}
                        state={null}
                        from={'substitute'}
                        t={t}
                        edit={null}
                        handleConfig={null}
                        handleChange={null}/>

                <Drawer
                    anchor={'right'}
                    open={edit}
                    dir={direction}
                    onClose={closeDraw}>
                    <SubstituteDetails closeDraw={closeDraw}/>
                </Drawer>

            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['settings', 'common', "patient", 'menu']))
    }
})
export default Subtitule;

Subtitule.auth = true;

Subtitule.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
