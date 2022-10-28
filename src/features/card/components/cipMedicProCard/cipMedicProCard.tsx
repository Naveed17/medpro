import { Typography, Button, Grid } from "@mui/material";
import CipMedicProCardStyled from './overrides/cipMedicProCardStyle';
function CipMedicProCard({ ...props }) {
    const { row, t } = props
    const devise = process.env.devise
    return (
        <CipMedicProCardStyled>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography fontWeight={600}>
                        {row.acts}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Button sx={{ mr: 1 }} size="small" variant="outlined" color="info">
                        {row.defaultAmount}
                    </Button>
                    {devise}
                </Grid>
                <Grid item xs={6}>
                    {row.amount > 0 ? (
                        <>
                            <Button className="btn-amount" size="small" variant="outlined" color="success">
                                {row.amount}
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