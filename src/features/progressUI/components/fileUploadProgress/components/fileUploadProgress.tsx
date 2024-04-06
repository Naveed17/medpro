import React, {useRef, useState} from 'react'
import {Box, IconButton, LinearProgress, Stack, Typography} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import FileUploadProgressStyled from './overrides/fileUploadProgressStyle';
import Icon from '@themes/urlIcon'
import {Theme, useTheme} from '@mui/material/styles';
import {useWavesurfer} from "@wavesurfer/react";
import IconUrl from "@themes/urlIcon";

function FileUploadProgress({...props}) {
    const {file, progress, handleRemove, ...rest} = props
    const theme = useTheme() as Theme;
    const containerRef = useRef<any>();

    const [fileUrl] = useState<any>(URL.createObjectURL(file));
    const [duration, setDuration] = useState<any>(null);

    const formatTime = (seconds: any) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

    const {wavesurfer, isPlaying, currentTime} = useWavesurfer({
        container: containerRef,
        url: fileUrl,
        height: 50,
        barWidth: 3,
        barGap: 3,
        barRadius: 2
    });

    wavesurfer?.on('decode', (duration) => (setDuration(formatTime(duration))));

    const onPlayPause = () => {
        wavesurfer && wavesurfer.playPause()
    }


    return (
        <FileUploadProgressStyled
            {...rest}
            sx={{
                width: "100%",
                mx: "auto",
                mt: 2,
            }}>
            <Stack direction={"row"} alignItems={"center"}>
                {file.type.includes("audio") ?
                    <IconButton
                        className={"player"}
                        onClick={(event: any) => {
                            event.stopPropagation();
                            onPlayPause();
                        }}>
                        <IconUrl path={isPlaying ? "ic-pause" : "ic-play-audio"}
                                 color={theme.palette.text.primary} width={18}
                                 height={18}/>
                    </IconButton>
                    :
                    <Icon path="ic-quote" width={30} height={30}/>
                }
                <Box sx={{width: "100%", ml: 1}}>
                    <Typography
                        {...(file.type.includes("audio") && {className: "audio-title"})}
                        variant="body2"
                        color="text.primary"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                            textTransform: "uppercase",
                        }}>
                        {file.name}
                        <Typography ml={1} component='span' variant="body2" color="text.secondary">
                            {file && parseInt(file.size) / 1000} KB
                        </Typography>
                    </Typography>
                    {!file.type.includes("audio") ? <LinearProgress
                            value={progress}
                            variant="determinate"
                            color="success"
                            sx={{bgcolor: theme.palette.divider, borderRadius: "4px"}}
                        />
                        :
                        <div id="waveform" ref={containerRef}>
                            <div id="time">{formatTime(currentTime)}</div>
                            <div id="duration">{duration}</div>
                            <div id="hover"></div>
                        </div>}
                </Box>
                <IconButton
                    className='btn-close' size="small"
                    onClick={() => handleRemove(file)}>
                    <CloseIcon/>
                </IconButton>
            </Stack>
        </FileUploadProgressStyled>

    )
}

export default React.memo(FileUploadProgress);
