import {Typography, Button, Grid} from "@mui/material";
import CipMedicProCardStyled from './overrides/cipMedicProCardStyle';
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {DefaultCountry} from "@app/constants";

function CipMedicProCard({...props}) {
    const {row, t} = props;

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    return (
        <CipMedicProCardStyled>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography fontWeight={600}>
                        {row.act.name}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Button sx={{mr: 1}} size="small" variant="outlined" color="info">
                        {row.defaultAmount}
                    </Button>
                    {devise}
                </Grid>
                <Grid item xs={6}>
                    {row.fees > 0 ? (
                        <>
                            <Button className="btn-amount" size="small" variant="outlined" color="success">
                                {row.fees}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                disabled
                                className="btn-no-amount" size="small">
                                --
                            </Button>
                        </>


                    )}
                    {devise}
                </Grid>
            </Grid>
        </CipMedicProCardStyled>
    )
}

export default CipMedicProCard
