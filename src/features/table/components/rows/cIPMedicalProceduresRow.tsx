import TableCell from "@mui/material/TableCell";
import {Box, Button, Checkbox, IconButton, InputBase} from "@mui/material";
import {styled, Theme, useTheme} from "@mui/material/styles";
import {TableRowStyled} from "@features/table";
import React, {useState} from "react";
import {pxToRem} from "@themes/formatFontSize";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

function CIPMedicalProceduresRow({...props}) {

    const {row, isItemSelected, handleClick, editMotif} = props;
    const theme = useTheme() as Theme;
    const [fees, setFees] = useState<number>(row.fees)

    const InputBaseStyled = styled(InputBase)(({theme}) => ({
        backgroundColor: 'rgba(237, 255, 238, 1)',
        border: "1px solid",
        height: pxToRem(30),
        borderRadius: 10,
        marginLeft: 5,
        marginRight: 5,
        maxWidth: 64,
        textAlign: "center",
        borderColor: theme.palette.divider,

        color: theme.palette.text.primary,
        "& .MuiOutlinedInput-root": {
            minHeight: "30px !important"
        },
        input: {
            textAlign: 'center',
            padding: theme.spacing(.3),
            "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
                margin: 0,
            }
        }
    }));

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
                    onChange={() => {
                        editMotif(row, 'checked')
                    }}
                    checked={isItemSelected}/>
            </TableCell>
            <TableCell>
                {row.act.name}
            </TableCell>
            <TableCell align={"center"}>
                {isItemSelected ? (
                    <Box className="counter-btn">
                        <IconButton
                            size="small"
                            disabled={row.qte <= 1}
                            onClick={(e) => {
                                e.stopPropagation();
                                row.qte = row.qte - 1
                                editMotif(row, 'change')
                            }}>
                            <RemoveIcon width={1} height={1}/>
                        </IconButton>

                        <InputBaseStyled
                            placeholder={"1"}
                            value={row.qte}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={() => {
                                setSelected(row.uuid + 'qte')
                            }}
                            onBlur={() => {
                                setSelected('')
                            }}
                            autoFocus={selected === row.uuid + 'qte'}
                            onChange={(e) => {
                                // @ts-ignore
                                if (!isNaN(e.currentTarget.value)) {
                                    row.qte = Number(e.currentTarget.value)
                                    editMotif(row, 'change')
                                }
                            }}
                        />

                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                row.qte = row.qte + 1
                                editMotif(row, 'change')
                            }}>
                            <AddIcon/>
                        </IconButton>
                    </Box>

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
                        <InputBaseStyled
                            size="small"
                            id={row.uuid}
                            value={fees}
                            placeholder={'--'}
                            autoFocus={selected === row.uuid}
                            onFocus={() => {
                                setSelected(row.uuid)
                            }}
                            onBlur={() => {
                                setSelected('')
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e: any) => {
                                if (!isNaN(e.currentTarget.value)) {
                                    setFees(Number(e.currentTarget.value))
                                    row.fees = Number(e.currentTarget.value)
                                    editMotif(row, 'change', e.currentTarget.value)
                                }
                            }}
                        />
                        {/*<InputBase
                            type="number"
                            size="small"
                            id={row.uuid}
                            value={fees}
                            placeholder={'--'}
                                                        autoFocus={selected === row.uuid}

                            onFocus={() => {
                       setSelected(row.uuid)
                            }}
                            onBlur={(ev) => {
                                setSelected('')
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e: any) => {
                                setFees(Number(e.currentTarget.value))
                                row.fees = Number(e.currentTarget.value)
                                editMotif(row, 'change', e.currentTarget.value)
                            }}
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
                        />*/}
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
