import {Button, Stack, Typography} from "@mui/material";

function DoctorToolbar({...props}) {
    const {t, title, handleAddDoctor} = props;

    return (
        <Stack
            direction={{xs: 'column', md: 'row'}}
            justifyContent="space-between"
            width={1}
            alignItems={{xs: "flex-start", md: "center"}}>
            <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                {t(title)}
            </Typography>
            <Stack width={{xs: 1, sm: 'auto'}} direction={{xs: 'column', sm: 'row'}}
                   alignItems={{xs: 'flex-start', sm: 'center'}} spacing={2}>

                <Button
                    onClick={handleAddDoctor}
                    sx={{alignSelf: {xs: 'center', sm: 'flex-start'}}}
                    variant="contained"
                    color="primary">
                    {t("sub-header.invite")}
                </Button>
            </Stack>
        </Stack>
    )
}

export default DoctorToolbar
