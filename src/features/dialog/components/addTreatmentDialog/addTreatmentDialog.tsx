import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import {useTranslation} from 'next-i18next'
import React, {useState} from 'react';
import dynamic from "next/dynamic";
import {useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import Add from "@mui/icons-material/Add";
import {useMedicalEntitySuffix} from "@lib/hooks";
import Icon from "@themes/urlIcon";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function AddTreatmentDialog({...props}) {

    const {data} = props;
    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [drug, setDrug] = useState<DrugModel | null>(null);
    const [traitments, setTraitments] = useState<DrugModel[]>([]);

    const router = useRouter();

    const {trigger} = useRequestMutation(null, "/drugs");

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const handleInputChange = (value: string) => {
        const drg = drugsList.find(drug => drug.commercial_name === value)
        if (drg !== undefined)
            setDrug(drg);
        else
            setDrug({uuid: '', commercial_name: value, isVerified: false});

    }

    const addTraitment = () => {
        setTraitments([...traitments, (drug as DrugModel)]);
        if (drug)
            data.setState([...data.state, {uuid: drug.uuid, name: drug.commercial_name, isVerified: drug.isVerified}])
        setDrug(null)
    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);
    return (
        <Stack spacing={1}>
            <Box>
                {drugsList && <Autocomplete
                    id="cmo"
                    value={drug}
                    size='small'
                    options={drugsList}
                    noOptionsText={t('startWriting')}
                    getOptionLabel={(option: DrugModel) => option?.commercial_name}
                    isOptionEqualToValue={(option, value) => option?.commercial_name === value?.commercial_name}
                    renderInput={(params) => <TextField {...params}
                                                        onChange={(ev) => {
                                                            if (ev.target.value.length >= 2) {
                                                                trigger({
                                                                    method: "GET",
                                                                    url: `/api/drugs/${router.locale}?name=${ev.target.value}`
                                                                }).then((cnx) => {
                                                                    if (cnx?.data as HttpResponse)
                                                                        setDrugsList((cnx?.data as HttpResponse).data)
                                                                })
                                                            }
                                                        }}
                                                        onBlur={(ev) => handleInputChange(ev.target.value)}
                                                        placeholder={t('placeholder_drug_name')}/>}/>
                }

                <Button
                    onClick={() => {
                        addTraitment()
                    }}
                    size="small"
                    style={{marginTop: 10}}
                    disabled={drug === null}
                    startIcon={<Add/>}>
                    {t('add')}
                </Button>


            </Box>

            {traitments.length > 0 && <Typography>{t('traitments')}</Typography>}
            <Stack spacing={1}>
                {
                    traitments.map(traitment => (
                        <Card key={traitment.uuid}>
                            <CardContent style={{padding: 10}}>
                                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Typography>{traitment.commercial_name}</Typography>
                                    <IconButton size="small" onClick={() => {
                                        setTraitments([...traitments.filter(t => t.uuid !== traitment.uuid)])
                                        data.setState([...data.state.filter((t: {
                                            uuid: string
                                        }) => t.uuid !== traitment.uuid)])
                                    }}>
                                        <Icon path="setting/icdelete"/>
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))
                }
            </Stack>
        </Stack>
    )
}

export default AddTreatmentDialog
