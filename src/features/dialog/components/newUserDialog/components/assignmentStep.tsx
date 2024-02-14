import React, {useState} from 'react'
import DialogStyled from './overrides/dialogStyle';
import {
    Avatar,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import IconUrl from '@themes/urlIcon';
import {useRouter} from 'next/router';
import {useMedicalEntitySuffix} from '@lib/hooks';
import {useRequestQuery} from '@lib/axios';
import {startCase} from "lodash";
import Autocomplete from "@mui/material/Autocomplete";

function AssignmentStep({...props}) {
    const {t, formik} = props;
    const {getFieldProps, touched, errors, values, setFieldValue} = formik;
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter()
    const {data: httpProfilesResponse, mutate: mutateProfiles} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/profile/${router.locale}`
    }, {refetchOnWindowFocus: false});

    const profiles = ((httpProfilesResponse as HttpResponse)?.data ?? []) as ProfileModel[];

    return (
        <DialogStyled spacing={2}>
            <Typography fontWeight={600} fontSize={20}>
                {t("dialog.role")}
            </Typography>

            <RadioGroup
                className='role-input-group'
                {...getFieldProps("selectedRole")}>
                {profiles.map((profile: ProfileModel, index: number) => (
                    <FormControlLabel className='role-label' value={profile.uuid} key={profile.uuid}
                                      control={<Radio disableRipple
                                                      checkedIcon={<IconUrl path="ic-radio-check"/>}/>}
                                      label={startCase(profile.name)}/>
                ))}
            </RadioGroup>

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
                    noOptionsText={t("no-department-placeholder")}
                    options={[]}
                    renderInput={(params) => (
                        <TextField color={"info"}
                                   {...params}
                                   sx={{paddingLeft: 0, minWidth: 140}}
                                   placeholder={t("department-placeholder")}
                                   variant="outlined"
                        />)}
                />
            </Stack>

            <Stack>
                <Typography gutterBottom>
                    {t("assigned-to")}
                </Typography>
                <Autocomplete
                    autoHighlight
                    multiple
                    {...getFieldProps("assigned_doctors")}
                    filterSelectedOptions
                    limitTags={3}
                    noOptionsText={t("no-assigned-to-placeholder")}
                    options={[]}
                    renderInput={(params) => (
                        <TextField color={"info"}
                                   {...params}
                                   sx={{paddingLeft: 0, minWidth: 140}}
                                   placeholder={t("assigned-to-placeholder")}
                                   variant="outlined"
                        />)}
                />
            </Stack>

            <Stack direction={"row"} px={1} alignItems={"center"} justifyContent={"space-between"}>
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
                    {t("un-assign")}
                </Button>
            </Stack>
        </DialogStyled>
    )
}

export default AssignmentStep
