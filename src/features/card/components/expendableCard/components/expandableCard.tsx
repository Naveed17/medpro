import {CardActions, CardContent, InputBase} from "@mui/material";
import React from "react";
import {motion} from "framer-motion";
import RootStyled from "./overrides/rootStyle";
import {RecButton} from "@features/buttons";
import SpeechRecognition from "react-speech-recognition";
import {SetListen} from "@features/toolbar";
import {debounce} from "lodash";

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
            editPatientInfo();
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

    const debouncedOnChange = debounce(editPatientInfo, 1000);

    return (
        <RootStyled component={motion.div} layout>
            <CardContent>
                <InputBase
                    multiline={true}
                    autoFocus
                    placeholder={t("writenote")}
                    onChange={(val) => {
                        debouncedOnChange()
                        setNote(val.target.value);
                    }}
                    rows={7}
                    value={note}
                    fullWidth
                />
            </CardContent>
            <CardActions>
                <RecButton
                small
                onClick={() => {
                    startStopRec();
                }}/>
            </CardActions>
        </RootStyled>
    );
}

export default ExpandableCard;
