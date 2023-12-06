import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {useTranslation} from "next-i18next";
import {SettingsTabs} from "@features/tabPanel";
import {Box, Button, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useFormik, Form, FormikProvider} from "formik";
import {
    PractitionerForm,
    ConsultationForm,
    EquipmentForm,
} from "@features/forms";
import {DashLayout} from "@features/base";
import {SubFooter} from "@features/subFooter";

const TabData = [
    {
        icon: "ic-docotor",
        label: "practitioner",
        content: "content-1",
    },
    {
        icon: "ic-salle-tab",
        label: "consultation-room",
        content: "content-2",
    },
    {
        icon: "ic-hosipital-bed",
        label: "equipment-room",
        content: "content-3",
    },
];

function AddAgenda() {
    const [state, setstate] = useState({
        activeTab: null,
        loading: false,
    });
    const formik = useFormik({
        initialValues: {
            practitioner: {
                specialty: "",
                practitioner: "",
                location: "",
                patientBase: "",
                agenda: "",
                rightsOnAgenda: {
                    cloneExistingRights: "",
                    lamiaBarnat: {
                        status: false,
                        value: "",
                    },
                    medicalSecretary: {
                        status: false,
                        value: "",
                    },
                    aliTounsi: {
                        status: false,
                        value: "",
                    },
                },
            },
            consultationRoom: {
                practitioner: {
                    numberOfRooms: "",
                    numberOfAccessesPerRoom: "",
                    specialties: "",
                    type: "",
                    location: "",
                    patientBase: "",
                    agenda: "",
                    rightsOnAgenda: {
                        cloneExistingRights: "",
                        lamiaBarnat: {
                            status: false,
                            value: "",
                        },
                        medicalSecretary: {
                            status: false,
                            value: "",
                        },
                        aliTounsi: {
                            status: false,
                            value: "",
                        },
                    },
                },
                assistant: {
                    specialtyOfPractitioner: "",
                    place: "",
                    patientBase: "",
                    agenda: "",
                    rightsOnAgenda: {
                        cloneExistingRights: "",
                        lamiaBarnat: {
                            status: false,
                            value: "",
                        },
                        medicalSecretary: {
                            status: false,
                            value: "",
                        },
                        aliTounsi: {
                            status: false,
                            value: "",
                        },
                    },
                },
            },
            equipmentRoom: {
                specialties: "",
                type: "",
                place: "",
                patientBase: "",
                pattern: "",
                agenda: "",
                rightsOnAgenda: {
                    cloneExistingRights: "",
                    lamiaBarnat: {
                        status: false,
                        value: "",
                    },
                    medicalSecretary: {
                        status: false,
                        value: "",
                    },
                    aliTounsi: {
                        status: false,
                        value: "",
                    },
                },
            },
        },
        onSubmit: async (values) => {
            setstate({
                ...state,
                loading: true,
            });
            setTimeout(() => {
                setstate({
                    ...state,
                    loading: false,
                });
                console.log("ok", values);
            }, 2000);
        },
    });
    const {handleSubmit} = formik;
    const {t, ready} = useTranslation("settings", {keyPrefix: "addAgenda"});

    if (!ready) return <>Loading Translation...</>;

    return (
        <div className="container">
            <Typography gutterBottom>
                {state.activeTab === 1 || state.activeTab === 2
                    ? t("title-2")
                    : t("title-1")}
            </Typography>
            <SettingsTabs data={TabData} getIndex={setstate} t={t}/>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    {state.activeTab === 0 && <PractitionerForm t={t} formik={formik}/>}
                    {state.activeTab === 1 && <ConsultationForm t={t} formik={formik}/>}
                    {state.activeTab === 2 && <EquipmentForm t={t} formik={formik}/>}
                    <Box pt={8}/>
                    <SubFooter>
                        <Stack
                            width={1}
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            justifyContent="flex-end">
                            <Button variant="text-black">{t("cancel")}</Button>
                            <LoadingButton
                                loading={state.loading}
                                type="submit"
                                variant="contained"
                                disabled={state.activeTab === null}>
                                {t("save")}
                            </LoadingButton>
                        </Stack>
                    </SubFooter>
                </Form>
            </FormikProvider>
        </div>
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

export default AddAgenda;

AddAgenda.auth = true;

AddAgenda.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
