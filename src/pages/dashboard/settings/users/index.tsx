import React, {ReactElement, useState} from "react";
import DashLayout from "@features/base/components/dashLayout/dashLayout";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/calendarToolbar";
import { Box, Button } from "@mui/material";
import {useTranslation} from "next-i18next";
import {Otable} from "@features/table";
import IconUrl from "@themes/urlIcon";
import {styled} from "@mui/material/styles";
import {useRouter} from "next/router";

const  ButtonStyled = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    minWidth: 210,

    [theme.breakpoints.down("sm")]: {
        minWidth: 32,
        height:32,
        //paddingLeft: 8,
        //paddingRight: 8,
        "& .MuiButton-startIcon": {
            margin: 0
        },
        "& .txt":{
            display: "none"
        },
    }

}));
function Users() {
    const router = useRouter();

    const [edit, setEdit] = useState(false);
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Rhouma BHA',
            email: 'rhoumabhat@mail.com',
            fonction: 'Practitioner',
            speciality:'Dermatologist',
            status: 'En attente',
            bg:'#FFD400',
            color:'#000',
            settings: false,
            access: '2',
        },
        {
            id: 2,
            name: 'Hassen Ounelli',
            email: 'houssemouelli@mail.com',
            fonction: 'Practitioner',
            speciality:'Dermatologist',
            status: 'Accepté',
            bg:'#1BC47D',
            color:'#FFF',
            settings: true,
            access: '1',
        },
        {
            id: 3,
            name: 'Sarra Bent',
            email: 'sarrabent@mail.com',
            fonction: 'Secretary',
            speciality:'',
            status: 'Accepté',
            bg:'#1BC47D',
            color:'#FFF',
            settings: false,
            access: '2',
        },
    ]);
    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);

    const closeDraw = () =>{
        setEdit(false);
    }

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: t('substitute.name'),
            align: 'left',
            sortable: true,
        },
        {
            id: 'fonction',
            numeric: false,
            disablePadding: false,
            label: t('substitute.fonction'),
            align: 'center',
            sortable: true
        },
        {
            id: 'resquest',
            numeric: false,
            disablePadding: false,
            label: t('substitute.request'),
            align: 'center',
            sortable: true
        },
        {
            id: 'accessSettings',
            numeric: false,
            disablePadding: false,
            label: t('users.accessSetting'),
            align: 'center',
            sortable: true
        },
        {
            id: 'access',
            numeric: true,
            disablePadding: false,
            label: t('substitute.access'),
            align: 'center',
            sortable: true
        },
        {
            id: 'action',
            numeric: false,
            disablePadding: false,
            label: t('substitute.action'),
            align: 'center',
            sortable: false
        },
    ];

    const handleChange = (props: any) => {
        const index = rows.findIndex(r => r.id === props.id);
        rows[index].settings = !props.settings;
        console.log(props);
        setRows([...rows])
    }

    return(
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('users.path')}</p>
                </RootStyled>

                <ButtonStyled type='submit'
                        variant="contained"
                        startIcon={<IconUrl path='ic-setting'/> }
                        onClick={() => {
                            setEdit(true);
                        }}
                        color="primary">
                    <span className="txt">{t('users.manageAccess')}</span>
                </ButtonStyled>
                <Button type='submit'
                        variant="contained"
                        onClick={() => {
                            router.push(`/dashboard/settings/users/new`);
                        }}
                        color="success">
                    {t('lieux.add')}
                </Button>
            </SubHeader>

            <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <Otable headers={headCells}
                        rows={rows}
                        state={null}
                        from={'users'}
                        t={t}
                        edit={null}
                        handleConfig={null}
                        handleChange={handleChange}/>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})


export default Users

Users.auth = true;

Users.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
