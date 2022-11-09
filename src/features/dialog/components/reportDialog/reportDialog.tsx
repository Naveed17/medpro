import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {Box, Button} from "@mui/material";
import dynamic from "next/dynamic";
import {styled} from "@mui/material/styles";
import jsPDF from "jspdf";
const Editor = dynamic(() => import('@features/editor/editor'), {
    ssr: false,
});
function ReportDialog({...props}) {

    //const {data} = props
   // const [value, setValue] = useState<string>('');
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [data, setData] = useState("");
    const doc = new jsPDF({
        format: 'a5'
    });
    const width = doc.internal.pageSize.width;
    const height = doc.internal.pageSize.height;
    /* useEffect(() => {
         data.state.content = ''
         setValue(data.state.content)
         data.setState(data.state)
     }, [data])*/

    useEffect(() => {
        setEditorLoaded(true);
    }, []);
    const {t, ready} = useTranslation("consultation");
    if (!ready) return (<>loading translations...</>);

    return (
        <Box>
            <Button onClick={()=>{
                doc.html(`<div style="width: ${width};border: 1px solid ">AaaaaaAaaaaaAaaaaaAaaaaabbbbbbbb</div>`,{
                    autoPaging:"text",
                    width:width,
                    callback: () =>{
                        doc.save("OK")
                    }
                })
            }}>Xxxx</Button>
            <div className="App">
                <Editor
                    name="description"
                    onChange={(data: React.SetStateAction<string>) => {
                        setData(data);
                    }}
                    editorLoaded={editorLoaded}
                />


            </div>
            {/*<div style={'width:width,height:height,"background-color":"red","word-wrap": "break-word"'}>
                <p>Aaaaaaaaaaaaaaaaaaaaaaaa</p>
            </div>*/}
            {/*<Typography variant="subtitle1"
                        fontWeight={600}
                        marginTop={4}
                        align={"center"}
                        letterSpacing={2}
                        marginBottom={2}>
                {t('RAPPORT MEDICAL')}
            </Typography>
            <Box>
                <TextField
                    multiline
                    rows={10}
                    style={{width:"100%"}}
                    value={value}
                    placeholder={t('consultationIP.reportPlaceholder')}
                    onChange={(ev)=>{
                        setValue(ev.target.value)
                        data.state.content =ev.target.value;
                        data.setState(data.state)
                    }}
                />
            </Box>*/}
        </Box>
    )
}

export default ReportDialog
