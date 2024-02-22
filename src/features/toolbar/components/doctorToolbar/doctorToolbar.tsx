import { Button, FormControl, Stack, TextField, Typography } from "@mui/material";
import _ from "lodash";
import Autocomplete from "@mui/material/Autocomplete";

function DoctorToolbar({ ...props }) {
    const { t, title } = props;

    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            width={1}
            alignItems={{ xs: "flex-start", md: "center" }}>
            <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                {t(title)}
            </Typography>
            <Stack width={{ xs: 1, sm: 'auto' }} direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <TextField
                    type={"email"}
                    sx={{ minWidth: 200 }}
                    className={'search-input'}
                    fullWidth
                    placeholder={t("sub-header.invite-placeholder")}
                />


                <Autocomplete
                    fullWidth
                    size={"small"}
                    id={""}
                    autoHighlight
                    filterSelectedOptions
                    limitTags={3}
                    noOptionsText={t("sub-header.no-department-placeholder")}
                    options={[]}
                    renderInput={(params) => (
                        <FormControl component="form" fullWidth onSubmit={e => e.preventDefault()}>
                            <TextField color={"info"}
                                {...params}
                                sx={{ paddingLeft: 0, minWidth: 140 }}
                                placeholder={t("sub-header.department-placeholder")}
                                variant="outlined"
                            />
                        </FormControl>)}
                />

                <Button
                    sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
                    type="submit"
                    variant="contained"
                    color="primary">
                    {t("sub-header.invite")}
                </Button>
            </Stack>
        </Stack>
    )
}

export default DoctorToolbar
