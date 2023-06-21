import {
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel, IconButton,
    MenuItem,
    OutlinedInput,
    Paper,
    PaperProps,
    Select,
    SelectChangeEvent,
    Stack, TextField,
    Theme,
    Typography,
    useTheme
} from "@mui/material";
import {GithubPicker} from "react-color";
import Add from "@mui/icons-material/Add";
import React, {useEffect, useState} from "react";
import Draggable from "react-draggable";
import adultTeeth from "@features/widget/components/adult";
import childTeeth from "@features/widget/components/child";
import IconUrl from "@themes/urlIcon";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: any, personName: readonly string[], theme: Theme) {
    return {
        fontSize: 10,
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

export default function TeethWidget({...props}) {
    let {acts, t, setActs, of, setSelectedAct, selectedAct, appuuid, previousData,local} = props
    const theme = useTheme();
    let [traitements, setTraitements] = useState<TraitementTeeth[]>([{
        id: 1,
        name: 'Traitement 1',
        color: '#B80000',
        showPicker: false,
        teeth: [],
        acts: [],
        note:''
    }]);
    const [open, setOpen] = useState("");
    const [absent, setAbsent] = useState<string[]>([]);
    const teeth = of === 'adult' ? adultTeeth : childTeeth;

    useEffect(() => {
        const data = localStorage.getItem(`Modeldata${appuuid}`)
        if (data) {
            const res = JSON.parse(data)[`${of}Teeth`]
            if (res) {
                setTraitements([...res.traitements]);
                setAbsent(res.absent);
            } else {
                if (previousData) {
                    const previous = previousData[`${of}Teeth`];
                    if (previous) {
                        setTraitements([...previous.traitements]);
                        setAbsent(previous.absent);
                    }
                }

            }
        }
    }, [appuuid, of, previousData])
    const between = (val: number, min: number, max: number) => {
        return val >= min && val <= max;
    }
    const GetCoordinates = (e: any) => {
        let PosX = 0;
        let PosY = 0;
        let ImgPos;
        ImgPos = FindPosition(document.getElementById("tooth"));
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            PosX = e.pageX;
            PosY = e.pageY;
        } else if (e.clientX || e.clientY) {
            PosX = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            PosY = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        PosX = PosX - ImgPos[0];
        PosY = PosY - ImgPos[1];

        teeth.forEach(tooth => {
            if (tooth.x) {
                if (between(PosX, tooth.x[0], tooth.x[1]) && between(PosY, tooth.y[0], tooth.y[1])) {
                    setOpen(tooth.id);
                }
            }
        });
    }
    const FindPosition = (oElement: any) => {
        if (typeof (oElement.offsetParent) != "undefined") {
            for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            return [posX, posY];
        } else {
            return [oElement.x, oElement.y];
        }
    }
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
    const handleChange = (event: SelectChangeEvent<string[]>, traitement: number) => {
        const {target: {value}} = event;
        traitements[traitement].teeth = typeof value === 'string' ? value.split(',') : value;
        setTraitements([...traitements])
        editStorage(traitements)
    };
    const handleChangeAct = (event: SelectChangeEvent<string[]>, traitement: number) => {
        const {target: {value}} = event;
        traitements[traitement].acts = typeof value === 'string' ? value.split(',') : value;

        let teethActs: any[] = [];
        Array.isArray(value) && value.map(act => {
            const index = selectedAct.findIndex((sa: { uuid: string; }) => sa.uuid === act)
            if (index === -1) {
                const indexAct = acts.findIndex((ac: { uuid: string; }) => ac.uuid === act)
                teethActs = [...teethActs, {
                    act: {name: acts[indexAct].act.name},
                    act_uuid: acts[indexAct].uuid,
                    fees: acts[indexAct].fees,
                    name: acts[indexAct].act.name,
                    price: acts[indexAct].fees,
                    qte: 1,
                    uuid: acts[indexAct].uuid
                }]
                let a = [...acts]
                const el = a[indexAct]
                a.splice(indexAct, 1);
                setActs([{...el, qte: 1}, ...a]);
                localStorage.setItem(
                    `consultation-acts-${appuuid}`,
                    JSON.stringify([...selectedAct, ...teethActs])
                );
                console.log(localStorage.getItem( `consultation-acts-${appuuid}`))
                setSelectedAct([...selectedAct, ...teethActs])
            }
        })
        setTraitements([...traitements])
        editStorage(traitements)
    };
    const handleClose = () => {
        setOpen("");
    };
    const editStorage = (trait: TraitementTeeth[]) => {
        const data = localStorage.getItem(`Modeldata${appuuid}`)
        const res = data ? JSON.parse(data) : {};
        res[`${of}Teeth`] = {
            absent,
            traitements: [...trait]
        }
        localStorage.setItem("Modeldata" + appuuid, JSON.stringify(res));
    }

    return (
        <Stack direction={"row"}>
            <div style={{position: "relative"}}>
                {traitements.map(traitement =>
                    traitement.teeth.map(st => (
                        <div onClick={(ev) => {
                            ev.stopPropagation()
                            setOpen(st)
                        }} key={`${traitement.id} ${st}`} style={{
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

                {/* <div onClick={(ev) => {

                }}  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 3,
                    height: 3,
                    background: "black",
                    opacity: 0.5,
                    borderRadius: 15
                }}/>*/}

                {absent.map(a => (
                    <div
                        onClick={(ev) => {
                            ev.stopPropagation()
                            setOpen(a)
                        }}
                        key={`absent-teeth ${a}`}
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
                <img src={`/static/img/${of === 'adult' ? local === 'fr' ?'adultTeeth':'adultTeethEN' : local === 'fr' ?'childTeeth':'childTeethEN'}.svg`}
                     id={"tooth"}
                     onClick={GetCoordinates}
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
                <Stack direction={"row"} alignItems={"center"} spacing={.5} p={1} pt={0}>
                    {absent.map(a => (<Chip key={`${a}-absent`} style={{fontSize: 10}} label={a}/>))}
                </Stack>
            </div>

            <Stack spacing={1} p={1} width={"100%"}>
                <Typography fontSize={12}>{t('traitements')}</Typography>
                {
                    traitements.map((traitement, index) => (
                        <Stack key={traitement.id} style={{border: `1px solid #E0E0E0`}} spacing={1}
                               padding={1} borderRadius={2}>
                            <Stack direction={"row"}
                                   justifyContent={"space-between"}
                                   spacing={1}
                                   alignItems={"center"}>
                                <input style={{width: 90, border: 0, fontSize: 10, color: "#737780"}}
                                       value={traitement.name}
                                       onChange={(ev) => {
                                           traitements[index].name = ev.target.value;
                                           setTraitements([...traitements])
                                           editStorage(traitements)
                                       }}></input>
                                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                    <div onClick={() => {
                                        traitements[index].showPicker = !traitements[index].showPicker;
                                        setTraitements([...traitements]);
                                        editStorage(traitements)
                                    }}
                                         style={{
                                             background: traitement.color,
                                             width: 18,
                                             height: 18,
                                             borderRadius: 7
                                         }}></div>

                                    <IconButton size="small" onClick={() => {
                                        traitements.splice(index,1)
                                        setTraitements([...traitements])
                                        editStorage(traitements)
                                    }}>
                                        <IconUrl path="setting/icdelete"/>
                                    </IconButton>
                                </Stack>
                            </Stack>

                            {traitement.showPicker && <GithubPicker width={"130"}
                                                                    onChange={(ev) => {
                                                                        traitements[index].color = ev.hex;
                                                                        traitements[index].showPicker = false;
                                                                        setTraitements([...traitements])
                                                                        editStorage(traitements)
                                                                    }}/>}


                            <Typography fontSize={9}>{t('selectTeeth')}</Typography>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="teeth-multiple-chip"
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        padding: "5px",
                                        border: "1px solid rgb(224, 224, 224)"
                                    }
                                }}
                                multiple
                                value={traitement.teeth}
                                onChange={(res) => {
                                    handleChange(res, index)
                                }}
                                input={<OutlinedInput placeholder={'11'}
                                                      label="Chip"/>}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} style={{fontSize: 10}}/>
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {teeth.map((tooth) => (
                                    <MenuItem
                                        key={tooth.id}
                                        value={tooth.id}
                                        style={getStyles(tooth.id, traitement.teeth, theme)}
                                    >
                                        {tooth.id}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Typography fontSize={9}>{t('selectActs')}</Typography>

                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        padding: "5px",
                                        border: "1px solid rgb(224, 224, 224)"
                                    }
                                }}
                                value={traitement.acts}
                                onChange={(res) => {
                                    handleChangeAct(res, index)
                                }}
                                input={<OutlinedInput placeholder={'11'} label="Chip"/>}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {

                                            selected.map((value) => {
                                                const role = acts?.find((a: any) => a.uuid === value);
                                                return (
                                                    <Chip key={value} label={role.act.name} style={{fontSize: 9}}/>)
                                            })
                                        }
                                    </Box>
                                )}
                                MenuProps={MenuProps}>
                                {acts && acts.map((act: any) => <MenuItem key={act.uuid}
                                                                          style={getStyles(act.uuid, traitement.acts, theme)}
                                                                          value={act.uuid}>{act.act.name}</MenuItem>)}

                            </Select>

                            <Typography fontSize={9}>{t('note')}</Typography>

                            <TextField placeholder={'--'}
                                       value={traitement.note}
                                       onChange={(ev)=>{
                                           traitements[index].note = ev.target.value;
                                           setTraitements([...traitements])
                                           editStorage(traitements)
                                       }}
                            />


                        </Stack>))
                }

                <Button
                    onClick={() => {
                        const max = traitements.reduce((acc, shot) => acc > shot.id ? acc : shot.id, 0);
                        traitements = [...traitements, {
                            id: max + 1,
                            name: `${t('traitement')} ${max + 1}`,
                            color: '#006B76',
                            showPicker: false,
                            teeth: [],
                            acts: [],
                            note:''
                        }]
                        setTraitements([...traitements])
                        editStorage(traitements)
                    }
                    }
                    size="small"
                    style={{width: "fit-content", fontSize: 10}}
                    startIcon={<Add/>}>
                    {t("add")}
                </Button>
            </Stack>

            <Dialog
                open={open !== ""}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: 'move', color: theme.palette.primary.main}}
                             id="draggable-dialog-title">
                    {t('teeth')} {open}
                </DialogTitle>
                <DialogContent>
                    <Stack direction={"row"}>
                        <FormControlLabel
                            control={<Checkbox checked={absent.find(a => a === open) !== undefined}
                                               onChange={(ev) => {
                                                   if (ev.target.checked)
                                                       absent.push(open)
                                                   else absent.splice(absent.findIndex(a => a === open), 1);
                                                   setAbsent([...absent]);
                                                   editStorage(traitements)
                                                   setOpen("")
                                               }}/>} label={t('absente')}/>
                        {traitements.map((traitement, index) => (
                            <FormControlLabel key={traitement.id} control={<Checkbox
                                checked={traitement.teeth.find(t => t === open) !== undefined} onChange={() => {
                                const teeth: string[] = traitement.teeth;
                                const st = traitement.teeth.findIndex(t => t === open)
                                if (st >= 0) teeth.splice(st, 1)
                                else teeth.push(open)
                                traitements[index].teeth = teeth;
                                setTraitements([...traitements])
                                editStorage(traitements)
                                setOpen("")
                            }}/>} label={traitement.name}/>
                        ))}
                    </Stack>
                </DialogContent>
            </Dialog>
        </Stack>
    )
}
