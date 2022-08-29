import React from 'react'
import LifeStyleDialogStyled from './overrides/lifeStyleDialogStyle'
import {useTranslation} from 'next-i18next';
import {FormGroup, FormControlLabel, Checkbox, TextField, Box} from '@mui/material'
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

function LifeStyleDialog() {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const [state, setState] = React.useState<any>({});
    const {data: session} = useSession();
    const router = useRouter();

    const {data: httpAntecedentsResponse} = useRequest({
        method: "GET",
        url: `/api/antecedents/0/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };
    if (!ready) return <>loading translations...</>;
    console.log(state);
    return (
        <LifeStyleDialogStyled display='block'>
            <Box maxWidth={{xs: '100%', md: '80%'}} mx="auto">
                {httpAntecedentsResponse &&
                    (httpAntecedentsResponse as HttpResponse).data.map((list: { uuid: string, name: string, type: number }, idx: number) =>
                        <FormGroup row key={idx}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={!!state[list.uuid]} onChange={handleChange} name={list.uuid}/>
                                }
                                label={list.name}
                            />
                            {
                                (list.uuid && state[list.uuid]) && <TextField
                                    name={`text_field_${list.name}`}
                                    placeholder={t('starting_year')}
                                    onChange={(e) =>
                                        setState({
                                            ...state,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                            }

                        </FormGroup>
                    )
                }
            </Box>
        </LifeStyleDialogStyled>
    )
}

export default LifeStyleDialog