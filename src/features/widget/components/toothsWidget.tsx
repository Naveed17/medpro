import {
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    PaperProps,
    Select,
    SelectChangeEvent,
    Stack,
    Theme,
    Typography,
    useTheme
} from "@mui/material";
import {GithubPicker} from "react-color";
import Add from "@mui/icons-material/Add";
import React, {useState} from "react";
import Draggable from "react-draggable";
import {useTranslation} from "next-i18next";

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
        fontSize:10,
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

export default function ToothsWidget({...props}) {
    let {acts,setSelectedAct,selectedAct} = props
    const {t} = useTranslation("consultation", {keyPrefix: "widget"});
    const theme = useTheme();
    let [traitements, setTraitements] = useState<TraitementTeeth[]>([{
        id: 1,
        name: 'Traitement 1',
        color: '#B80000',
        showPicker: false,
        tooths: [],
        acts: []
    }]);
    const [open, setOpen] = useState("");
    const [absent, setAbsent] = useState<string[]>([]);
    const tooths = [
        {id: '11', x: [73, 84], y: [9, 21]},
        {id: '12', x: [56, 67], y: [17, 29]},
        {id: '13', x: [44, 55], y: [25, 37]},
        {id: '14', x: [37, 48], y: [40, 52]},
        {id: '15', x: [30, 41], y: [55, 67]},
        {id: '16', x: [23, 38], y: [71, 87]},
        {id: '17', x: [20, 35], y: [93, 109]},
        {id: '18', x: [19, 34], y: [114, 130]},

        {id: '21', x: [88, 99], y: [9, 21]},
        {id: '22', x: [104, 115], y: [17, 29]},
        {id: '23', x: [116, 127], y: [25, 37]},
        {id: '24', x: [124, 135], y: [40, 52]},
        {id: '25', x: [131, 142], y: [55, 67]},
        {id: '26', x: [134, 149], y: [71, 87]},
        {id: '27', x: [137, 152], y: [93, 109]},
        {id: '28', x: [138, 153], y: [114, 130]},

        {id: '31', x: [87, 97], y: [254, 263]},
        {id: '32', x: [99, 109], y: [249, 258]},
        {id: '33', x: [111, 121], y: [242, 251]},
        {id: '34', x: [120, 130], y: [228, 239]},
        {id: '35', x: [127, 137], y: [213, 225]},
        {id: '36', x: [130, 147], y: [193, 209]},
        {id: '37', x: [134, 151], y: [170, 186]},
        {id: '38', x: [138, 153], y: [150, 166]},

        {id: '41', x: [74, 84], y: [254, 263]},
        {id: '42', x: [62, 72], y: [249, 258]},
        {id: '43', x: [50, 60], y: [242, 251]},
        {id: '44', x: [41, 51], y: [228, 239]},
        {id: '45', x: [35, 45], y: [213, 225]},
        {id: '46', x: [25, 42], y: [193, 209]},
        {id: '47', x: [21, 38], y: [170, 186]},
        {id: '48', x: [18, 33], y: [150, 166]},


    ];
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

        tooths.map(teeth => {
            if (teeth.x) {
                if (between(PosX, teeth.x[0], teeth.x[1]) && between(PosY, teeth.y[0], teeth.y[1])) {
                    setOpen(teeth.id);
                }
            }
        })
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
        const teeth = tooths.find(t => t.id === traitement);
        if (teeth) {
            switch (pos) {
                case 'top':
                    data = teeth.y[0];
                    break
                case 'left':
                    data = teeth.x[0];
                    break
                case 'width':
                    data = teeth.x[1] - teeth.x[0];
                    break
                case 'height':
                    data = teeth.y[1] - teeth.y[0];
                    break
            }
        }
        return data
    }
    const handleChange = (event: SelectChangeEvent<string[]>, traitement: number) => {
        const {target: {value}} = event;
        traitements[traitement].tooths = typeof value === 'string' ? value.split(',') : value;
        setTraitements([...traitements])
    };
    const handleChangeAct = (event: SelectChangeEvent<string[]>, traitement: number) => {
        const {target: {value}} = event;
        traitements[traitement].acts = typeof value === 'string' ? value.split(',') : value;
        Array.isArray(value) && value.map(act => {
            const index = selectedAct.findIndex((sa: { uuid: string; }) => sa.uuid === act)
            if (index === -1) {
                const actDetail = acts.find((ac: { uuid: string; }) => ac.uuid === act)
                selectedAct = [...selectedAct, {
                    act: {name: actDetail.act.name},
                    act_uuid: actDetail.uuid,
                    fees: actDetail.fees,
                    name:  actDetail.act.name,
                    price: actDetail.fees,
                    qte: 1,
                    uuid: actDetail.uuid
                }]
                setSelectedAct([...selectedAct])
            }

        })
        setTraitements([...traitements])
    };
    const handleClose = () => {
        setOpen("");
    };

    return (
        <Card style={{margin: 10, marginBottom: 0, display: "flex"}}>
            <div style={{position: "relative"}}>
                {traitements.map(traitement =>
                    traitement.tooths.map(st => (
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
                <img src={"/static/img/tooth.svg"}
                     id={"tooth"}
                     onClick={GetCoordinates}
                     alt={"adult tooth"}/>

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

            <Stack spacing={1} p={1} width={"50%"}>
                <Typography fontSize={12}>{t('traitements')}</Typography>
                {
                    traitements.map((traitement, index) => (
                        <Stack key={traitement.id} style={{border: `1px solid #E0E0E0`}} spacing={1}
                               padding={1} borderRadius={2}>
                            <Stack direction={"row"}
                                   justifyContent={"space-between"}
                                   spacing={1}
                                   alignItems={"center"}>
                                <input style={{width: 90, border: 0,fontSize:10,color:"#737780"}} value={traitement.name}
                                       onChange={(ev) => {
                                           traitements[index].name = ev.target.value;
                                           setTraitements([...traitements])
                                       }}></input>
                                <div onClick={() => {
                                    traitements[index].showPicker = !traitements[index].showPicker;
                                    setTraitements([...traitements]);
                                }}
                                     style={{
                                         background: traitement.color,
                                         width: 18,
                                         height: 18,
                                         borderRadius: 7
                                     }}></div>
                            </Stack>

                            {traitement.showPicker && <GithubPicker width={"130"}
                                                                    onChange={(ev) => {
                                                                        traitements[index].color = ev.hex;
                                                                        traitements[index].showPicker = false;
                                                                        setTraitements([...traitements])
                                                                    }}/>}


                            <Typography fontSize={9}>{t('selectTeeth')}</Typography>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        padding: "5px"
                                    }
                                }}
                                multiple
                                value={traitement.tooths}
                                onChange={(res) => {
                                    handleChange(res, index)
                                }}
                                input={<OutlinedInput placeholder={'11'} id="select-multiple-chip"
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
                                {tooths.map((teeth) => (
                                    <MenuItem
                                        key={teeth.id}
                                        value={teeth.id}
                                        style={getStyles(teeth.id, traitement.tooths, theme)}
                                    >
                                        {teeth.id}
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
                                        padding: "5px"
                                    }
                                }}
                                value={traitement.acts}
                                onChange={(res) => {
                                    handleChangeAct(res, index)
                                }}
                                input={<OutlinedInput placeholder={'11'} id="select-multiple-chip" label="Chip"/>}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {

                                            selected.map((value) => {
                                                const role = acts?.find((a:any) => a.uuid === value);
                                                return (<Chip key={value} label={role.act.name} style={{fontSize: 9}}/>)
                                            })
                                        }
                                    </Box>
                                )}
                                MenuProps={MenuProps}>
                               {acts && acts.map((act:any) => <MenuItem key={act.uuid}
                                                          style={getStyles(act.uuid, traitement.acts, theme)}
                                                          value={act.uuid}>{act.act.name}</MenuItem>)}

                           </Select>

                        </Stack>))
                }

                <Button
                    onClick={() => {
                        const max = traitements.reduce((acc, shot) => acc = acc > shot.id ? acc : shot.id, 0);
                        traitements = [...traitements, {
                            id: max + 1,
                            name: `${t('traitement')} ${max + 1}`,
                            color: '#006B76',
                            showPicker: false,
                            tooths: [],
                            acts: []
                        }]
                        setTraitements([...traitements])
                    }
                    }
                    size="small"
                    style={{width: "fit-content"}}
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
                <DialogTitle style={{cursor: 'move', color: theme.palette.primary.main}} id="draggable-dialog-title">
                    {t('teeth')} {open}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Stack direction={"row"}>
                            <FormControlLabel control={<Checkbox checked={absent.find(a => a === open) !== undefined}
                                                                 onChange={(ev) => {
                                                                     if (ev.target.checked)
                                                                         absent.push(open)
                                                                     else absent.splice(absent.findIndex(a => a === open), 1);
                                                                     setAbsent([...absent]);
                                                                     setOpen("")
                                                                 }}/>} label={t('absente')}/>
                            {traitements.map((traitement, index) => (
                                <FormControlLabel key={traitement.id} control={<Checkbox
                                    checked={traitement.tooths.find(t => t === open) !== undefined} onChange={(ev) => {
                                    const tooths:string[] = traitement.tooths;
                                    const st = traitement.tooths.findIndex(t => t === open)
                                    if (st >= 0) tooths.splice(st, 1)
                                    else tooths.push(open)
                                    traitements[index].tooths = tooths;
                                    setTraitements([...traitements])
                                    setOpen("")
                                }}/>} label={traitement.name}/>
                            ))}
                        </Stack>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Card>
    )
}