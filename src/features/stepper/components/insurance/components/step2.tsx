import {Stack,} from "@mui/material";
import {motion} from "framer-motion";
import React, {useEffect, useState} from "react";
import useMPActs from "@lib/hooks/rest/useMPacts";
import {Otable, setSelectedRows} from "@features/table";
import {SetAgreement, stepperSelector} from "@features/stepper";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";


function Step2({...props}) {
    const {t, devise} = props;
    const {agreement} = useAppSelector(stepperSelector);

    const headCells = [
        {
            id: "select-all",
            numeric: false,
            disablePadding: true,
            label: "select",
            sortable: false,
            align: "left",
        },
        {
            id: "act",
            numeric: false,
            disablePadding: false,
            label: "act",
            align: "left",
            sortable: true,
        },
        {
            id: "fees",
            numeric: false,
            disablePadding: false,
            label: "fees",
            align: "center",
            sortable: false,
        },
        {
            id: "rem_amount",
            numeric: true,
            disablePadding: false,
            label: "rem_amount",
            align: "center",
            sortable: false,
        },
        {
            id: "patient_share",
            numeric: true,
            disablePadding: false,
            label: "patient_share",
            align: "center",
            sortable: false,
        },
        {
            id: "apci",
            numeric: false,
            disablePadding: false,
            label: "apci",
            align: "center",
            sortable: false,
        },
    ];

    const {acts} = useMPActs({noPagination: true})
    const dispatch = useAppDispatch();

    const [mainActes, setMainActes] = useState<any>(acts);
    const [select, setSelect] = useState<string[]>(agreement?.acts.map((act: any) => act.uuid));

    const handleChange = (row: any) => {
        let _agreement = JSON.parse(JSON.stringify(agreement));
        let _index = _agreement.acts.findIndex((act: any) => act.uuid === row.uuid)
        _agreement.acts[_index].fees = row.fees
        _agreement.acts[_index].refund = row.refund
        _agreement.acts[_index].patient_part = row.contribution
        _agreement.acts[_index].apcis = row.apci
        dispatch(SetAgreement(_agreement))

        const updated = acts.map((item: ActModel) => {
            if (item.uuid === row.uuid) {
                return row
            }
            return item;
        })
        setMainActes(updated);
    }

    const handleEvent = (row: string, checked: boolean) => {
        let _agreement = {...agreement}
        if (checked) {
            const _act = acts.find((act: any) => act.uuid === row)
            _agreement.acts = [..._agreement.acts, {
                uuid: row,
                fees: _act.fees,
                refund: _act.refund,
                patient_part: _act.contribution,
                apcis: ""
            }]
            setSelect([...select, row])
        } else
            _agreement.acts = _agreement.acts.filter((act: any) => act.uuid !== row)

        dispatch(SetAgreement(_agreement))
    }

    useEffect(() => {
        if (acts.length > 0)
            setMainActes(acts)
    }, [acts])

    useEffect(() => {
        dispatch(setSelectedRows(select))
    }, [dispatch, select])

    return (
        <Stack
            component={motion.div}
            key="step2"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            spacing={2}
            pb={3}>

            <Otable
                headers={headCells}
                rows={mainActes}
                from={"act-row"}
                {...{t, loading: false, handleChange, select, handleEvent, devise}}
            />
        </Stack>
    );
}

export default Step2;
