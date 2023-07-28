import { Checkbox } from '@mui/material';
import React from 'react'
import {setSelectedRows, tableActionSelector} from "@features/table";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {selectCheckboxActionSelector,onSelectCheckbox}from '@features/selectCheckbox'
function SelectCheckbox({...props}) {
    const {row,isSmall} = props;
    const dispatch = useAppDispatch();
    const {tableState: {rowsSelected}} = useAppSelector(tableActionSelector);
const {selectCheckboxState:{selectedCheckbox}} = useAppSelector(selectCheckboxActionSelector);
    
    const handleChange = (id: any) => {
        const selectedIndex = selectedCheckbox.indexOf(id);
        let newSelected: readonly string[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedCheckbox, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedCheckbox.slice(1));
        } else if (selectedIndex === selectedCheckbox.length - 1) {
            newSelected = newSelected.concat(selectedCheckbox.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedCheckbox.slice(0, selectedIndex),
                selectedCheckbox.slice(selectedIndex + 1)
            );
        }
        dispatch(onSelectCheckbox(newSelected));
    }
    const handleCheckItem = (isItemSelected: boolean, row: PatientModel) => {
        if (isItemSelected) {
            dispatch(setSelectedRows([...rowsSelected, row]))
        } else {
            dispatch(setSelectedRows(rowsSelected.filter((item: any) => item.uuid !== row.uuid)))
        }
    }
  return (
    <Checkbox
                        color="primary"
                        checked={selectedCheckbox.some((uuid: any) => uuid === row.uuid)}
                        inputProps={{
                            "aria-labelledby": row.uuid,
                        }}
                        onChange={(ev) => {
                            ev.stopPropagation();
                            handleChange(row.uuid);
                            handleCheckItem(ev.target.checked, row);
                        }}
                        {...(isSmall && { sx:{
                            padding:0,
                            height:24,
                            width:24,
                        }})}
                        
                    />
  )
}

export default SelectCheckbox