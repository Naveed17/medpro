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
    const {fields: duplicatedFields, duplicationSrc} = useAppSelector(duplicatedSelector);
    const [fields, setFields] = useState<string[]>(duplicatedFields as string[]);
    const [duplicatedData] = useState<any[]>(duplicatedPatients.map((patient: PatientModel) => ({
        ...patient,
        checked: false
    })));

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
        if (checked) {
            const updatedFieldName = name.split("-")[0];
            setFieldValue(updatedFieldName, data[updatedFieldName as keyof typeof data]);
            updatedPatient = {...values, [updatedFieldName]: data[updatedFieldName as keyof typeof data]};
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
                                <DuplicatedRow {...{index, t, fields, handleChangeFiled}} key={index}
                                               modalData={duplicated}/>)}
                        </List>
                    </Box>
                </Form>
            </FormikProvider>
        </RootStyled>
    );
}

export default React.memo(DuplicateDetected);
