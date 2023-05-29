import React from 'react'
import UserMobileCardStyled from './overrides/userMobileCardStyle'
import { CardContent,Typography,Theme ,useTheme, Stack, IconButton} from '@mui/material';
import Lable from "@themes/overrides/Lable";
import MoreVertIcon from '@mui/icons-material/MoreVert';
function UserMobileCard({...props}) {
    const theme:Theme = useTheme();
    const {data,t} = props;
    console.log(data)
  return (
    <UserMobileCardStyled sx={{
        borderLeftColor: data.isActive ? theme.palette.success.main : theme.palette.error.main,
    }}>
        <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" width='90%'>
            <Typography variant="body1" color="text.primary">
                            {data.FirstName} {data.lastName}
                        </Typography>
                         <Lable variant="filled" color={data.isActive ?"success":"error"} sx={{px: 1.5}}>
                        {data.isActive ? t("table.active") : t("table.inactive")} 
                        </Lable>
                        </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography  variant="body2" color="text.secondary">
                 {data.email}</Typography>
                 <IconButton size='small'>
                        <MoreVertIcon />
                 </IconButton>
                 </Stack>  
                 <Stack direction="row" spacing={1} alignItems="center">
                    <Typography textTransform='capitalize' variant="body2">
                        {t("table.access")}:
                    </Typography>
                    <Typography variant="body2" color="primary"></Typography>
                    </Stack>            
        </CardContent>
    </UserMobileCardStyled>
  )
}

export default UserMobileCard