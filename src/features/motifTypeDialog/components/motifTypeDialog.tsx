import * as Yup from "yup";
import {useFormik, Form, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    FormHelperText,
    Stack,
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel, InputAdornment,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import React from "react";
import {useTranslation} from "next-i18next";
import {useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {IconsTypes} from "@features/calendar";
import {ModelDot} from "@features/modelDot";
import {LoadingScreen} from "@features/loadingScreen";
import {useSnackbar} from "notistack";
import {DefaultCountry} from "@app/constants";
import {useAppSelector} from "@app/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@app/hooks";

const icons = [
    "ic-consultation",
    "ic-teleconsultation",
    "ic-control",
    "ic-clinique",
    "ic-at-home",
    "ic-personal",
];
const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: 0,
    height: "100%",
    border: "none",
    minWidth: "650px",
    [theme.breakpoints.down("md")]: {
        minWidth: 0,
        width: "100%",
    },
    boxShadow: theme.customShadows.motifDialog,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    "& .container": {
        maxHeight: 680,
        overflowY: "auto",
        "& .MuiCard-root": {
            border: "none",
            "& .MuiCardContent-root": {
                padding: theme.spacing(2),
            },
        },
    },
    ".react-svg": {
        svg: {
            width: 20,
            height: 20,
        },
    },
    "& .bottom-section": {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: "auto",
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
        borderTop: `3px solid ${theme.palette.grey["A700"]}`,
    },
}));
const colors = [
    "#FEBD15",
    "#FF9070",
    "#DF607B",
    "#9A5E8A",
    "#526686",
    "#96B9E8",
    "#0696D6",
    "#56A97F",
];

function EditMotifDialog({...props}) {
    const {mutateEvent} = props;
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter();
    const {trigger} = useRequestMutation(null, "/settings/type");
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();

    const {t, ready} = useTranslation("settings");
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("users.new.ntc"))
            .max(50, t("users.new.ntl"))
            .required(t("users.new.nameReq")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: props.data ? (props.data.name as string) : "",
            color: props.data ? (props.data.color as string) : "#0696D6",
            icon: props.data ? (props.data.icon as string) : icons[0],
            isFree: props.data
                ? !!(props.data.isFree as null | boolean)
                : false,

            consultation_fees: props.data
                ? (props.data.price as null | number)
                    ? props.data.price
                    : 0
                : 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            props.closeDraw();
            const form = new FormData();
            form.append("color", values.color);
            form.append(
                "name",
                JSON.stringify({
                    fr: values.name,
                })
            );
            form.append("icon", values.icon);
            form.append(
                "isFree",
                values.consultation_fees ? false : (values.isFree as any)
            );
            form.append("price", values.isFree ? null : values.consultation_fees);
            if (props.data) {
                medicalEntityHasUser && trigger({
                        method: "PUT",
                        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/appointments/types/${props.data.uuid}/${router.locale}`,
                        data: form,
                        headers: {Authorization: `Bearer ${session?.accessToken}`}
                    }).then(() => {
                    enqueueSnackbar(t(`motifType.alert.edit`), {variant: "success"});
                    mutateEvent();
                }).catch((error) => {
                    enqueueSnackbar(error, {variant: "error"});
                });
            } else {
                medicalEntityHasUser && trigger(
                    {
                        method: "POST",
                        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/appointments/types/${router.locale}`,
                        data: form,
                        headers: {Authorization: `Bearer ${session?.accessToken}`},
                    }).then(() => {
                    enqueueSnackbar(t(`motifType.alert.add`), {variant: "success"});
                    mutateEvent();
                }).catch((error) => {
                    enqueueSnackbar(error, {variant: "error"});
                });
            }
        },
    });

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
    } = formik;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = +(event.target as HTMLInputElement).value;
        setFieldValue("consultation_fees", value);
        if (value === 0) {
            setFieldValue("isFree", true);
        } else {
            setFieldValue("isFree", false);
        }
    };

    if (!ready) return (<LoadingScreen error button={"loading-error-404-reset"} text={"loading-error"}/>);

    return (
        <FormikProvider value={formik}>
            <PaperStyled
                autoComplete="off"
                noValidate
                className="root"
                onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    {props.data
                        ? t("motifType.dialog.update")
                        : t("motifType.dialog.add")}
                </Typography>
                <Typography
                    variant="body1"
                    fontWeight={400}
                    margin={"16px 0"}
                    gutterBottom>
                    {t("motifType.dialog.info")}
                </Typography>
                <Card sx={{height: 1, maxHeight: 400, overflowY: "auto"}}>
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack spacing={2} direction="row">
                                <Box width={1}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom>
                                        {t("motifType.dialog.nom")}{" "}
                                        <Typography component="span" color="error">
                                            *
                                        </Typography>
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t("motifType.dialog.tapez")}
                                        required
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        {...getFieldProps("name")}
                                        error={Boolean(touched.name && errors.name)}
                                    />
                                </Box>
                            </Stack>
                            <Stack>
                                <Typography
                                    display="flex"
                                    justifyContent="flex-start"
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom>
                                    {t("motifType.dialog.color")}{" "}
                                    <Typography component="span" color="error" ml={0.2}>
                                        *
                                    </Typography>
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {colors.map((color) => (
                                        <ModelDot
                                            key={color}
                                            color={color}
                                            onClick={() => {
                                                setFieldValue("color", color);
                                            }}
                                            selected={color === values.color}></ModelDot>
                                    ))}
                                </Stack>
                                {touched.color && errors.color && (
                                    <FormHelperText error sx={{mx: 0}}>
                                        {Boolean(touched.color && errors.color)}
                                    </FormHelperText>
                                )}
                            </Stack>

                            <FormControl size="small" fullWidth>
                                <Typography gutterBottom variant="body2" color="text.secondary">
                                    {t("motifType.dialog.selectIcon")}
                                </Typography>
                                <Select
                                    id="demo-select-small"
                                    {...getFieldProps("icon")}
                                    value={values.icon}>
                                    {icons.map((icon, idx) => (
                                        <MenuItem key={idx} value={icon}>
                                            <Stack direction={"row"} alignItems="center">
                                                {IconsTypes[icon]}
                                                <Typography
                                                    color="text.secondary"
                                                    sx={{
                                                        textTransform: "capitalize",
                                                        ml: 0.5,
                                                    }}>
                                                    {icon.replace("ic-", " ")}
                                                </Typography>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Stack direction="row" alignItems="flex-end" spacing={1}>
                                <FormControl>
                                    <Typography
                                        gutterBottom
                                        variant="body2"
                                        color="text.secondary">
                                        {t("motifType.dialog.type")}
                                    </Typography>
                                    <RadioGroup
                                        row
                                        value={values.consultation_fees}
                                        onChange={handleChange}>
                                        <FormControlLabel
                                            value={0}
                                            control={<Radio/>}
                                            label={t("motifType.dialog.un_payed")}
                                        />
                                        <FormControlLabel
                                            value={
                                                values.consultation_fees ? values.consultation_fees : 1
                                            }
                                            control={<Radio/>}
                                            label={t("motifType.dialog.payed")}
                                        />
                                    </RadioGroup>
                                </FormControl>
                                {+values.consultation_fees !== 0 && (
                                    <TextField
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" sx={{justifyContent: "center"}}>
                                                    <Typography>{devise}</Typography>
                                                </InputAdornment>)
                                        }}
                                        type="number"
                                        {...getFieldProps("consultation_fees")}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Stack
                    className="bottom-section"
                    justifyContent="flex-end"
                    spacing={2}
                    direction={"row"}>
                    <Button onClick={props.closeDraw}>
                        {t("motifType.dialog.cancel")}
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {t("motifType.dialog.save")}
                    </Button>
                </Stack>
            </PaperStyled>
        </FormikProvider>
    );
}

export default EditMotifDialog;
