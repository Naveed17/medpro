import React, {ChangeEvent, useState} from "react";
import {useTranslation} from "next-i18next";
import {
    Box, Drawer,
    List,
} from "@mui/material";
//utils
import RootStyled from "./overrides/rootStyled";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {FormikProvider, Form, useFormik} from "formik";
import {DuplicatedRow, duplicatedSelector, setDuplicated} from "@features/duplicateDetected";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {onOpenPatientDrawer} from "@features/table";
import {configSelector} from "@features/base";
import {dialogPatientDetailSelector, PatientDetail, resetDialog, setDialogData} from "@features/dialog";
import {styled} from "@mui/material/styles";

const PatientDrawer = styled(Drawer)(({theme}) => ({
    zIndex: 1350
}));

function DuplicateDetected({...props}) {
    const {data: duplicatedPatients, translationKey = "patient"} = props;
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation(translationKey, {keyPrefix: "config"});
    const {direction} = useAppSelector(configSelector);
    const {open: patientDetailDrawer, uuid: patientId} = useAppSelector(dialogPatientDetailSelector);

    const {fields: duplicatedFields, duplicationSrc, duplicationInit} = useAppSelector(duplicatedSelector);
    const [fields, setFields] = useState<string[]>(duplicatedFields as string[]);
    const [duplicatedData, setDuplicatedData] = useState<any[]>(duplicatedPatients);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: duplicationSrc as PatientModel,
        onSubmit: async (values) => {
            console.log(values);
        },
    });

    const {
        values,
        handleSubmit,
        setFieldValue,
    } = formik;

    const handleSelectedDuplication = (event: ChangeEvent<HTMLInputElement>, data: PatientModel) => {
        const duplicatedDataUpdated = duplicatedData.map(duplicated => data.uuid === duplicated.uuid ? {
            ...duplicated,
            checked: event.target.checked
        } : duplicated);

        setDuplicatedData(duplicatedDataUpdated);
        dispatch(setDuplicated({duplications: duplicatedDataUpdated}));
    }

    const handleChangeFiled = (event: ChangeEvent<HTMLInputElement>, data: PatientModel) => {
        const {name, checked} = event.target;
        const filteredFields = [...fields];
        const checkedFiled = filteredFields.findIndex((el) => el.includes(name.split("-")[0]));
        if (checkedFiled !== -1) {
            filteredFields.splice(checkedFiled, 1)
        }
        const updatedFields = checked ? [...filteredFields, name] : fields.filter((el) => el !== name)
        setFields(updatedFields);

        let updatedPatient = values;
        const updatedFieldName = name.split("-")[0];
        if (checked) {
            setFieldValue(updatedFieldName, data[updatedFieldName as keyof typeof data]);
            updatedPatient = {...values, [updatedFieldName]: data[updatedFieldName as keyof typeof data]};
        } else {
            setFieldValue(updatedFieldName, (duplicationInit as PatientModel)[updatedFieldName as keyof typeof duplicationInit]);
            updatedPatient = {
                ...values,
                [updatedFieldName]: (duplicationInit as PatientModel)[updatedFieldName as keyof typeof duplicationInit]
            };
        }
        dispatch(setDuplicated({fields: updatedFields, duplicationSrc: updatedPatient}));
    };


    const handlePatientRef = (id: string) => {
        dispatch(setDialogData({open: true, uuid: id}));
    }

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <RootStyled>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Box className="modal-body">
                        <List className="list-main">
                            <DuplicatedRow {...{t, fields, handlePatientRef}} index={"init"} modalData={values}/>
                            {duplicatedData.map((duplicated: any, index: number) =>
                                <DuplicatedRow
                                    {...{
                                        index,
                                        t,
                                        fields,
                                        handleChangeFiled,
                                        handleSelectedDuplication,
                                        handlePatientRef
                                    }}
                                    key={index}
                                    modalData={duplicated}/>)}
                        </List>
                    </Box>
                </Form>
            </FormikProvider>
            <PatientDrawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    dispatch(resetDialog());
                }}>
                <PatientDetail
                    {...{isAddAppointment: false, patientId}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        dispatch(resetDialog());
                    }}
                    onAddAppointment={() => console.log("onAddAppointment")}
                />
            </PatientDrawer>
        </RootStyled>
    );
}

export default React.memo(DuplicateDetected);
