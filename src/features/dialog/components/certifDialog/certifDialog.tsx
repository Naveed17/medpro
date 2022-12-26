import {useTranslation} from "next-i18next";
import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import dynamic from "next/dynamic";
import {ModelDot} from "@features/modelDot";
import AddIcon from "@mui/icons-material/Add";

const CKeditor = dynamic(() => import('@features/CKeditor/ckEditor'), {
    ssr: false,
});

function CertifDialog({...props}) {

    const colors = ["#FEBD15", "#FF9070", "#DF607B", "#9A5E8A", "#526686", "#96B9E8", "#0696D6", "#56A97F"];
    const {data} = props
    const [value, setValue] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState(["#0696D6"]);
    const [title, setTitle] = useState<string>('');
    const [models, setModels] = useState<DocTemplateModel[]>([]);


    useEffect(() => {
        data.state.content = `<p style="color:hsl(0, 0%, 0%);">Je soussigné, Dr ${data.state.name} certifie avoir examiné ce  jour : ${data.state.patient} et que son etat de sante necessite un repos de ${data.state.days} jour(s) a compter de ce jour, sauf complications ulterieures</p>`
        setValue(data.state.content)
        data.setState(data.state)
    }, [data])
    const {t, ready} = useTranslation("consultation");
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <Box>
            <Grid container>
                <Grid item xs={12} md={9} className={'container-scroll'}>
                    <Box style={{height: 200}} color={'primary.main'}>
                        <Box style={{paddingRight: 20}}>
                            <Typography style={{color: "gray"}} fontSize={12}
                                        mb={1}>{t('consultationIP.title')}</Typography>
                            <Stack alignItems={"center"} spacing={1} direction={"row"}>
                                <TextField
                                    style={{width: "100%"}}
                                    value={title}
                                    onChange={(ev) => {
                                        setTitle(ev.target.value)
                                    }}/>
                                {selectedColor.map(color => (
                                    <ModelDot
                                        key={color}
                                        color={color}
                                        onClick={() => {
                                            if (selectedColor.length === 1)
                                                setSelectedColor([...colors])
                                            else setSelectedColor([color])
                                            // setFieldValue("color", color);
                                        }}>
                                    </ModelDot>
                                ))}
                            </Stack>


                            <Typography style={{color: "gray"}} fontSize={12} mt={1}
                                        mb={1}>{t('consultationIP.contenu')}</Typography>
                            <CKeditor
                                name="description"
                                value={value}
                                onChange={(res: React.SetStateAction<string>) => {
                                    console.log(res)

                                    data.state.content = res;

                                    data.setState(data.state)
                                    setValue(res)
                                    //data.setState(data.state)
                                }}
                                editorLoaded={true}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={3} style={{borderLeft: '1px solid #DDDDDD'}}>

                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant={'h6'} marginLeft={2} marginTop={1}>{t('Models')}</Typography>
                        <Button sx={{ml: 'auto', height: 1}}
                                size='small'
                                disabled={title.length === 0 || value.length === 0}
                                onClick={() => {
                                    const stringToHTML = new DOMParser().parseFromString(value, 'text/html').body.firstChild

                                    models.push({
                                        color: selectedColor[0],
                                        name: title,
                                        title: title,
                                        content: (stringToHTML as HTMLElement)?.innerHTML
                                    });
                                    setModels([...models])

                                }}
                                startIcon={<AddIcon/>}>
                            {t('consultationIP.createAsModel')}
                        </Button>
                    </Stack>
                    <List sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper',
                        overflowX: "scroll",
                        height: '21rem'
                    }}>
                        {models.map((item, index) => (
                            <Box key={`models-${index}`}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            bgcolor: item.color,
                                            color: "white",
                                            textTransform: "uppercase"
                                        }}>{item.title[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.title}
                                        className={"resume3Lines"}
                                        secondary={
                                            <React.Fragment>
                                                {item.content}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li"/>
                            </Box>
                        ))}

                        {models.length === 0 &&
                            <Stack spacing={2}>
                                <Typography textAlign={"center"} color={"gray"} fontSize={12}>
                                    ( {t("consultationIP.list_empty")} )
                                </Typography>
                                <List>
                                    {
                                        Array.from({length: 3}).map((_, idx) =>
                                            idx === 0 ? <ListItem key={idx} sx={{py: .5}}>
                                                    <Skeleton width={300} height={8} variant="rectangular"/>
                                                </ListItem> :
                                                <ListItem key={idx} sx={{py: .5}}>
                                                    <Skeleton width={10} height={8} variant="rectangular"/>
                                                    <Skeleton sx={{ml: 1}} width={130} height={8}
                                                              variant="rectangular"/>
                                                </ListItem>
                                        )
                                    }

                                </List>
                            </Stack>
                        }
                    </List>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CertifDialog
