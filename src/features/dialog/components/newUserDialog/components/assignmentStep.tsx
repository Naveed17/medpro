import React, {useEffect, useState} from 'react'
import DialogStyled from './overrides/dialogStyle';
import {
    Avatar,
    Button, CircularProgress,
    FormControlLabel, ListItem, ListItemText,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import IconUrl from '@themes/urlIcon';
import {useRouter} from 'next/router';
import {useMedicalEntitySuffix} from '@lib/hooks';
import {useRequestQueryMutation} from '@lib/axios';
import Autocomplete from "@mui/material/Autocomplete";

function AssignmentStep({...props}) {
    const {t, formik} = props;
    const {getFieldProps, values, setFieldValue, errors, touched} = formik;
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();

    const [profiles, setProfiles] = useState([
        {
            key: "secretary"
        }, {
            key: "nurse"
        }, {
            key: "accountant"
        }
    ]);
    const [openAutoCompleteDepartment, setOpenAutoCompleteDepartment] = useState(false);
    const [loadingReqDepartment, setLoadingReqDepartment] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<any>([]);
    const [departments, setDepartments] = useState<DepartmentModel[]>([]);
    const [openAutoCompleteDoctors, setOpenAutoCompleteDoctors] = useState(false);
    const [loadingReqDoctors, setLoadingReqDoctors] = useState(false);
    const [doctors, setDoctors] = useState<UserModel[]>([]);

    const {trigger: getDepartmentTrigger} = useRequestQueryMutation("/admin/users/department");

    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoCompleteDepartment) {
            return undefined;
        }

        (async () => {
            setLoadingReqDepartment(true);
            getDepartmentTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/admin/departments/${router.locale}`
            }, {
                onSuccess: (result) => {
                    setDepartments((result?.data as HttpResponse)?.data);
                    setLoadingReqDepartment(false);
                }
            });
        })();
    }, [openAutoCompleteDepartment]); // eslint-disable-line react-hooks/exhaustive-deps

    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoCompleteDoctors) {
            return undefined;
        }

        (async () => {
            setLoadingReqDoctors(true);
            getDepartmentTrigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/admin/users/${router.locale}?professionals=true`
            }, {
                onSuccess: (result) => {
                    setDoctors((result?.data as HttpResponse)?.data);
                    setLoadingReqDoctors(false);
                }
            });
        })();
    }, [openAutoCompleteDoctors]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DialogStyled spacing={2}>
            <Typography fontWeight={600} fontSize={20}>
                {t("dialog.role")}
            </Typography>

            <RadioGroup
                className='role-input-group'
                {...getFieldProps("selectedRole")}
                value={values?.selectedRole ?? ""}>
                {profiles.map((profile: any, index: number) => (
                    <FormControlLabel
                        className='role-label'
                        value={profile.key}
                        key={`${index}-${profile.key}`}
                        control={<Radio disableRipple
                                        checkedIcon={<IconUrl path="ic-radio-check"/>}/>}
                        label={t(profile.key)}/>
                ))}
            </RadioGroup>

            <Stack>
                <Typography gutterBottom>
                    {t("department")}
                </Typography>

                <Autocomplete
                    value={values.department}
                    multiple
                    noOptionsText={t("no-department-placeholder")}
                    disableClearable
                    sx={{
                        width: "100%",
                        "& .MuiSelect-select": {
                            background: "white",
                        }
                    }}
                    id="profile-select"
                    open={openAutoCompleteDepartment}
                    onOpen={() => setOpenAutoCompleteDepartment(true)}
                    onClose={() => setOpenAutoCompleteDepartment(false)}
                    onChange={(e, department) => setFieldValue("department", department)}
                    getOptionLabel={(option: any) => option?.name ?? ""}
                    isOptionEqualToValue={(option: any, value) => option?.name === value?.name}
                    options={departments}
                    renderOption={(props, option) => (
                        <ListItem {...props}>
                            <ListItemText primary={option?.name ?? ""}/>
                        </ListItem>
                    )}
                    renderInput={params =>
                        <TextField
                            {...params}
                            color={"info"}
                            sx={{paddingLeft: 0}}
                            placeholder={t("department-placeholder")}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loadingReqDepartment ?
                                            <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                            error={Boolean(errors.department && touched.department)}
                            variant="outlined"
                            fullWidth/>}
                />
            </Stack>

            <Stack>
                <Typography gutterBottom>
                    {t("assigned-to")}
                    <Typography color='error' variant='caption'>*</Typography>
                </Typography>

                <Autocomplete
                    value={values.assigned_doctors}
                    multiple
                    limitTags={3}
                    noOptionsText={t("no-assigned-to-placeholder")}
                    disableClearable
                    sx={{
                        width: "100%",
                        "& .MuiSelect-select": {
                            background: "white",
                        }
                    }}
                    id="profile-select"
                    open={openAutoCompleteDoctors}
                    onOpen={() => setOpenAutoCompleteDoctors(true)}
                    onClose={() => setOpenAutoCompleteDoctors(false)}
                    onChange={(e, staff) => setFieldValue("assigned_doctors", staff)}
                    getOptionLabel={(option: any) => option?.userName ?? ""}
                    filterOptions={(options, {inputValue}) => options.filter(item => item.firstName?.includes(inputValue) || item.lastName?.includes(inputValue))}
                    isOptionEqualToValue={(option: any, value) => option?.uuid === value?.uuid}
                    options={doctors}
                    renderOption={(props, option) => (
                        <ListItem {...props}>
                            <ListItemText primary={`${option?.firstName} ${option?.lastName}`}/>
                        </ListItem>
                    )}
                    renderInput={params =>
                        <TextField
                            {...params}
                            color={"info"}
                            sx={{paddingLeft: 0}}
                            placeholder={t("assigned-to-placeholder")}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loadingReqDoctors ?
                                            <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                            error={Boolean(errors.assigned_doctors && touched.assigned_doctors)}
                            variant="outlined"
                            fullWidth/>}
                />
            </Stack>

            {values.assigned_doctors.map((doctor: any) =>
                <Stack
                    key={doctor.uuid}
                    direction={"row"}
                    px={1} alignItems={"center"}
                    justifyContent={"space-between"}>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <Avatar
                            src={"/static/icons/men-avatar.svg"}
                            sx={{
                                "& .injected-svg": {
                                    margin: 0
                                },
                                width: 45,
                                height: 45,
                                borderRadius: 1
                            }}>
                            <IconUrl width={"36"} height={"36"} path="men-avatar"/>
                        </Avatar>
                        <Stack alignItems={"start"}>
                            <Typography variant="body1" fontWeight={700} color="primary">
                                {doctor?.firstName} {doctor?.lastName}
                            </Typography>
                            <Typography variant="body1" fontWeight={700}>
                                {doctor?.email ?? "-"}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Button
                        onClick={() => {
                            setFieldValue("assigned_doctors", values.assigned_doctors.filter((item: any) => doctor.uuid !== doctor.uuid));
                        }}
                        variant="contained"
                        color="info">
                        {t("un-assign")}
                    </Button>
                </Stack>)}
        </DialogStyled>
    )
}

export default AssignmentStep
