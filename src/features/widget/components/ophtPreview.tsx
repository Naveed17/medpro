import {Stack} from "@mui/material";
import React from "react";

export default function OphtPreview({...props}) {
    const acuiteVisuelle = [
        {
            name: "Réfraction subjective",
            od: {av: "-", sphere: "", cylindre: "", axe: ""},
            og: {av: "-", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "Correction de loin",
            od: {av: "", sphere: "", cylindre: "", axe: ""},
            og: {av: "", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "Correction de prés",
            od: {av: "", sphere: "", cylindre: "", axe: ""},
            og: {av: "", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "Prescription finale",
            od: {av: "L", sphere: "", cylindre: "", axe: ""},
            og: {av: "L", sphere: "", cylindre: "", axe: ""},
            od2: {av: "P", sphere: "", cylindre: "", axe: ""},
            og2: {av: "P", sphere: "", cylindre: "", axe: ""},
        },
        {
            name: "Lentille",
            od: {av: "-", sphere: "", cylindre: "",axe:""},
            og: {av: "-", sphere: "", cylindre: ""},
        },
    ]
    return (
        <Stack spacing={1} direction={"row"}>
            <table style={{width: "100%"}}>
                <tbody>
                <tr>
                    <td></td>
                    <td colSpan={3} style={{textAlign: "center"}}>Oeil droite</td>
                    <td colSpan={3} style={{textAlign: "center"}}>Oeil gauche</td>
                </tr>
                <tr>
                    <td></td>

                    <td>AV</td>
                    <td>Sphére</td>
                    <td>Cylindre</td>
                    <td>Axe</td>

                    <td>AV</td>
                    <td>Sphére</td>
                    <td>Cylindre</td>
                    <td>Axe</td>
                </tr>
                <tr>
                    <td>Réfraction subjective</td>
                    <td>1</td>
                    <td>3</td>
                    <td>4</td>

                    <td>2</td>
                    <td>3</td>
                    <td>1</td>
                </tr>
                </tbody>

            </table>
        </Stack>
    )
}
