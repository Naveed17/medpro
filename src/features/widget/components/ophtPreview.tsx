import {Autocomplete, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import OphtTableStyled from "@features/widget/components/overrides/ophtTable";

export default function OphtPreview({...props}) {
    const subTitle = ['av', 'sphere', 'cylindre', 'axe']
    const acuiteVisuelle = [
        {
            name: "Réfraction subjective",
            lignes: 1,
            od: {av: "x", sphere: "-", cylindre: "-", axe: "-"},
            og: {av: "x", sphere: "-", cylindre: "-", axe: "-"},
        },
        {
            name: "Correction de loin",
            lignes: 1,
            od: {av: "-", sphere: "-", cylindre: "-", axe: "-"},
            og: {av: "-", sphere: "-", cylindre: "-", axe: "-"},
        },
        {
            name: "Correction de prés",
            lignes: 1,
            od: {av: "-", sphere: "-", cylindre: "-", axe: "-"},
            og: {av: "-", sphere: "-", cylindre: "-", axe: "-"},
        },
        {
            name: "Prescription finale",
            lignes: 2,
            od: {av: "L", sphere: "-", cylindre: "-", axe: "-"},
            og: {av: "L", sphere: "-", cylindre: "-", axe: "-"},
        },
        {
            name: "",
            lignes: 1,
            od: {av: "P", sphere: "-", cylindre: "-", axe: "-"},
            og: {av: "P", sphere: "-", cylindre: "-", axe: "-"},
        },
        {
            name: "Lentille",
            lignes: 1,
            od: {av: "x", sphere: "-", cylindre: "-", axe: "-"},
            og: {av: "x", sphere: "-", cylindre: "-", axe: "-"},
        },
    ]

    const [open, setOpen] = useState(false);

    return (
        <Stack spacing={1} direction={"row"}>
            <OphtTableStyled style={{width: "100%"}} onClick={()=>{setOpen(true)}}>
                <tbody>
                <tr>
                    <td className={"col"}></td>
                    <td colSpan={4} className={"title center col"}>Oeil droite</td>
                    <td colSpan={4} className={"title center col"}>Oeil gauche</td>
                </tr>
                <tr>
                    <td className={"col"}></td>
                    {subTitle.map(st => (
                        <td  className={"subtitle col"} key={`od-${st}`}>{st}</td>
                    ))}
                    {subTitle.map(st => (
                        <td className={"subtitle col"} key={`og-${st}`}>{st}</td>
                    ))}
                </tr>

                {acuiteVisuelle.map(av => (
                    <tr key={av.name}>
                        {av.name && <td rowSpan={av.lignes} className={"title col"}>{av.name}</td>}
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
                onClose={()=>setOpen(false)}
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

                    <table style={{width: "100%"}}>
                        <tbody>
                        <tr>
                            <td className={"col"}></td>
                            <td colSpan={4} className={"title center col"}>Oeil droite</td>
                            <td colSpan={4} className={"title center col"}>Oeil gauche</td>
                        </tr>
                        <tr>
                            <td className={"col"}></td>
                            {subTitle.map(st => (
                                <td  className={"subtitle col"} key={`od-${st}`}>{st}</td>
                            ))}
                            {subTitle.map(st => (
                                <td className={"subtitle col"} key={`og-${st}`}>{st}</td>
                            ))}
                        </tr>

                        {acuiteVisuelle.map(av => (
                            <tr key={av.name}>
                                {av.name && <td rowSpan={av.lignes} className={"title col"}>{av.name}</td>}
                                {subTitle.map((od, index) => (
                                    <td className={"col"} key={`od-${index}`}>
                                        <Autocomplete
                                            disablePortal
                                            size={"small"}
                                            id="combo-box-demo"
                                            options={["1","2","3"]}
                                            sx={{ width: 100 }}
                                            renderInput={(params) => <TextField {...params} label="Movie" />}
                                        />
                                    </td>
                                ))}

                                {subTitle.map((og, index) => (
                                    <td className={"col"} key={`og-${index}`}>
                                        <Autocomplete
                                            disablePortal
                                            value={av.og[og]}
                                            placeholder={"-"}
                                            id="combo-box-demo"
                                            size={"small"}
                                            freeSolo={true}
                                            options={["1","2","3"]}
                                            sx={{ width: 100 }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </DialogContent>
            </Dialog>
        </Stack>
    )
}
