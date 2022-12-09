import React, {ChangeEvent} from "react";
import {useTranslation} from "next-i18next";
import {
    Box,
    List
} from "@mui/material";
//utils
import {RootStyled, DuplicatedRow} from "@features/duplicateDetected";
import {LoadingScreen} from "@features/loadingScreen";
import {FormikProvider, Form, useFormik} from "formik";

function DuplicateDetected({...props}) {
    const {data: duplicatedPatients, translationKey = "patient"} = props;
    const [selectedValue, setSelectedValue] = React.useState<string>("1");
    const [fields, setFields] = React.useState<string[]>([]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {...duplicatedPatients[0]},
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            console.log(values);
        },
    });

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
        setFields(checked ? [...filteredFields, name] : fields.filter((el) => el !== name));
        if (checked) {
            const updatedFieldName = name.split("-")[0];
            const updatedFieldIndex = parseInt(name.split("-")[1]);
            setFieldValue(updatedFieldName, duplicatedPatients[updatedFieldIndex][updatedFieldName]);
        }
    };

    const {t, ready} = useTranslation(translationKey, {keyPrefix: "config"});

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        resetForm
    } = formik;

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

export default DuplicateDetected;
