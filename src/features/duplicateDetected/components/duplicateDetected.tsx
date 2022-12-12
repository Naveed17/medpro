import React, {ChangeEvent, useState} from "react";
import {useTranslation} from "next-i18next";
import {
    Box,
    List
} from "@mui/material";
//utils
import RootStyled from "./overrides/rootStyled";
import {LoadingScreen} from "@features/loadingScreen";
import {FormikProvider, Form, useFormik} from "formik";
import {DuplicatedRow, duplicatedSelector, setDuplicated} from "@features/duplicateDetected";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";

function DuplicateDetected({...props}) {
    const {data: duplicatedPatients, translationKey = "patient"} = props;
    const dispatch = useAppDispatch();
    const {fields: duplicatedFields, patient} = useAppSelector(duplicatedSelector);
    const [selectedValue, setSelectedValue] = useState<string>("1");
    const [fields, setFields] = useState<string[]>(duplicatedFields);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: (patient ? patient : duplicatedPatients[0]) as PatientImportModel,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            console.log(values);
        },
    });

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        resetForm
    } = formik;

    const handleChangeColumn = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };

    const handleChangeFiled = (event: ChangeEvent<HTMLInputElement>) => {
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
            const updatedFieldIndex = parseInt(name.split("-")[1]);
            setFieldValue(updatedFieldName, duplicatedPatients[updatedFieldIndex][updatedFieldName]);
            updatedPatient = {...values, [updatedFieldName]: duplicatedPatients[updatedFieldIndex][updatedFieldName]};
        }

        dispatch(setDuplicated({fields: updatedFields, patient: updatedPatient}));
    };

    const {t, ready} = useTranslation(translationKey, {keyPrefix: "config"});

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <RootStyled>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Box className="modal-body">
                        <List className="list-main">
                            <DuplicatedRow {...{t, fields}} index={"init"} modalData={values}/>
                            {duplicatedPatients.map((duplicated: any, index: number) =>
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
