import {Chip, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import adultTeeth from "@features/widget/components/adult";
import childTeeth from "@features/widget/components/child";

export default function TeethPreview({...props}) {
    let {t, of, appuuid, acts, previousData, setOpenTeeth, local} = props

    let [traitements, setTraitements] = useState<TraitementTeeth[]>([{
        id: 1,
        name: 'Traitement 1',
        color: '#B80000',
        showPicker: false,
        teeth: [],
        acts: [],
        note: ''
    }]);
    const [absent, setAbsent] = useState<string[]>([]);
    const teeth = of === 'adult' ? adultTeeth : childTeeth;

    useEffect(() => {
        setTimeout(() => {
            const data = localStorage.getItem(`Modeldata${appuuid}`)
            if (data && data !== "null") {
                const res = JSON.parse(data)[`${of}Teeth`]
                if (res) {
                    setTraitements([...res.traitements]);
                    setAbsent(res.absent);
                } else if (previousData) {
                    const previous = previousData[`${of}Teeth`];
                    if (previous) {
                        setTraitements([...previous.traitements]);
                        setAbsent(previous.absent);
                    }
                }
            } else {
                if (previousData) {
                    const previous = previousData[`${of}Teeth`];
                    if (previous) {
                        setTraitements([...previous.traitements]);
                        setAbsent(previous.absent);
                    }
                }
            }

        }, 500)
    }, [appuuid, of, previousData])
    const getPosition = (traitement: string, pos: string) => {
        let data = 0;
        const tooth = teeth.find(t => t.id === traitement);
        if (tooth) {
            switch (pos) {
                case 'top':
                    data = tooth.y[0];
                    break
                case 'left':
                    data = tooth.x[0];
                    break
                case 'width':
                    data = tooth.x[1] - tooth.x[0];
                    break
                case 'height':
                    data = tooth.y[1] - tooth.y[0];
                    break
            }
        }
        return data
    }

    return (
        <Stack spacing={1} direction={"row"}>
            <div style={{position: "relative"}}>
                {traitements.map(traitement =>
                    traitement.teeth.map(st => (
                        <div key={`${traitement.id} ${st}`}
                             onClick={() => {
                                 setOpenTeeth(of)
                             }}
                             style={{
                                 position: "absolute",
                                 top: getPosition(st, 'top'),
                                 left: getPosition(st, 'left'),
                                 width: getPosition(st, 'width'),
                                 height: getPosition(st, 'height'),
                                 background: traitement.color,
                                 opacity: 0.5,
                                 borderRadius: 15
                             }}/>
                    ))
                )}

                {absent.map(a => (
                    <div key={`absent-teeth ${a}`}
                         onClick={() => {
                             setOpenTeeth(of)
                         }}
                         style={{
                             position: "absolute",
                             top: getPosition(a, 'top'),
                             left: getPosition(a, 'left'),
                             width: getPosition(a, 'width'),
                             height: getPosition(a, 'height'),
                             background: "repeating-linear-gradient(45deg, rgb(232 220 231), rgb(220 212 220) 1px, rgb(47 71 215) 1px, rgb(47 71 215) 2px)",
                             opacity: 0.5,
                             borderRadius: 15
                         }}/>))}

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`/static/img/${of === 'adult' ? local === 'fr' ? 'adultTeeth' : 'adultTeethEN' : local === 'fr' ? 'childTeeth' : 'childTeethEN'}.svg`}
                    id={"t"}
                    onClick={() => {
                        setOpenTeeth(of)
                    }}
                    alt={"patient teeth"}/>

                <Stack direction={"row"} alignItems={"center"} spacing={1} p={1}>
                    <div style={{
                        width: 10,
                        height: 10,
                        background: "repeating-linear-gradient(45deg, rgb(232 220 231), rgb(220 212 220) 1px, rgb(47 71 215) 1px, rgb(47 71 215) 2px)",
                        opacity: 0.5,
                        borderRadius: 15
                    }}/>
                    <Typography fontSize={10} color={"#737780"}>{t('hiddenTeeth')}</Typography>
                </Stack>
                <div>
                    {absent.map(a => (<Chip key={`${a}-absent`} style={{fontSize: 10, margin: 2}} label={a}/>))}
                </div>
            </div>
            <div>
                {traitements.map(traitement => (
                    <div key={traitement.name} style={{fontSize: 10, marginBottom: 4}}>
                        {(traitement.teeth.length > 0 || traitement.acts.length > 0) && <div style={{
                            display: 'flex',
                            marginBottom: 5,
                            alignItems: 'center'
                        }}>
                            <div style={{
                                width: 10,
                                height: 10,
                                background: traitement.color,
                                opacity: 0.5,
                                marginRight: 5,
                                borderRadius: 15
                            }}/>
                            <Typography fontSize={10}>{traitement.name}</Typography>
                        </div>}

                        <div style={{
                            marginBottom: 5,
                        }}>
                            {traitement.teeth.map(a => (
                                <Chip key={`${a}-absent`} style={{fontSize: 10, margin: 1}} label={a}/>))}
                        </div>


                        {traitement.acts.map((act, index) => (`${acts.find((a: {
                            uuid: string;
                        }) => a.uuid === act).act.name}${index === traitement.acts.length - 1 ? '' : ','}`))}


                        {traitement.note && <p style={{
                            margin: 0,
                            letterSpacing: 0.8,
                            color: "gray"
                        }}>{t('note')}: {traitement.note}</p>}
                    </div>
                ))}
            </div>
        </Stack>
    )
}
