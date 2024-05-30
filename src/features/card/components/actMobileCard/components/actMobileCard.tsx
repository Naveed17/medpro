import React, { useEffect, useState } from 'react'
import ActMobileCardStyled from './overrides/actMobileCardStyle'
import { CardContent, MenuItem, Select, SelectChangeEvent, Skeleton, Stack, Typography } from '@mui/material'
import { SelectCheckboxCard } from '@features/selectCheckboxCard'
import InputBaseStyled from '@features/table/components/overrides/inputBaseStyled'
import { useAppSelector } from '@lib/redux/hooks'
import { tableActionSelector } from '@features/table'
const names = [
    "01", "02", "03", "04", "05"
];
function ActMobileCard({ ...props }) {
    const { row, t, handleChange, loading } = props
    const [fees, setFees] = useState("");
    const [contribution, setContribution] = useState("");
    const [apci, setApci] = useState<string[]>([]);
    const { tableState: { rowsSelected } } = useAppSelector(tableActionSelector);
    const isSelected = (id: any) => rowsSelected.some((item: any) => item.uuid === id)
    const isItemSelected = isSelected(row?.uuid);


    const handleSelect = (event: SelectChangeEvent<typeof apci>) => {
        const {
            target: { value },
        } = event;
        setApci(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    useEffect(() => {
        setFees(row?.fees);
        setContribution(row?.contribution);
    }, [row]);
    return (
        <ActMobileCardStyled>
            <CardContent>
                <Stack direction='row' spacing={1}>
                    <SelectCheckboxCard row={row} isSmall />
                    <Stack width={1} spacing={1}>
                        {loading ? (
                            <Skeleton variant="text" />
                        ) : (
                            <Typography className='ellipsis' fontWeight={600}>
                                {row?.act?.name}
                            </Typography>
                        )
                        }
                        <Stack direction='row' alignItems="center" spacing={.5}>
                            <Stack spacing={.5} width={1}>
                                <Typography variant='caption'>
                                    {t("table.fees")}
                                </Typography>
                                <InputBaseStyled
                                    readOnly={!isItemSelected}
                                    placeholder={"--"}
                                    sx={{ maxWidth: 1 }}
                                    value={fees}
                                    onChange={(e: any) => {
                                        const newRow = { ...row }
                                        if (!isNaN(Number(e.target.value))) {
                                            setFees(e.target.value);
                                            newRow.fees = Number(e.target.value);
                                            handleChange(newRow)
                                        }
                                    }}
                                />
                            </Stack>
                            <Stack spacing={.5} width={1}>
                                <Typography variant='caption'>
                                    {t("table.rem_amount")}
                                </Typography>
                                <InputBaseStyled
                                    readOnly={!isItemSelected}
                                    placeholder={"--"}
                                    sx={{ maxWidth: 1 }}
                                    value={fees}
                                    onChange={(e: any) => {
                                        const newRow = { ...row }
                                        if (!isNaN(Number(e.target.value))) {
                                            setFees(e.target.value);
                                            newRow.fees = Number(e.target.value);
                                            handleChange(newRow)
                                        }
                                    }}
                                />
                            </Stack>
                        </Stack>
                        <Stack spacing={.5} width={1}>
                            <Typography variant='caption'>
                                {t("table.patient_share")}
                            </Typography>
                            <InputBaseStyled
                                readOnly={!isItemSelected}
                                placeholder={"--"}
                                sx={{ maxWidth: 1 }}
                                value={contribution}
                                onChange={(e) => {
                                    const newRow = { ...row }
                                    if (!isNaN(Number(e.target.value))) {
                                        setContribution(e.target.value);
                                        newRow.contribution = Number(e.target.value);
                                        handleChange(row)
                                    }
                                }}

                            />
                        </Stack>
                        <Stack spacing={.5} width={1}>
                            <Typography variant='caption'>
                                {t("table.apci")}
                            </Typography>
                            <Select
                                readOnly={!isItemSelected}
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                displayEmpty={true}
                                sx={{
                                    minWidth: 250, maxHeight: 30,
                                    minHeight: 2,
                                    ".MuiSelect-multiple": {
                                        py: .5,
                                        px: 1,
                                        textAlign: 'left'
                                    }

                                }}
                                value={apci}
                                onChange={handleSelect}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return (
                                            <Typography
                                                fontSize={13}
                                                color="textSecondary">
                                                {t("table.apci")}
                                            </Typography>
                                        );
                                    }
                                    return selected.join(", ");
                                }}

                            >
                                {names.map((name) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </ActMobileCardStyled>
    )
}

export default ActMobileCard

