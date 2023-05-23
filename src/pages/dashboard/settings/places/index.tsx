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
import {useRequest, useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {useAppSelector} from "@lib/redux/hooks";
import {LatLngBoundsExpression} from "leaflet";
import {Theme} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";
import {LoadingScreen} from "@features/loadingScreen";
import {DefaultCountry} from "@lib/constants";
import {useMedicalEntitySuffix} from "@lib/hooks";

const Maps = dynamic(() => import("@features/maps/components/maps"), {
    ssr: false,
});

function Lieux() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const router = useRouter();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);

    const [rows, setRows] = useState<MedicalEntityLocationModel[]>([])
    const [selected, setSelected] = useState<any>();
    const [cords, setCords] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [outerBounds, setOuterBounds] = useState<LatLngBoundsExpression>([]);

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
             id: "default",
             numeric: false,
             disablePadding: true,
             label: "default",
             align: "center",
             sortable: false,
         },*/
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

    const {data, mutate} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/locations/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {trigger} = useRequestMutation(null, "/settings/places");

    const {direction} = useAppSelector(configSelector);

    const dialogClose = () => {
        setOpen(false);
    };

    const dialogSave = () => {
        setLoading(true);
        trigger(selected.request, {revalidate: true, populateCache: true}).then(() => {
            mutate().then(r => {
                setOpen(false);
                setLoading(false);
                console.log('place removed successfully', r);
            });
        });
    }

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
            const form = new FormData();
            form.append('attribute', JSON.stringify({attribute: 'is_active', value: props.isActive}));
            trigger({
                method: "PATCH",
                url: `${urlMedicalEntitySuffix}/locations/${props.uuid}`,
                headers: {Authorization: `Bearer ${session?.accessToken}`},
                data: form
            });
        } else if (event === 'remove') {
            setSelected({
                title: t('askRemove'),
                subtitle: t('subtitleRemove'),
                icon: "/static/icons/ic-pin.svg",
                name1: props.address.location.name,
                name2: props.address.street,
                data: props,
                request: {
                    method: "DELETE",
                    url: `${urlMedicalEntitySuffix}/locations/${props.uuid}`,
                    headers: {Authorization: `Bearer ${session?.accessToken}`}
                }
            })
            setOpen(true);
        } else if (event === 'edit') {
            router.push({
                pathname: `/dashboard/settings/places/${props.uuid}`,
            }).then(() => {
            });
        } else if (event === 'default') {
            props.isDefault = !props.isDefault;
            setRows([...rows]);
        }
    };

    useEffect(() => {
        if (data !== undefined) {
            setRows((data as any).data);
        }
    }, [data])

    useEffect(() => {
        const actives: any[] = [];
        const bounds: any[] = []
        rows.filter((row: MedicalEntityLocationModel) => row.isActive).map((cord) => {
            actives.push({name: (cord.address as any).location.name, points: (cord.address as any).location.point});
            if ((cord.address as any).location.point)
                bounds.push((cord.address as any).location.point);
        });
        navigator.geolocation.getCurrentPosition(function (position) {
            bounds.push([position.coords.latitude, position.coords.longitude]);
        });
        setOuterBounds(bounds);
        setCords([...actives]);
    }, [rows])

    const {t, ready} = useTranslation("settings", {
        keyPrefix: "lieux.config",
    });

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

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
                    {/* <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            router.push(`/dashboard/settings/places/new`).then(() => {
                            });
                        }}
                        sx={{ml: "auto"}}>
                        {t("add")}
                    </Button>*/}
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
                        color={(theme: Theme) => theme.palette.error.main}
                        title={t('remove')}
                        t={t}
                        actionDialog={
                            <DialogActions>
                                <Button onClick={dialogClose}
                                        startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                                <LoadingButton variant="contained"
                                               loading={loading}
                                               sx={{backgroundColor: (theme: Theme) => theme.palette.error.main}}
                                               onClick={dialogSave}>{t('table.remove')}</LoadingButton>
                            </DialogActions>
                        }
                />


                {(doctor_country?.code !== "ma" && rows.length > 0) &&
                    <Maps data={cords}
                          outerBounds={outerBounds}
                          draggable={false}/>}
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', "patient", 'settings']))
    }
})
export default Lieux;

Lieux.auth = true;

Lieux.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
