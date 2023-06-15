import * as Yup from "yup";
import {Form, useFormik} from "formik";
import {Box,} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {useRequestMutation} from "@lib/axios";
import PreviewA4 from "@features/files/components/previewA4";
import {useSnackbar} from "notistack";
function PrescriptionModelDrawer({...props}) {
    const {data: session} = useSession();
    const router = useRouter();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();

    const {data, action, isdefault} = props;
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation("settings", {keyPrefix: "templates.config.dialog"});

    const {trigger} = useRequestMutation(null, "/settings/certifModel");

    const [modelColor, setModelColor] = useState(data ? data.color : "#FEBD15");
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, t("nameReq"))
            .max(50, t("ntl"))
            .required(t("nameReq")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: data ? (data.title as string) : "",
            content: data ? (data.content as string) : "",
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log(values);

            const form = new FormData();
            form.append('content', values.content);
            form.append('color', modelColor);
            form.append('title', values.title);
            let url = `${urlMedicalProfessionalSuffix}/certificate-modals/${router.locale}`
            if (data)
                url = `${urlMedicalProfessionalSuffix}/certificate-modals/${data.uuid}/${router.locale}`
            trigger({
                method: data ? "PUT" : "POST",
                url,
                data: form,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }, {
                revalidate: true,
                populateCache: true
            }).then(() => {
                props.closeDraw();
                props.mutate();
                enqueueSnackbar(t(data ? "updated" : "created"), {variant: 'success'})

            })
        },
    });

    const {
        errors,
        touched,
        handleSubmit,
        setFieldValue,
        getFieldProps,
    } = formik;

    const addVal = (val: string) => {
        (window as any).tinymce.execCommand('mceInsertContent', false, val);
    }

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <Box>
            {action === "showPrescription" ?
                <Box padding={5}>
                    <PreviewA4  {...{
                        eventHandler: null,
                        data: isdefault?.header.data,
                        values: isdefault?.header.header,
                        t,
                        state: {
                            info: data.prescriptionModalHasDrugs,
                            description: "",
                            doctor: "",
                            name: "prescription",
                            patient: "Patient",
                            title: data.name,
                            type: "prescription"
                        },
                        loading
                    }} />
                </Box> :
                <Box></Box>}

        </Box>
    );
}

export default PrescriptionModelDrawer;
