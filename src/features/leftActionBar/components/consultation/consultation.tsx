// components
import ConsultationStyled from "./overrides/consultationStyled";
import { Box, Typography, Avatar } from "@mui/material";
import Icon from "@themes/urlIcon";
function Agenda() {
    const img = false
    return (
        <ConsultationStyled>
            <Box className="header">
                <Box className="about">
                    <Avatar {...(img ? { src: 'xyz', alt: "name", sx: { bgcolor: 'transparent', mr: 1 } } : { sx: { bgcolor: theme => theme.palette.primary.main, mr: 1 } })} />
                    <Box>
                        <Typography variant="body1" color='primary.main' sx={{ fontFamily: 'Poppins' }}>Name</Typography>
                        <Typography variant="body2" color='text.secondary'>29/06/1989 (31ans)</Typography>
                    </Box>

                </Box>
                <Box className="contact">
                    <Typography sx={{ display: 'flex', alignItems: 'center', '& .react-svg': { mr: 1.8 }, mb: (1.8) }} variant="body1" color="text.primary"><Icon path="ic-doc" />
                        Contact details
                    </Typography>
                    <Box sx={{ pl: 1 }}>
                        <Typography sx={{ display: 'flex', alignItems: 'center', '& .react-svg': { mr: 0.8 }, mb: (0.3) }} variant="body2" color="text.secondary"><Icon path="ic-phone" />
                            +33 6 78 78 78 78
                        </Typography>
                        <Typography sx={{ display: 'flex', alignItems: 'center', '& .react-svg': { mr: 0.8 } }} variant="body2" color="text.secondary"><Icon path="ic-message-contour" />
                            Khadija.eha@gmail.com
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </ConsultationStyled>
    )
}

export default Agenda
