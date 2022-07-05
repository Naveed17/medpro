import { FormikProvider, Form, useFormik } from "formik";
import {
    Avatar, Box, Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    List, ListItem, ListItemText, MenuItem,
    Radio,
    RadioGroup, Select,
    Stack, TextField,
    Typography
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { MultiSelect } from "@features/multiSelect";
import React, { useState } from "react";
import LabelStyled from "./overrides/labelStyled";
import { CropImage } from "@features/cropImage";
import { InputStyled } from "@features/tabPanel";
import { useTranslation } from "next-i18next";
import useRequest from "@app/axios/axiosServiceApi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LoadingScreen } from "@features/loadingScreen";

type selectMultiple = {
    title: string
}

interface MyFormProps {
    file?: string;
    person: {
        gender: string,
        profession: string,
        firstName: string,
        name: string,
    };
    specialty: SpecialtyModel | string,
    secondarySpecialties: SpecialtyModel[],
    languages: selectMultiple[]
}

const multipleLanguage = [
    { title: "Français" },
    { title: "Anglais" },
    { title: "Espagnol" },
    { title: "Allemand" },
    { title: "Italien" },
    { title: "Russe" },
    { title: "Japonais" },
    { title: "Chinois" },
];

function Info() {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const router = useRouter();
    const { t, ready } = useTranslation('editProfile', { keyPrefix: "steppers.stepper-0" });
    const formik = useFormik<MyFormProps>({
        initialValues: {
            file: "",
            person: {
                gender: "",
                profession: "doc",
                firstName: "",
                name: "",
            },
            specialty: '',
            secondarySpecialties: [],
            languages: [],
        },
        onSubmit: async (values) => {
            console.log(values);
        },
    });
    const { values, handleSubmit, getFieldProps, setFieldValue } = formik;
    const [open, setOpen] = useState(false);

    const [selectData, setSelectData] = useState([multipleLanguage[0]]);

    const { data: httpResponse, error } = useRequest({
        method: "GET",
        url: `/api/public/specialty/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    if (error) return <div>failed to load</div>
    if (!ready || !httpResponse || loading) return (<LoadingScreen />);

    const specialties = (httpResponse as HttpResponse).data as SpecialtyModel[];
    const secondarySpecialties = specialties.slice(10);

    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setFieldValue("file", URL.createObjectURL(file));
        setOpen(true);
    };

    const handleChangeFiled = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name: specialty, checked } = event.target;
        console.log(specialty, checked);
        setFieldValue(
            "secondarySpecialties",
            checked
                ? [...values.secondarySpecialties, secondarySpecialties.find(item => item.uuid === specialty)]
                : values.secondarySpecialties.filter((el) => el.uuid !== specialty)
        );
    };

    return (
        <>
            <FormikProvider value={formik}>
                <Stack
                    spacing={2}
                    component={Form}
                    autoComplete="off"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h6" gutterBottom>
                        {t('sub-title')}
                    </Typography>
                    <Stack
                        spacing={2}
                        direction={{ xs: "column", lg: "row" }}
                        alignItems={{ xs: "center", lg: "stretch" }}
                        sx={{
                            "& > label": {
                                position: "relative",
                                zIndex: 1,
                                cursor: "pointer",
                            },
                        }}
                    >
                        <label htmlFor="contained-button-file">
                            <InputStyled
                                id="contained-button-file"
                                onChange={(e) => handleDrop(e.target.files as FileList)}
                                type="file"
                            />
                            <Avatar
                                src={values.file}
                                sx={{ width: 164, height: 164 }}
                            >
                                <IconUrl path="ic-user-profile" />
                            </Avatar>
                            <IconButton
                                color="primary"
                                type="button"
                                sx={{
                                    position: "absolute",
                                    bottom: 10,
                                    right: 10,
                                    zIndex: 1,
                                    pointerEvents: "none",
                                    bgcolor: `${theme => theme.palette.background.paper}!important`,
                                }}
                            >
                                <IconUrl path="ic-return-photo" />
                            </IconButton>
                        </label>
                        <Stack
                            spacing={2}
                            sx={{
                                width: "100%",
                                "& .MuiBox-root": {
                                    width: "100%",
                                },
                            }}
                            alignSelf="stretch"
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ textAlign: { xs: "center", lg: "left" } }}
                                color="text.primary"
                                fontWeight={600}
                            >
                                {t('info')}
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    row
                                    aria-label="gender"
                                    {...getFieldProps("person.gender")}
                                    sx={{
                                        "& .MuiFormControlLabel-label": {
                                            fontSize: (theme) =>
                                                `${theme.typography.body1.fontSize} !important`,
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        value="Male"
                                        control={<Radio size="small" />}
                                        label={t('genre.man')}
                                    />
                                    <FormControlLabel
                                        value="Female"
                                        control={<Radio size="small" />}
                                        label={t('genre.women')}
                                    />
                                </RadioGroup>
                            </FormControl>
                            <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
                                <Box>
                                    <LabelStyled>{t('pseudo')}</LabelStyled>
                                    <FormControl fullWidth>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id={"profession"}
                                            size="small"
                                            defaultValue={'doc'}
                                            {...getFieldProps("person.profession")}
                                            value={values.person.profession}
                                            placeholder={'choisissez votre titre'}
                                            displayEmpty
                                        >
                                            <MenuItem value="doc">Docteur</MenuItem>
                                            <MenuItem value="prof">Professeur</MenuItem>
                                            <MenuItem value="aucun">Aucun Titre</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box>
                                    <LabelStyled>{t('firstname')}</LabelStyled>
                                    <TextField
                                        variant="outlined"
                                        placeholder=" "
                                        size="small"
                                        fullWidth
                                        {...getFieldProps("person.firstName")}
                                    />
                                </Box>
                                <Box>
                                    <LabelStyled>{t('lastname')}</LabelStyled>
                                    <TextField
                                        variant="outlined"
                                        placeholder=" "
                                        size="small"
                                        fullWidth
                                        {...getFieldProps("person.name")}
                                    />
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Box sx={{ mt: "40px !important" }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                            {t('specialty')}
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id={"specialty"}
                                defaultValue=""
                                size="small"
                                {...getFieldProps("specialty")}
                                value={values.specialty}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em>Choisissez votre spécialité</em>;
                                    }

                                    return specialties.find(specialty => specialty.uuid === selected)?.name;
                                }}
                                className="select-specialty"
                            >
                                {specialties.map(specialty => <MenuItem key={specialty.uuid} value={specialty.uuid}>{specialty.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: "22px !important" }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight={600}>
                            {t('specialty-sec')}
                        </Typography>
                        <List dense={true} sx={{ display: "flex", flexWrap: "wrap" }}>
                            {secondarySpecialties.map((el, index) => (
                                <ListItem
                                    key={`secondarySpecialties-${index}`}
                                    sx={{
                                        width: secondarySpecialties.length > 3 ? "50%" : "100%",
                                        px: { xs: "0", lg: "1rem" },
                                        "& label": {
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                        },
                                    }}
                                >
                                    <label htmlFor={`secodary-specialties-${index}`}>
                                        <Checkbox
                                            checked={values.secondarySpecialties.includes(el)}
                                            onChange={(e) => handleChangeFiled(e)}
                                            name={el.uuid}
                                            id={`secodary-specialties-${index}`}
                                        />
                                        <ListItemText primary={el.name} />
                                    </label>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={{ mt: "40px !important" }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight={600}>
                            {t('languages.title')}
                        </Typography>
                        <MultiSelect
                            data={multipleLanguage}
                            initData={selectData}
                            placeholder={t('languages.placeholder')}
                            onChange={(event: React.ChangeEvent, value: selectMultiple[]) => {
                                setFieldValue("languages", value)
                                setSelectData(value);
                            }} />
                    </Box>
                    <CropImage
                        open={open}
                        img={values.file}
                        setOpen={setOpen}
                        setFieldValue={setFieldValue}
                    />
                </Stack>
            </FormikProvider>
        </>
    );
}
export default Info;
