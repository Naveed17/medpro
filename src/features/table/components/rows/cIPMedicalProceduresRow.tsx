import TableCell from "@mui/material/TableCell";
import {Checkbox, Button, InputBase} from "@mui/material";
import {useTheme, alpha, Theme} from "@mui/material/styles";
import {TableRowStyled} from "@features/table";
import React from "react";
import {useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

function CIPMedicalProceduresRow({...props}) {

    const {row, isItemSelected, handleClick, editMotif, handleChange} = props;

    const {trigger} = useRequestMutation(null, "/actFees");
    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const theme = useTheme() as Theme;
    const [fees, setfees] = React.useState<number>(row.fees)
    return (
        <TableRowStyled
            className={'cip-medical-proce-row'}
            hover
            onClick={() => {
                editMotif(row, 'clicked')
                return handleClick(row.uuid as string)
            }}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={Math.random()}
            selected={isItemSelected}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    onChange={(e) => {
                        editMotif(row, e, 'checked')
                    }}
                    checked={isItemSelected}/>
            </TableCell>
            <TableCell>
                {row.act.name}
            </TableCell>
            <TableCell>
                {isItemSelected ? (
                    <>
                        <InputBase
                            type="number"
                            size="small" value={fees}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e: any) => {
                                setfees(e.target.value)
                                row.fees = e.target.value !== '' ? Number(e.target.value) : 0
                                editMotif(row, 'changed')
                            }}
                            /*onBlur={(ev) => () => {
                                console.log('blur')
                                trigger({
                                    method: "PATCH",
                                    url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + medical_professional.uuid + "acts/" + row.uuid + '/' + router.locale,
                                    headers: {
                                        ContentType: 'multipart/form-data',
                                        Authorization: `Bearer ${session?.accessToken}`
                                    }
                                }, {revalidate: true, populateCache: true}).then((e) => {
                                    // mutate()
                                    console.log("res",e)
                                });
                                }}*/
                            autoFocus={isItemSelected}
                            sx={{
                                backgroundColor: alpha(theme.palette.success.main, 0.1),
                                border: 1,
                                borderRadius: .5,
                                paddingLeft: .5,
                                paddingRight: .5,
                                maxWidth: 64,
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.primary,
                                mr: 1,
                                input: {
                                    textAlign: 'center',
                                    padding: theme.spacing(.3),
                                    "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
                                        "-webkit-appearance": 'none',
                                        margin: 0,
                                    }

                                }
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Button
                            disabled
                            sx={{
                                backgroundColor: 'transparent !important',
                                borderColor: 'transparent',
                                color: theme.palette.text.primary + ' !important',
                                mr: 1,
                            }} size="small">
                            --
                        </Button>
                    </>


                )}
                TND
            </TableCell>
        </TableRowStyled>
    );
}

export default CIPMedicalProceduresRow;
