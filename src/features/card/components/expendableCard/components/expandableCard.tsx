import {CardActions, CardContent, InputBase} from "@mui/material";
import React, {useCallback} from "react";
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
        editPatientInfo,
        t,
        resetTranscript,
        setIsStarted,
        listening,
        dispatch,
        setOldNote,
        isStarted
    } = props;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedOnChange = useCallback(
        debounce((value) => {
            editPatientInfo(value)
        }, 1000), []);

    const startStopRec = () => {
        if (listening && isStarted) {
            SpeechRecognition.stopListening();
            resetTranscript();
            setIsStarted(false);
            editPatientInfo(note);
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
                    multiline={true}
                    autoFocus
                    placeholder={t("writenote")}
                    onChange={(val) => {
                        setNote(val.target.value);
                        debouncedOnChange(val.target.value)
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
