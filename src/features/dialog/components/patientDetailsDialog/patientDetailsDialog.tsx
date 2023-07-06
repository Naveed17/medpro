import {useState, useEffect} from "react";

// material
import {Checkbox, FormControlLabel, FormGroup, Box} from "@mui/material";

// dumy data
const checkList = [
    {id: 0, name: "Diabète / Hypoglycémie"},
    {id: 1, name: "Problèmes cardiaques / Hypertension"},
    {
        id: 2,
        name: "Cholestérol",
    },
    {
        id: 3,
        name: "Problème vasculaire / phlébite ",
    },
    {
        id: 4,
        name: "Maladie de peau",
    },
    {
        id: 5,
        name: "Épilepsie ",
    },
    {
        id: 6,
        name: "Problème respiratoire (asthme, emphysème, bronchite)",
    },
    {
        id: 7,
        name: "Autre",
    },
];

function PatientDetailsDialog({...props}) {
    const {data, onChangeList} = props;
    const [selected, setselected] = useState([...data.items]);

    useEffect(() => {
        // selected data send to parent
        onChangeList({
            ...data,
            items: selected,
        });
    }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box width={{md: 568, xs: "100%"}}>
            <FormGroup>
                {checkList.map((item) => (
                    <FormControlLabel
                        key={item.id}
                        control={
                            <Checkbox
                                key={item.id}
                                checked={selected.filter((v) => v.id === item.id).length > 0}
                                onChange={() => {
                                    if (selected.filter((v) => v.id === item.id).length > 0) {
                                        setselected(selected.filter((v) => v.id !== item.id));
                                    } else {
                                        setselected([...selected, item]);
                                    }
                                }}
                            />
                        }
                        label={item.name}
                    />
                ))}
            </FormGroup>
        </Box>
    );
}

export default PatientDetailsDialog;
