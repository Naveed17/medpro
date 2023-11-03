import {Checkbox, FormControl, InputLabel, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {FilterContainerStyles} from "@features/leftActionBar";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {Accordion} from "@features/accordion";
import {SidebarCheckboxStyled} from "@features/sidebarCheckbox";
import DefaultCircleIcon from "@themes/overrides/icons/defaultCircleIcon";
import CancelCircleIcon from "@themes/overrides/icons/cancelCircleIcon";
import ConfirmCircleIcon from "@themes/overrides/icons/confirmCircleIcon";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Docs() {
    const {t, ready} = useTranslation(["docs"]);

    const handleSearchChange = (search: string) => {

    }

    const handleOnClick = () => {

    }

    const handlePatientSearch = () => {

    }
    const [name, setName] = useState("");
    const [docTypes, setDocTypes] = useState([
        {
            key: "PENDING",
            label: "pending",
            icon: <DefaultCircleIcon/>,
        },
        {
            key: "FINISHED",
            label: "finish",
            icon: <ConfirmCircleIcon/>,
        },
        {
            key: "CANCELED",
            label: "failed",
            icon: <CancelCircleIcon/>,
        }
    ]);
    const [dataPatient, setDataPatient] = useState([
        {
            heading: {
                id: 'title',
                title: 'filter.caption',
            },
            expanded: true,
            children: (
                <>
                    <InputLabel shrink>
                        {t(`filter.name`)}
                    </InputLabel>
                    <FormControl
                        component="form"
                        fullWidth
                        onSubmit={e => e.preventDefault()}>
                        <TextField
                            fullWidth
                            value={name}
                            onChange={event => setName(event.target.value)}
                            placeholder={t(`filter.name-placeholder`)}
                        />
                    </FormControl>


                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`filter.status`)}
                    </InputLabel>

                    {docTypes.map(type => <SidebarCheckboxStyled
                        key={type.key}
                        component="label"
                        htmlFor={type.key}
                        sx={{
                            "& .MuiSvgIcon-root": {
                                width: 16,
                                height: 16,
                            },
                        }}
                        styleprops={""}>
                        <Checkbox
                            size="small"
                            onChange={(event) => {

                            }}
                            name={type.key}
                        />
                        {type.icon}
                        <Typography ml={1}>{t(`doc-status.${type.label}`)}</Typography>
                    </SidebarCheckboxStyled>)}
                </>
            )
        }
    ]);

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <FilterContainerStyles>
                <Typography
                    variant={"h6"}
                    color="text.primary"
                    sx={{py: 1.48, pl: "10px", mb: "0.21em"}}
                    gutterBottom>
                    {t(`filter.sub-title`)}
                </Typography>
                <Accordion
                    translate={{t, ready}}
                    data={dataPatient}
                    setData={setDataPatient}
                />
            </FilterContainerStyles>
        </>
    )
}

export default Docs;
