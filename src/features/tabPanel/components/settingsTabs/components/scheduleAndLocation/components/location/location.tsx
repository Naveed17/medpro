import React, { useEffect, useState } from "react";
import { configSelector } from "@features/base";
import { SubHeader } from "@features/subHeader";
import { Box, Button, DialogActions, Stack, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Otable } from "@features/table";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { Dialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { LatLngBoundsExpression } from "leaflet";
import { Theme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import dynamic from "next/dynamic";

import { LoadingScreen } from "@features/loadingScreen";

import { DefaultCountry } from "@lib/constants";
import { useMedicalEntitySuffix } from "@lib/hooks";
import { CustomIconButton } from "@features/buttons";
import IconUrl from "@themes/urlIcon";
import { editLocation } from "@features/tabPanel";

const Maps = dynamic(() => import("@features/maps/components/maps"), {
  ssr: false,
});

function Lieux() {
  const { data: session } = useSession();
  const { data: user } = session as Session;
  const router = useRouter();
  const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
  const dispatch = useAppDispatch()
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
    {
      id: "action",
      numeric: false,
      disablePadding: true,
      label: "action",
      align: "center",
      sortable: false,
    },
  ];

  const { data, mutate } = useRequestQuery({
    method: "GET",
    url: `${urlMedicalEntitySuffix}/locations/${router.locale}`
  });

  const { trigger: triggerPlacesUpdate } = useRequestQueryMutation("/settings/places/update");

  const { direction } = useAppSelector(configSelector);

  const dialogClose = () => {
    setOpen(false);
  };

  const dialogSave = () => {
    setLoading(true);
    triggerPlacesUpdate(selected.request, {
      onSuccess: () => {
        mutate().then(() => {
          setOpen(false);
          setTimeout(() => setLoading(false));
        });
      }
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
      form.append('attribute', JSON.stringify({ attribute: 'is_active', value: props.isActive }));
      triggerPlacesUpdate({
        method: "PATCH",
        url: `${urlMedicalEntitySuffix}/locations/${props.uuid}`,
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
          url: `${urlMedicalEntitySuffix}/locations/${props.uuid}`
        }
      })
      setOpen(true);
    } else if (event === 'edit') {
      dispatch(editLocation(props))
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
      actives.push({ name: (cord.address as any).location.name, points: (cord.address as any).location.point });
      if ((cord.address as any).location.point)
        bounds.push((cord.address as any).location.point);
    });
    navigator.geolocation.getCurrentPosition(function (position) {
      bounds.push([position.coords.latitude, position.coords.longitude]);
    });
    setOuterBounds(bounds);
    setCords([...actives]);
  }, [rows])

  const { t, ready, i18n } = useTranslation("settings", {
    keyPrefix: "lieux.config",
  });

  useEffect(() => {
    //reload resources from cdn servers
    i18n.reloadResources(i18n.resolvedLanguage, ["settings"]);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return (<LoadingScreen button text={"loading-error"} />);

  return (
    <>
      <Box
        bgcolor="#F0FAFF"
        sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>

        <Otable
          headers={headCells}
          toolbar={
            <Stack
              direction="row"
              justifyContent="space-between"
              width={1}
              mb={3}
              alignItems="center">
              <Typography color="text.primary" variant="subtitle1">
                {t("title")}
              </Typography>
              <CustomIconButton color="primary" sx={{ ml: 'auto' }}>
                <IconUrl path="ic-plus" width={16} height={16} color="white" />
              </CustomIconButton>
            </Stack>
          }
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
                startIcon={<CloseIcon />}>{t('cancel')}</Button>
              <LoadingButton variant="contained"
                loading={loading}
                sx={{ backgroundColor: (theme: Theme) => theme.palette.error.main }}
                onClick={dialogSave}>{t('table.remove')}</LoadingButton>
            </DialogActions>
          }
        />


        {(doctor_country?.code !== "ma" && rows.length > 0) &&
          <Maps data={cords}
            outerBounds={outerBounds}
            draggable={false} />}
      </Box>
    </>
  );
}

export default Lieux;