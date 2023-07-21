import React, {ChangeEvent, useState} from "react";
import {useTranslation} from "next-i18next";
import {
    Box,
    List
} from "@mui/material";
//utils
import RootStyled from "./overrides/rootStyled";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {FormikProvider, Form, useFormik} from "formik";
import {DuplicatedRow, duplicatedSelector, setDuplicated} from "@features/duplicateDetected";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";

function DuplicateDetected({...props}) {
    const {data: duplicatedPatients, translationKey = "patient"} = props;
    const dispatch = useAppDispatch();
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

    const {t, ready} = useTranslation(translationKey, {keyPrefix: "config"});

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <RootStyled>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Box className="modal-body">
                        <List className="list-main">
                            <DuplicatedRow {...{t, fields}} index={"init"} modalData={values}/>
                            {duplicatedData.map((duplicated: any, index: number) =>
                                <DuplicatedRow {...{index, t, fields, handleChangeFiled, handleSelectedDuplication}}
                                               key={index}
                                               modalData={duplicated}/>)}
                        </List>
                    </Box>
                </Form>
            </FormikProvider>
        </RootStyled>
    );
}

export default React.memo(DuplicateDetected);
