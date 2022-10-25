import React, { ReactElement, useEffect, useState } from "react";
import { DashLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import { RootStyled } from "@features/toolbar";
import { Box, Button } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Otable } from "@features/table";
import IconUrl from "@themes/urlIcon";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useAppSelector } from "@app/redux/hooks";
import { tableActionSelector } from "@features/table";
const ButtonStyled = styled(Button)(({ theme }) => ({
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
function Users() {
  const router = useRouter();
  const { addUser } = useAppSelector(tableActionSelector);
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<any>("");
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Rhouma BHA",
      email: "rhoumabhat@mail.com",
      fonction: "Practitioner",
      speciality: "Dermatologist",
      status: "En attente",
      bg: "warning",
      admin: false,
      access: "2",
    },
    {
      id: 2,
      name: "Hassen Ounelli",
      email: "houssemouelli@mail.com",
      fonction: "Practitioner",
      speciality: "Dermatologist",
      status: "Accepté",
      bg: "success",
      admin: true,
      access: "1",
    },
    {
      id: 3,
      name: "Sarra Bent",
      email: "sarrabent@mail.com",
      fonction: "Secretary",
      speciality: "",
      status: "Accepté",
      bg: "success",
      admin: false,
      access: "2",
    },
  ]);

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
  useEffect(() => {
    setRows([...rows, ...addUser]);
  }, []);
  const handleChange = (props: any) => {
    const index = rows.findIndex((r) => r.id === props.id);
    rows[index].admin = !props.admin;
    setRows([...rows]);
  };
  const onDelete = (props: any) => {
    const filtered = rows.filter((item: any) => item.id !== props.id);
    setRows(filtered);
  };
  const { t, ready } = useTranslation("settings", {
    keyPrefix: "users.config",
  });
  if (!ready) return <>loading translations...</>;

  return (
    <>
      <SubHeader>
        <RootStyled>
          <p style={{ margin: 0 }}>{t("path")}</p>
        </RootStyled>

        <ButtonStyled
          type="submit"
          variant="contained"
          startIcon={<IconUrl path="ic-setting" />}
          onClick={() => {
            setEdit(true);
          }}
          color="primary">
          <span className="txt">{t("manageAccess")}</span>
        </ButtonStyled>
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
        <Otable
          headers={headCells}
          rows={rows}
          state={null}
          from={"users"}
          t={t}
          edit={onDelete}
          handleConfig={null}
          handleChange={handleChange}
        />
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
