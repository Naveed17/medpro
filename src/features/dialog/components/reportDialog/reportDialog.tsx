import {useTranslation} from "next-i18next";
import React, {useEffect, useRef, useState} from "react";
import {Button, Grid} from "@mui/material";
import dynamic from "next/dynamic";
import {styled} from "@mui/material/styles";
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from "jspdf";
import {LoadingScreen} from "@features/loadingScreen";

const CKeditor = dynamic(() => import('@features/CKeditor/ckEditor'), {
    ssr: false,
});

function ReportDialog({...props}) {

    const TableStyled = styled("div")(({theme}) => ({
        wordWrap: "break-word",
        width: '148px',
        height: '148px',

        "& p,ol,ul": {
            fontSize: 5,
            margin: 0
        }
    }));
    const componentRef = useRef<any>(null)
    const [file, setFile] = useState<string>('');
    const [numPages, setNumPages] = useState<number | null>(null);
    const doc = new jsPDF({
        format: 'a5'
    });

    const [editorLoaded, setEditorLoaded] = useState(false);
    const [data, setData] = useState("");
    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    useEffect(() => {
        const el = document.getElementById("preview");
        (el as HTMLElement).innerHTML = data
    }, [data])

    const print = () => {
        const el = document.getElementById("preview");

        doc.html((el as HTMLElement), {
            x: 10,
            y: 10,
            callback: () => {
                doc.save()
            }
        })
        doc.save();
    }
    const {t, ready} = useTranslation("consultation");
    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <div>
            <Grid container spacing={0}>
                <Grid item xs={10}>
                    <CKeditor
                        name="description"
                        onChange={(data: React.SetStateAction<string>) => {
                            setData(data);
                        }}
                        editorLoaded={editorLoaded}/>
                </Grid>
                <Grid item xs={2}>
                    <Button onClick={print}>
                        <PrintIcon/>
                    </Button>
                    <TableStyled id={'preview'}></TableStyled>
                </Grid>
            </Grid>
        </div>
    );
}

export default ReportDialog
