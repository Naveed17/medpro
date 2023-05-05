import React, { ReactElement, useEffect, useState } from "react";
import { DashLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { configSelector } from "@features/base";
import { SubHeader } from "@features/subHeader";
import { RootStyled } from "@features/toolbar";
import { Box, Button, Stack, Drawer,useMediaQuery,Theme } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Otable, resetUser } from "@features/table";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { tableActionSelector } from "@features/table";
import { NoDataCard } from "@features/card";
import { useRequest } from "@app/axios";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { LoadingScreen } from "@features/loadingScreen";
import IconUrl from "@themes/urlIcon";
import { AccessMenage } from "@features/drawer";

const CardData = {
  mainIcon: "ic-user",
  title: "no-data.user.title",
  description: "no-data.user.description",
  buttonText: "no-data.user.button-text",
  buttonIcon: "ic-agenda-+",
  buttonVariant: "warning",
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
  const { data: session } = useSession();
  const [users,setUsers] = useState<UserModel[]>([]);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery((theme:Theme)=>theme.breakpoints.down('md'));
  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
  const { data: httpUsersResponse}= useRequest({
    method: "GET",
    url: `/api/medical-entity/${medical_entity.uuid}/users/${router.locale}${!isMobile ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true`: `?sort=true`}`,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

useEffect(() => {
        if (httpUsersResponse)
            setUsers((httpUsersResponse as HttpResponse)?.data as UserModel[])
    }, [httpUsersResponse])
  const { direction } = useAppSelector(configSelector);
  const [open, setOpen] = useState(false);
  const handleChange = (props: any) => {};
  const closeDraw = () => {
    setOpen(false);
  };
  const onDelete = (props: any) => {
    console.log(props);
  };

  const { t, ready } = useTranslation("settings", {
    keyPrefix: "users.config",
  });
  if (!ready)
    return (
      <LoadingScreen
        error
        button={"loading-error-404-reset"}
        text={"loading-error"}
      />
    );

  return (
    <>
      <SubHeader>
        <RootStyled>
          <p style={{ margin: 0 }}>{t("path")}</p>
        </RootStyled>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            onClick={() => setOpen(true)}
            startIcon={<IconUrl path="ic-setting" />}
            variant="contained">
            {t("access_management")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              dispatch(resetUser());
              router.push(`/dashboard/settings/users/new`);
            }}
            color="success">
            {t("add")}
          </Button>
        </Stack>
      </SubHeader>
      <Box className="container">
        {users && users.length > 0 ? (
          <Otable
            headers={headCells}
            rows={users}
            from={"users"}
            {...{ t, handleChange }}
            edit={onDelete}
          />
        ) : (
          <NoDataCard t={t} ns={"settings"} data={CardData} />
        )}
      </Box>
      <Drawer
        PaperProps={{
          sx: {
            maxWidth: 650,
            width: "100%",
          },
        }}
        anchor={"right"}
        open={open}
        dir={direction}
        onClose={closeDraw}>
        <AccessMenage t={t} />
      </Drawer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => ({
  props: {
    fallback: false,
    ...(await serverSideTranslations(context.locale as string, [
      "common",
      "menu",
      "patient",
      "settings",
    ])),
  },
});

export default Users;

Users.auth = true;

Users.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
