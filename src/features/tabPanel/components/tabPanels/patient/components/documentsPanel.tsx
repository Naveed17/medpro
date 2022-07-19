import React from "react";
import { useTranslation } from "next-i18next";

// material
import {
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";

//components
import { PatientDetailsDocumentCard } from "@features/card";
import { Otable } from "@features/table";
import { uniqueId } from "lodash";

const typeofDocs = ["report", "orders", "analysis", "prescription"];

// interface
interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
  align: "left" | "right" | "center";
}
// table head data
const headCells: readonly HeadCell[] = [
  {
    id: "documents",
    numeric: false,
    disablePadding: true,
    label: "documents",
    align: "left",
    sortable: true,
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: true,
    label: "created-at",
    align: "left",
    sortable: true,
  },
  {
    id: "createdBy",
    numeric: false,
    disablePadding: true,
    label: "created-by",
    align: "left",
    sortable: true,
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "action",
    align: "right",
    sortable: false,
  },
];

const rows: PatientDocuments[] = [
  {
    id: 1,
    name: "Nom du document",
    firstName: "Hassen",
    lastName: "Marzouki",
    img: null,
    type: "ordonnances",
    createdAt: "19 Mars 2021",
    createdBy: "Interne",
    specialist: null,
  },
  {
    id: 2,
    name: "Nom du document",
    firstName: "Nadine",
    lastName: "Marzouki",
    img: null,
    type: "analysis",
    createdAt: "19 Mars 2021",
    createdBy: "Interne",
    specialist: null,
  },
  {
    id: 3,
    name: "Nom du document",
    firstName: "Hassen",
    lastName: "Marzouki",
    img: null,
    type: "orders",
    createdAt: "19 Mars 2021",
    createdBy: "Mohamed ALi",
    specialist: null,
  },
  {
    id: 4,
    name: "Nom du document",
    firstName: null,
    lastName: null,
    img: null,
    type: "report",
    createdAt: "19 Mars 2021",
    createdBy: "Dr Salma BEN SALAH",
    specialist: "Dermatologue",
  },
  {
    id: 5,
    name: "Nom du document",
    firstName: "Hasssen",
    lastName: "Marzouki",
    img: null,
    type: "prescription",
    createdAt: "19 Mars 2021",
    createdBy: "Interne",
    specialist: null,
  },
];
function DocumentsPanel() {
  // filter checked array
  const [checked, setChecked] = React.useState<PatientDocuments[]>([]);

  // handle change for checkboxes
  const handleToggle =
    (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const filtered = rows.filter((item) => item.type === value);
        if (rows.length === checked.length) {
          setChecked([...filtered]);
        } else {
          setChecked([...checked, ...filtered]);
        }
      } else {
        const filtered = checked.filter((item) => item.type !== value);
        setChecked([...filtered]);
      }
    };

  //  handleclick all
  const handleCheckAll = () => {
    if (rows.length === checked.length) {
      setChecked([]);
    } else {
      setChecked([...rows]);
    }
  };

  // query media for mobile
  const isMobile = useMediaQuery("(max-width:600px)");

  // translation
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "config",
  });

  if (!ready) return <>loading translations...</>;

  return (
    <Card
      sx={{
        tbody: {
          mt: 1,
        },
      }}
    >
      <CardContent>
        <Typography gutterBottom>{t("table.title")}</Typography>
        {isMobile ? (
          <PatientDetailsDocumentCard
            data={["all", ...typeofDocs].map((item) => ({
              lable: item,
            }))}
            onSellected={(v: string) =>
              setChecked(
                v === "all" ? rows : rows.filter((item) => item.type === v)
              )
            }
          />
        ) : (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked.length === rows.length}
                  onChange={handleCheckAll}
                />
              }
              label={t("table.all")}
            />
            {typeofDocs.map((type) => (
              <FormControlLabel
                key={uniqueId()}
                control={
                  <Checkbox
                    checked={
                      checked.length === rows.length
                        ? false
                        : checked.some((item) => item.type === type)
                    }
                    onChange={handleToggle(type)}
                  />
                }
                label={t(`table.${type}`)}
              />
            ))}
          </>
        )}

        <Otable
          headers={headCells}
          rows={rows}
          state={null}
          from={"patient-documents"}
          t={t}
          edit={null}
          checkedType={checked}
          handleConfig={null}
          handleChange={null}
          pagination
          hideHeaderOnMobile
        />
      </CardContent>
    </Card>
  );
}
export default DocumentsPanel;
