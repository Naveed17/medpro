import {CardActions, CardContent, InputBase} from "@mui/material";
import React from "react";
import {motion} from "framer-motion";
import RootStyled from "./overrides/rootStyle";
import {RecButton} from "@features/buttons";
import SpeechRecognition from "react-speech-recognition";
import {SetListen} from "@features/toolbar";

function ExpandableCard({...props}) {
    const {
        note,
        setNote,
        setIsNote,
        editPatientInfo,
        t,
        resetTranscript,
        setIsStarted,
        listening,
        dispatch,
        setOldNote,
        isStarted
    } = props;

    const startStopRec = () => {
        if (listening && isStarted) {
            SpeechRecognition.stopListening();
            resetTranscript();
            setIsStarted(false);
            dispatch(SetListen(""));
        } else {
            resetTranscript();
            setIsStarted(true);
            dispatch(SetListen("note"));
            setOldNote(note);
            SpeechRecognition.startListening({
                continuous: true,
                language: "fr-FR",
            }).then(() => {
            });
        }
    }
    return (
        <RootStyled component={motion.div} layout>
            <CardContent>
                <InputBase
                    multiline={note.length > 10}
                    autoFocus
                    placeholder={t("writenote")}
                    onChange={(val) => {
                        setNote(val.target.value);
                    }}
                    onBlur={() => {
                        setIsNote(false);
                        editPatientInfo();
                    }}
                    rows={7}
                    value={note}
                    fullWidth
                />
            </CardContent>
            <CardActions>
                {/*<Button
                    component={motion.button}
                    layout
                    transition={{
                        default: "1s",
                    }}
                    color="error"
                    variant="outlined"
                    className="btn-action btn-del">
                    <IconUrl path="setting/icdelete"/>
                    <Typography ml={1}>{t("del")}</Typography>
                </Button>*/}
                <RecButton onClick={() => {
                    startStopRec();
                }}/>
                {/* <Button variant="outlined" className="btn-action btn-save">
                    <SaveIcon/>
                    <Typography ml={1}>{t("save")}</Typography>
                </Button>*/}
            </CardActions>
        </RootStyled>
    );
}

export default ExpandableCard;
