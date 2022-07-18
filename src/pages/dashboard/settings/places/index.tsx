import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {Box, Button, DialogActions, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {Otable} from "@features/table";
import useRequest from "@app/axios/axiosServiceApi";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {useAppSelector} from "@app/redux/hooks";
import {LatLngBoundsExpression} from "leaflet";

const Maps = dynamic(() => import("@features/maps/components/maps"), {
    ssr: false,
});

function Lieux() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const router = useRouter();

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const [rows, setRows] = useState<MedicalEntityLocationModel[]>([])
    const [selected, setSelected] = useState<any>();
    const [cords, setCords] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [outerBounds, setOuterBounds] = useState<LatLngBoundsExpression>([]);

    const {data} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/locations/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {direction} = useAppSelector(configSelector);

    const dialogClose = () => {
        setOpen(false);
    };

    const dialogSave = () => {
        setOpen(false);
    }

    useEffect(() => {
        if (data !== undefined) {
            setRows((data as any).data);
        }
    }, [data])

    useEffect(() => {
        const actives: any[] = [];
        const bounds:any[] = []
        rows.filter((row: MedicalEntityLocationModel) => row.isActive).map((cord) => {
            actives.push({name: (cord.address as any).location.name, points: (cord.address as any).location.point});
            bounds.push((cord.address as any).location.point);
        });
        setOuterBounds(bounds);

        setCords([...actives]);
    }, [rows])

    const {t, ready} = useTranslation("settings", {
        keyPrefix: "lieux.config",
    });
    if (!ready) return <>loading translations...</>;

    const headCells = [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "name",
            align: "left",
            sortable: false,
        },
        {
            id: "actif",
            numeric: false,
            disablePadding: true,
            label: "actif",
            align: "center",
            sortable: false,
        },
        /* {
           id: "agenda",
           numeric: false,
           disablePadding: true,
           label: "sharedCalander",
           align: "center",
           sortable: true,
         },*/
        {
            id: "action",
            numeric: false,
            disablePadding: true,
            label: "action",
            align: "center",
            sortable: false,
        },
    ];

    const editPlaces = (props: any) => {
        console.log("edit", props);
    };
    const handleConfig = (props: any, event: string) => {
        console.log("handleConfig", event);
    };

    const handleChange = (props: any, event: string) => {
        if (event == 'active') {
            props.isActive = !props.isActive;
            setRows([...rows]);
        } else if (event === 'remove') {
            setSelected({
                title: t('askRemove'),
                subtitle: t('subtitleRemove'),
                icon: "/static/icons/ic-pin.svg",
                name1: props.address.location.name,
                name2: props.address.street,
                data: props
            })
            setOpen(true);
        } else if (event === 'edit') {
            console.log(props)
            router.push({
                pathname: `/dashboard/settings/places/${props.uuid}`,
                // query: props
            });
        }
    };

    return (
        <>
            <SubHeader>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Typography color="text.primary">
                        {t("path")}
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            router.push(`/dashboard/settings/places/new`);
                        }}
                        sx={{ml: "auto"}}
                    >
                        {t("add")}
                    </Button>
                </Stack>
            </SubHeader>
            <Box
                bgcolor="#F0FAFF"
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>

                <Otable
                    headers={headCells}
                    rows={rows}
                    state={null}
                    from={"lieux"}
                    t={t}
                    editMotif={editPlaces}
                    handleConfig={handleConfig}
                    handleChange={handleChange}
                />

                <Dialog action={"remove"}
                        open={open}
                        data={selected}
                        direction={direction}
                        color={'#E83B68'}
                        title={t('remove')}
                        t={t}
                        actionDialog={
                            <DialogActions>
                                <Button onClick={dialogClose}
                                        startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                                <Button variant="contained"
                                        sx={{backgroundColor: '#E83B68'}}
                                        onClick={dialogSave}>{t('table.remove')}</Button>
                            </DialogActions>
                        }
                />


                {
                    rows.length > 0 &&
                    <Maps data={cords}
                          outerBounds={outerBounds}
                          draggable={false}/>
                }
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})
export default Lieux;

Lieux.auth = true;

Lieux.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
