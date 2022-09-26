import TableCell from "@mui/material/TableCell";
import { Checkbox, Button, InputBase } from "@mui/material";
import { useTheme, alpha, Theme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

function CIPMedicalProceduresRow({ ...props }) {

    const { row, isItemSelected, handleClick, editMotif, selected: s, handleChange, tableHeadData } = props;

    /*const {trigger} = useRequestMutation(null, "/actFees");
    const router = useRouter();*/
    const { data: session } = useSession();
    /*const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;
    const form = new FormData();*/
    const theme = useTheme() as Theme;
    const [fees, setFees] = useState<number>(row.fees)
    const [selected, setSelected] = useState<string>('')
    return (
        <TableRowStyled
            className={'cip-medical-proce-row'}
            hover
            onClick={() => {
                editMotif(row, isItemSelected)
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
                        editMotif(row, 'checked')
                    }}
                    checked={isItemSelected} />
            </TableCell>
            <TableCell>
                {row.act.name}
            </TableCell>
            <TableCell>
                {isItemSelected ? (
                    <>
                        <InputBase
                            type="number"
                            size="small"
                            id={row.uuid}
                            value={fees}
                            placeholder={'--'}
                            onFocus={() => {
                                setSelected(row.uuid)
                            }}
                            onBlur={(ev) => {
                                setSelected('')

                                /*form.append("attribute", "price");
                                form.append("value", ev.target.value);

                                trigger({
                                    method: "PATCH",
                                    url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + medical_professional.uuid + "/acts/" + row.act.uuid + '/' + router.locale,
                                    data: form,
                                    headers: {
                                        ContentType: 'multipart/form-data',
                                        Authorization: `Bearer ${session?.accessToken}`
                                    }
                                }, { revalidate: true, populateCache: true }).then((e) => {
                                    console.log("res", e)
                                });*/
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e: any) => {
                                setFees(Number(e.currentTarget.value))
                                row.fees = Number(e.currentTarget.value)
                                editMotif(row, 'change', e.currentTarget.value)
                            }}
                            autoFocus={selected === row.uuid}
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
