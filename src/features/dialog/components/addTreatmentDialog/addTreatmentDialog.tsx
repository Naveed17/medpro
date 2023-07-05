import {Autocomplete, Box, TextField} from '@mui/material'
import {useTranslation} from 'next-i18next'
import React, {useEffect, useState} from 'react';
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

function AddTreatmentDialog({...props}) {

    const {data} = props;
    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [drug, setDrug] = useState<DrugModel | null>(null);

    const router = useRouter();
    const {data: session} = useSession();

    const {trigger} = useRequestMutation(null, "/drugs");


    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const handleInputChange = (value: string) => {
        const drg = drugsList.find(drug => drug.commercial_name === value)
        if (drg !== undefined) {
            {
                setDrug(drg);
                data.setState([{uuid:drg.uuid,name:drg.commercial_name}])
            }
        } else {
            setDrug({uuid: '', commercial_name: value, isVerified: false});
            data.setState([{uuid: '', name: value, isVerified: false}]);
        }
    }

    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);
    return (
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
                                                                url: `/api/drugs/${router.locale}?name=${ev.target.value}`,
                                                                headers: {Authorization: `Bearer ${session?.accessToken}`}
                                                            }).then((cnx) => {
                                                                if (cnx?.data as HttpResponse)
                                                                    setDrugsList((cnx?.data as HttpResponse).data)
                                                            })
                                                        }
                                                    }}
                                                    onBlur={(ev) => handleInputChange(ev.target.value)}
                                                    placeholder={t('placeholder_drug_name')}/>}/>
            }

        </Box>
    )
}

export default AddTreatmentDialog
