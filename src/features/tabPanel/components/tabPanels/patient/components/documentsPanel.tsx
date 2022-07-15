import React from "react";
import { Card, CardContent, Typography, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import { uniqueId } from "lodash";
import { useMediaQuery } from "@mui/material";
//components
// import DocumentTable from "./DocumentTable";
// import { CallanderButtonMobile } from "src/components";
import { PatientDetailsDocumentCard } from "@features/card";
import { Otable, PatientDocumentRow } from "@features/table";
import { useTranslation } from "next-i18next";
const RootStyled = styled(Card)(({ theme }) => ({}));
const typeofDocs = [
  "Rapport",
  "Ordonnances",
  "Analyses",
  "Ordonnance de médicaments",
];

// table head data
const headCells: readonly HeadCell[] = [
  {
    id: "select-all",
    numeric: false,
    disablePadding: true,
    label: "checkbox",
    sortable: false,
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "name",
    sortable: true,
    align: "left",
  },
  {
    id: "telephone",
    numeric: true,
    disablePadding: false,
    label: "telephone",
    sortable: true,
    align: "left",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "city",
    sortable: true,
    align: "left",
  },
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "id",
    sortable: true,
    align: "left",
  },
  {
    id: "nextAppointment",
    numeric: false,
    disablePadding: false,
    label: "nextAppointment",
    sortable: false,
    align: "left",
  },
  {
    id: "lastAppointment",
    numeric: false,
    disablePadding: false,
    label: "lastAppointment",
    sortable: false,
    align: "left",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "action",
    sortable: false,
    align: "right",
  },
];

const rows = [
  {
    id: 1,
    name: "Nom du document",
    firstName: "Hassen",
    lastName: "Marzouki",
    img: null,
    type: "Ordonnances",
    createdAt: "19 Mars 2021",
    createdBy: "Interne",
  },
  {
    id: 2,
    name: "Nom du document",
    firstName: "Nadine",
    lastName: "Marzouki",
    img: null,
    type: "Analyses",
    createdAt: "19 Mars 2021",
    createdBy: "Interne",
  },
  {
    id: 3,
    name: "Nom du document",
    firstName: "Hassen",
    lastName: "Marzouki",
    img: null,
    type: "Ordonnances",
    createdAt: "19 Mars 2021",
    createdBy: "Mohamed ALi",
  },
  {
    id: 4,
    name: "Nom du document",
    img: null,
    type: "Rapport",
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
    type: "Ordonnance de médicaments",
    createdAt: "19 Mars 2021",
    createdBy: "Interne",
  },
];
function DocumentsPanel() {
  const [checked, setChecked] = React.useState([]);
  const handleToggle = (value) => (e) => {
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
  const handleCheckAll = () => {
    if (rows.length === checked.length) {
      setChecked([]);
    } else {
      setChecked(rows);
    }
  };

  const isMobile = useMediaQuery("(max-width:600px)");
  const { t, ready } = useTranslation("patient", { keyPrefix: "config" });

  if (!ready) return <>loading translations...</>;

  return (
    <RootStyled>
      <CardContent>
        <Typography gutterBottom>Type de document</Typography>
        {isMobile ? (
          <PatientDetailsDocumentCard
            data={["Tous", ...typeofDocs].map((item) => ({ lable: item }))}
            onSellected={(v) =>
              setChecked(
                v === "Tous" ? rows : rows.filter((item) => item.type === v)
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
              label={"Tous"}
            />
            {typeofDocs.map((type, index) => (
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
                label={type}
              />
            ))}
          </>
        )}

        {/* <DocumentTable checkedType={checked} rows={rows} />  */}
        <Otable
          headers={headCells}
          rows={rows}
          state={null}
          from={"patient"}
          t={t}
          edit={null}
          checkedType={checked}
          handleConfig={null}
          handleChange={null}
          minWidth={1300}
          pagination
          defaultRow={PatientDocumentRow}
        />
      </CardContent>
    </RootStyled>
  );
}
export default DocumentsPanel;
