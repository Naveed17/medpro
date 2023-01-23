import TableCell from "@mui/material/TableCell";
import {Box, IconButton, InputAdornment, Skeleton, Stack, TextField, Typography} from "@mui/material";
import {TableRowStyled} from "@features/table";
import React, {useState} from "react";
import IconUrl from "@themes/urlIcon";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@app/constants";

function ActFeesRow({...props}) {
    const {row, editMotif,data} = props;
    const [act] = useState("");
    const [fees, setFees] = useState("");
    const [edit, setEdit] = useState('');

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    return (
        <TableRowStyled>
            <TableCell>
                {row?.act?.name}
            </TableCell>
            <TableCell align={"center"}>
                {edit === row?.uuid ? <TextField
                    placeholder={'--'}
                    type="number"
                    value={fees ? fees : row?.fees || 0}
                    onChange={(e) => {
                        setFees(e.target.value);
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{devise}</InputAdornment>,
                        style: {width: 150, backgroundColor: "white"},
                        inputProps: {min: 0}
                    }}
                /> : <Typography fontSize={14} letterSpacing={1}>{row?.fees} <span style={{fontSize:9}}>{devise}</span></Typography>}
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Box display="flex" sx={{float: "right"}} alignItems="center">
                        {edit === row.uuid ? <IconButton size="small" sx={{mr: {md: 1}}} onClick={() => {
                            editMotif(row,fees);
                            setTimeout(()=>{
                                setEdit('')
                            },1000)
                            }}>
                                <SaveRoundedIcon color={"primary"}/>
                            </IconButton> :
                            <IconButton size="small" sx={{mr: {md: 1}}} onClick={() => {
                                console.log("click")
                                setEdit(row.uuid)
                            }}>
                                <IconUrl path="setting/edit"/>
                            </IconButton>}
                        <IconButton onClick={() => {
                            data.remove(row.uuid)
                        }} size="small" sx={{mr: {md: 1}}}>
                            <IconUrl path="setting/icdelete"/>
                        </IconButton>
                    </Box>
                ) : (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <Skeleton variant="text" width={50}/>
                        <Skeleton variant="text" width={50}/>
                    </Stack>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default ActFeesRow;
