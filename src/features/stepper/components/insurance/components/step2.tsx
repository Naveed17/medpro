import {Stack,} from "@mui/material";
import {motion} from "framer-motion";
import React, {useEffect, useState} from "react";
import useMPActs from "@lib/hooks/rest/useMPacts";
import {Otable} from "@features/table";


function Step2({...props}) {
    const {t, devise, formik} = props;

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
    const [mainActes, setMainActes] = useState<any>([]);

    const {acts} = useMPActs()
    console.log(acts);

    const handleChange = (row: ActModel) => {
        const updated = acts.map((item: ActModel) => {
            if (item.uuid === row.uuid) {
                return row
            }
            return item;
        })
        setMainActes(updated);
    }

    useEffect(() => {
        if (acts)
            setMainActes(acts.list)
    }, [acts])


    return (
        <Stack
            component={motion.div}
            key="step2"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            spacing={2}
            pb={3}
        >

            <Otable
                headers={headCells}
                rows={mainActes}
                from={"act-row"}
                {...{t, loading: false, handleChange}}
                total={acts?.total}
                totalPages={acts.totalPages}
                pagination
            />
        </Stack>
    );
}

export default Step2;
