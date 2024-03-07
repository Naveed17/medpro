import { Autocomplete, Avatar, Button, Stack, TextField, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import { FormikProvider, useFormik, Form } from 'formik'
import React from 'react'

function AssignmentDialog({ ...props }) {
    const { data: { t } } = props
    const formik = useFormik({
        initialValues: {
            department: "",
            assigned_doctors: [],
        },
        onSubmit: (values) => {
            console.log(values)
        }

    });
    const { values, getFieldProps, handleSubmit } = formik
    return (
        <FormikProvider value={formik}>
            <Stack
                component={Form}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
                spacing={2}


            >
                <Stack>
                    <Typography gutterBottom>
                        {t("department")}
                        <Typography color='error' variant='caption'>*</Typography>
                    </Typography>
                    <Autocomplete
                        autoHighlight
                        {...getFieldProps("department")}
                        filterSelectedOptions
                        limitTags={3}
                        noOptionsText={t("sub-header.no-department-placeholder")}
                        options={[]}
                        renderInput={(params) => (
                            <TextField color={"info"}
                                {...params}
                                sx={{ paddingLeft: 0, minWidth: 140 }}
                                placeholder={t("sub-header.department-placeholder")}
                                variant="outlined"
                            />)}
                    />
                </Stack>
                <Typography variant='subtitle1' fontWeight={600} gutterBottom>
                    {t("dialog.assigned-to-heading")}
                </Typography>
                <Stack>
                    <Typography gutterBottom>
                        {t("dialog.assigned-to")}
                    </Typography>
                    <Autocomplete
                        autoHighlight
                        multiple
                        {...getFieldProps("assigned_doctors")}
                        filterSelectedOptions
                        limitTags={3}
                        noOptionsText={t("dialog.no-assigned-to-placeholder")}
                        options={[]}
                        renderInput={(params) => (
                            <TextField color={"info"}
                                {...params}
                                sx={{ paddingLeft: 0, minWidth: 140 }}
                                placeholder={t("dialog.assigned-to-placeholder")}
                                variant="outlined"
                            />)}
                    />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} px={1} alignItems={"center"} justifyContent={"space-between"}>
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
                            <IconUrl width={"36"} height={"36"} path="men-avatar" />
                        </Avatar>
                        <Stack alignItems={"start"}>
                            <Typography variant="body1" fontWeight={700} color="primary">
                                {"Dr Ghassen BOULAHIA"}
                            </Typography>
                            <Typography variant="body1" fontWeight={700}>
                                {"Gynécologue Obstétricien"}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Button
                        type="submit"
                        variant="contained"
                        color="info">
                        {t("dialog.un-assign")}
                    </Button>
                </Stack>
            </Stack>
        </FormikProvider>

    )
}

export default AssignmentDialog