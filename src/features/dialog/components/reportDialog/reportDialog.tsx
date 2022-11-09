import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {Box, Button} from "@mui/material";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import {styled} from "@mui/material/styles";

const Editor = dynamic(() => import('@features/editor/editor'), {
    ssr: false,
});

function ReportDialog({...props}) {

    const TableStyled = styled("div")(({theme}) => ({
        wordWrap:"break-word",
        width: '148px',
        height:'148px',

        border: '1px solid',
        "& p,ol,ul":{
            fontSize: 5,
            margin:0
        }
    }));
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [data, setData] = useState("");
    const doc = new jsPDF({
        format: 'a5'
    });

    /* useEffect(() => {
         setEditorLoaded(true);
     }, []);

     useEffect(()=>{
         (document?.getElementById("xx") as HTMLElement).innerHTML = data;
         console.log(data)

     },[data])*/
    const {t, ready} = useTranslation("consultation");
    if (!ready) return (<>loading translations...</>);

    return (
        <Box>

            <div className="App">
                <Editor
                    name="description"
                    onChange={(data: React.SetStateAction<string>) => {
                        setData(data);
                    }}
                    editorLoaded={editorLoaded}
                />

                <Button onClick={() => {
                    doc.html((document.getElementById("xx") as HTMLElement), {
                        autoPaging: "text",
                        y:30,
                        callback: () => {
                            doc.save("OK")
                        }
                    })
                }}>Xxxx</Button>
                <TableStyled id={"xx"}></TableStyled>
            </div>
        </Box>
    )
}

export default ReportDialog
