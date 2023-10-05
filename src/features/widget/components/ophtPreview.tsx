import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import OphtTableStyled from "@features/widget/components/overrides/ophtTable";
import DialogTableStyled from "@features/widget/components/overrides/dialogTableStyle";
import {defaultValues, impact} from "@features/widget/components/overrides/defaultValues";
import IconUrl from "@themes/urlIcon";
import SaveIcon from '@mui/icons-material/Save';

export default function OphtPreview({...props}) {

    let {t, printGlasses, appuuid, url, triggerAppointmentEdit} = props
    const subTitle = ['av', 'sphere', 'cylindre', 'axe']

    const [acuiteVisuelle, setAcuiteVisuelle] = useState([
        {
            name: "Réfraction subjective",
            lignes: 1,
            ref: "refSub",
            od: {av: "x", sphere: "", cylindre: "", axe: ""},
            og: {av: "x", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "Correction de loin",
            lignes: 1,
            ref: "cl",
            od: {av: "", sphere: "", cylindre: "", axe: ""},
            og: {av: "", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "Correction de prés",
            lignes: 1,
            ref: "cp",
            od: {av: "", sphere: "", cylindre: "", axe: ""},
            og: {av: "", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "Prescription finale",
            lignes: 2,
            ref: "pf",
            od: {av: "L", sphere: "", cylindre: "", axe: ""},
            og: {av: "L", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "",
            lignes: 1,
            ref: "pfp",
            od: {av: "P", sphere: "", cylindre: "", axe: ""},
            og: {av: "P", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "Lentille",
            lignes: 1,
            ref: "len",
            od: {av: "x", sphere: "", cylindre: "", axe: ""},
            og: {av: "x", sphere: "", cylindre: "", axe: ""},
        },
    ]);
    const [examination, setExamination] = useState([
        {name: "sa", od: "", og: ""},
        {name: "fluo", od: "", og: ""},
        {name: "fo", od: "", og: ""},
        {name: "annexes", od: "", og: ""},
        {name: "measuredTO", od: "", og: ""},
        {name: "pachymetry", od: "", og: ""},
        {name: "tocorrected", od: "", og: ""},
    ]);

    const [open, setOpen] = useState(false);
    const [selectedEl, setSelectedEl] = useState<any>(null);

    const getOptions = (el: string, from: string) => {
        let res = []
        if (defaultValues[el])
            res = defaultValues[el]
        else if (el == "av")
            res = defaultValues[from]
        return res
    }

    useEffect(() => {
        const local = localStorage.getItem(`Modeldata${appuuid}`);
        const res = local ? JSON.parse(local) : null;
        if (res && res.eyes) {
            res.eyes.acuiteVisuelle && setAcuiteVisuelle(res.eyes.acuiteVisuelle);
            res.eyes.examination && setExamination(res.eyes.examination);
        }
    }, [localStorage.getItem(`Modeldata${appuuid}`)])

    return (
        <Stack spacing={1}>
            <Typography color={"#0696D6"}
                        fontSize={13}
                        textAlign={"center"}>{t('ophtalmologiqueExam')}</Typography>

            <OphtTableStyled style={{width: "100%"}} onClick={() => {
                setOpen(true)
            }}>
                <tbody>
                <tr>
                    <td className={"col"}></td>
                    <td className={"title center col"}>{t('rightEye')}</td>
                    <td className={"title center col"}>{t('leftEye')}</td>
                </tr>
                {examination.map((ex: any) => (
                    <tr key={ex.name}>
                        <td className={"title col"}>{t(ex.name)}</td>
                        <td className={"center"}>{ex.od ? ex.od : "-"}</td>
                        <td className={"center"}>{ex.og ? ex.og : "-"}</td>
                    </tr>
                ))}
                </tbody>
            </OphtTableStyled>

            <Typography color={"#0696D6"}
                        fontSize={13}
                        textAlign={"center"}>{t('ac')}</Typography>

            <OphtTableStyled style={{width: "100%"}} onClick={() => {
                setOpen(true)
            }}>
                <tbody>
                <tr>
                    <td className={"col"}></td>
                    <td colSpan={4} className={"title center col"}>{t('rightEye')}</td>
                    <td colSpan={4} className={"title center col"}>{t('leftEye')}</td>
                </tr>
                <tr>
                    <td className={"col"}></td>
                    {subTitle.map(st => (
                        <td className={"subtitle col"} key={`od-${st}`}>{t(st)}</td>
                    ))}
                    {subTitle.map(st => (
                        <td className={"subtitle col"} key={`og-${st}`}>{t(st)}</td>
                    ))}
                </tr>

                {acuiteVisuelle.map((av: any) => (
                    <tr key={av.name}>
                        {av.name && <td rowSpan={av.lignes} className={"title col"}>{t(av.ref)}</td>}
                        {subTitle.map((od, index) => (
                            <td className={"col"} key={`od-${index}`}>
                                <Typography className={"val"}>{av.od[od]}</Typography>
                            </td>
                        ))}

                        {subTitle.map((og, index) => (
                            <td className={"col"} key={`og-${index}`}>
                                <Typography className={"val"}>{av.og[og]}</Typography>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </OphtTableStyled>

            <Stack direction={"row"} marginBottom={5} justifyContent={"flex-end"}>
                <Button size={"small"} color={"primary"}
                        onClick={() => {
                            printGlasses([{
                                    pfl: acuiteVisuelle.filter(av => av.ref === "pf"),
                                    pfp: acuiteVisuelle.filter(av => av.ref === "pfp")
                                }]
                            )
                        }}
                        startIcon={<IconUrl path="ic-imprime"/>}>
                    <Typography
                        style={{textTransform: "initial", color: "#0796d6", fontSize: 12}}>{t('pg')}</Typography>
                </Button>
            </Stack>

            <Dialog
                open={open}
                fullWidth
                onClose={() => setOpen(false)}
                scroll={"paper"}
                maxWidth={"lg"}>
                <DialogTitle style={{
                    marginBottom: 15,
                    borderBottom: "1px solid #eeeff1",
                    color:"#0696D6"
                }}
                             id="draggable-dialog-title">
                    {t('ophtalmologiqueExam')}
                    <Typography fontSize={12} style={{color: "rgb(115, 119, 128)"}}>& {t('ac')}</Typography>
                </DialogTitle>
                <DialogContent>


                    <DialogTableStyled style={{width: "100%"}}
                                       onClick={() => {
                                           setOpen(true)
                                       }}>
                        <tbody>
                        <tr>
                            <td className={"col"}></td>
                            <td className={"col"}><Typography className={"tt"}>{t('rightEye')}</Typography></td>
                            <td className={"col"}><Typography className={"tt"}>{t('leftEye')}</Typography></td>
                        </tr>
                        {examination.map((ex: any, index) => (
                            <tr key={ex.name}>
                                <td className={"col"}><Typography className={"title"}>{t(ex.name)}</Typography></td>
                                <td className={"center col"}>
                                    <TextField size={"small"}
                                               style={{width: "95%", margin: 5}}
                                               placeholder={'-'}
                                               inputProps={{
                                                   style: {
                                                       textAlign: 'center',
                                                       padding: 5,
                                                       background: "white"
                                                   }
                                               }}
                                               onChange={(e) => {
                                                   let _examination = [...examination]
                                                   _examination[index].od = e.target.value;

                                                   if (index === 4 || index === 5)
                                                       if (_examination[4].od && _examination[5].od) {
                                                           const res = impact.find(i => i.pachymetry === _examination[5].od);
                                                           if (res && res.correction)
                                                               _examination[6].od = (parseInt(_examination[4].od) + res.correction).toString()
                                                       }

                                                   setExamination([..._examination])
                                               }}
                                               value={ex.od}/>
                                </td>
                                <td className={"center col"}>
                                    <TextField size={"small"}
                                               style={{width: "95%", margin: 5}}
                                               placeholder={'-'}
                                               inputProps={{
                                                   style: {
                                                       textAlign: 'center',
                                                       padding: 5,
                                                       background: "white"
                                                   }
                                               }}
                                               onChange={(e) => {
                                                   let _examination = [...examination]
                                                   _examination[index].og = e.target.value;
                                                   setExamination([..._examination])
                                               }}
                                               value={ex.og}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </DialogTableStyled>

                    <Typography color={"#0696D6"} style={{marginBottom: 8, marginTop: 20}}>{t('ac')}</Typography>
                    <DialogTableStyled style={{width: "100%"}}>
                        <tbody>
                        <tr>
                            <td className={"col"}></td>
                            <td colSpan={4} className={"col"}><Typography className={"tt"}>{t('rightEye')}</Typography>
                            </td>
                            <td colSpan={4} className={"col"}><Typography className={"tt"}>{t('leftEye')}</Typography>
                            </td>
                        </tr>
                        <tr>
                            <td className={"col"}></td>
                            {subTitle.map(st => (
                                <td className={"subtitle col"} key={`od-${st}`}>{t(st)}</td>
                            ))}
                            {subTitle.map(st => (
                                <td className={"subtitle col"} key={`og-${st}`}>{t(st)}</td>
                            ))}
                        </tr>

                        {acuiteVisuelle.map((av: any, index) => (
                            <tr key={av.name}>
                                {av.name && <td rowSpan={av.lignes} className={"col"}><Typography
                                    className={"title"}>{t(av.ref)}</Typography></td>}

                                {subTitle.map((od, ind) => (
                                    <td className={"col"} key={`og-${ind}`}>
                                        {
                                            selectedEl && selectedEl.x === od && selectedEl.y === av.ref && selectedEl.pos === "od" ?
                                                <Autocomplete
                                                    disablePortal
                                                    value={av.od[od]}
                                                    placeholder={"-"}
                                                    id="combo-box-demo"
                                                    size={"small"}
                                                    freeSolo={true}
                                                    disableClearable={true}
                                                    options={getOptions(od, av.ref)}
                                                    onBlur={(e: any) => {
                                                        let _ac: any[] = [...acuiteVisuelle]
                                                        _ac[index].od[od] = e.target.value
                                                        setAcuiteVisuelle(_ac);
                                                        setSelectedEl(null)
                                                    }}
                                                    sx={{width: 70, margin: "auto", backgroundColor: "white"}}
                                                    renderInput={(params) => <TextField {...params} placeholder={"-"}/>}
                                                /> : <Typography className={"center"} onClick={() => {
                                                    if (!['x', 'L', 'P'].includes(av.od[od]))
                                                        setSelectedEl({x: od, y: av.ref, pos: 'od'})
                                                }}>{av.od[od] ? av.od[od] : '-'}</Typography>}
                                    </td>
                                ))}

                                {subTitle.map((og, ind) => (
                                    <td className={"col"} key={`og-${ind}`}>
                                        {
                                            selectedEl && selectedEl.x === og && selectedEl.y === av.ref && selectedEl.pos === "og" ?
                                                <Autocomplete
                                                    disablePortal
                                                    value={av.og[og]}
                                                    placeholder={"-"}
                                                    id="combo-box-demo"
                                                    size={"small"}
                                                    freeSolo={true}
                                                    disableClearable={true}
                                                    options={getOptions(og, av.ref)}
                                                    onBlur={(e: any) => {
                                                        let _ac: any[] = [...acuiteVisuelle]
                                                        _ac[index].og[og] = e.target.value
                                                        setAcuiteVisuelle(_ac);
                                                        setSelectedEl(null)
                                                    }}
                                                    sx={{width: 70, margin: "auto", backgroundColor: "white"}}
                                                    renderInput={(params) => <TextField {...params} placeholder={"-"}/>}
                                                /> : <Typography className={"center"} onClick={() => {
                                                    if (!['x', 'L', 'P'].includes(av.og[og]))
                                                        setSelectedEl({x: og, y: av.ref, pos: 'og'})
                                                }}>{av.og[og] ? av.og[og] : '-'}</Typography>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </DialogTableStyled>
                    <Stack direction={"row"} marginTop={1} justifyContent={"flex-end"}>

                    </Stack>
                </DialogContent>
                <DialogActions style={{borderTop: "1px solid #eeeff1"}}>

                    <Button size={"small"}
                            onClick={() => {
                                printGlasses([{
                                        pfl: acuiteVisuelle.filter(av => av.ref === "pf"),
                                        pfp: acuiteVisuelle.filter(av => av.ref === "pfp")
                                    }]
                                )
                            }}
                            startIcon={<IconUrl path="ic-imprime"/>}>
                        <Typography style={{textTransform:"initial",color:"#0696D6"}}>{t('pg')}</Typography>
                    </Button>

                    <Button variant="contained"
                            style={{
                                background: '#0696D6',
                                margin: 10
                            }}
                            onClick={() => {
                                setOpen(false)
                                const data = localStorage.getItem(`Modeldata${appuuid}`)
                                let res = data ? JSON.parse(data) : {};
                                res = {
                                    ...res, eyes: {
                                        acuiteVisuelle,
                                        examination
                                    }
                                }

                                localStorage.setItem("Modeldata" + appuuid, JSON.stringify(res));

                                const form = new FormData();
                                form.append("modal_data", JSON.stringify(res));
                                triggerAppointmentEdit({
                                    method: "PUT",
                                    url,
                                    data: form
                                })

                            }}
                            startIcon={<SaveIcon/>}>{t('save')}</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
