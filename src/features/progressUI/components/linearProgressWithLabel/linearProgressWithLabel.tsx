import {Box, Card, CardContent, LinearProgressProps, Stack, Typography} from "@mui/material";
import BorderLinearProgress from './overrides/borderLinearProgress';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Card sx={{display: 'flex', alignItems: 'center', border: "none"}}>
            <CardContent sx={{p: 0, marginBottom: "-1.4rem"}}>
                <Typography sx={{fontSize: 12, mr: 1, fontWeight: "bold"}}
                            variant={"caption"}>{"Importation de données"}</Typography>
                <Stack direction={"row"} alignSelf={"center"}>
                    <Box sx={{width: '100%', mr: 1, mt: .65}}>
                        <BorderLinearProgress variant="determinate" {...props} />
                    </Box>
                    <Box sx={{minWidth: 35}}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(
                            props.value,
                        )}%`}</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default LinearProgressWithLabel;
