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
import React, {useState} from "react";
import OphtTableStyled from "@features/widget/components/overrides/ophtTable";
import DialogTableStyled from "@features/widget/components/overrides/dialogTableStyle";
import {defaultValues} from "@features/widget/components/overrides/defaultValues";
import IconUrl from "@themes/urlIcon";

export default function OphtPreview({...props}) {

    let {t, printGlasses} = props
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

    return (
        <Stack spacing={1} direction={"row"}>
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

            <Dialog
                open={open}
                fullWidth
                onClose={() => setOpen(false)}
                scroll={"paper"}
                maxWidth={"lg"}>
                <DialogTitle style={{
                    marginBottom: 15,
                    borderBottom: "1px solid #eeeff1",
                }}
                             id="draggable-dialog-title">
                    {'title'}
                    <Typography fontSize={12} style={{color: "rgb(115, 119, 128)"}}>{'subtitle'}</Typography>
                </DialogTitle>
                <DialogContent style={{overflow: "hidden"}}>

                    <Typography style={{marginBottom: 8}}>{t('ac')}</Typography>
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
                        <Button size={"small"}
                                onClick={() => {
                                    printGlasses([{
                                            pfl: acuiteVisuelle.filter(av => av.ref === "pf"),
                                            pfp: acuiteVisuelle.filter(av => av.ref === "pfp")
                                        }]
                                    )
                                }}
                                startIcon={<IconUrl path="ic-imprime"/>}>
                            <Typography color={theme => theme.palette.primary.main}>{t('pg')}</Typography>
                        </Button>
                    </Stack>
                </DialogContent>

                <DialogActions style={{borderTop: "1px solid #eeeff1"}}>
                    <Button onClick={() => {
                        setOpen(false)
                    }
                    }>{t('save')}</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
