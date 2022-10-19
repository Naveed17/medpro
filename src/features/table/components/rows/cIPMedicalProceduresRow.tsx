import TableCell from "@mui/material/TableCell";
import {Button, Checkbox, InputBase} from "@mui/material";
import {Theme, useTheme} from "@mui/material/styles";
import {TableRowStyled} from "@features/table";
import React, {useState} from "react";
import {pxToRem} from "@themes/formatFontSize";

function CIPMedicalProceduresRow({...props}) {

    const {row, isItemSelected, handleClick, editMotif, selected: s, handleChange, tableHeadData} = props;
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
                    checked={isItemSelected}/>
            </TableCell>
            <TableCell>
                {row.act.name}
            </TableCell>
            <TableCell align={"center"}>
                {isItemSelected ? (
                    <InputBase
                        placeholder={"1"}
                        type="number"
                        value={row.qte}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={() => {
                            setSelected(row.uuid + 'qte')
                        }}
                        onBlur={(ev) => {
                            setSelected('')
                        }}
                        autoFocus={selected === row.uuid + 'qte'}
                        onChange={(e) => {
                            row.qte = Number(e.currentTarget.value)
                            editMotif(row, 'change')
                        }}
                        sx={{
                            backgroundColor: "white",
                            border: 1,
                            height: pxToRem(30),
                            borderRadius: 2,
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
                ) : <>
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
                </>}

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
                                backgroundColor: 'rgba(237, 255, 238, 1)',
                                border: 1,
                                height: pxToRem(30),
                                borderRadius: 2,
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
                            {row.fees}
                        </Button>
                    </>
                )}
                TND
            </TableCell>
            <TableCell align={"center"}>
                {row.qte ? row.fees * row.qte : row.fees} TND
            </TableCell>
        </TableRowStyled>
    );
}

export default CIPMedicalProceduresRow;
