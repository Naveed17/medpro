import React from 'react';
import styled from '@emotion/styled';
import {DraggableProvided} from "react-beautiful-dnd";
import {Button, Card, CardActions, CardContent, IconButton, Stack, Typography, useTheme} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {ImageHandler} from "@features/image";
import {ModelDot} from "@features/modelDot";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconUrl from "@themes/urlIcon";
import {CustomIconButton} from "@features/buttons";

const imageSize: number = 40;

const Container = styled.a`
  border-radius: 1px;
  text-decoration: auto;
  border: 2px solid transparent;
  box-sizing: border-box;
  padding: 1px;
  min-height: ${imageSize}px;
  margin-bottom: 1px;
  user-select: none;

  /* anchor overrides */
 

  &:hover,
  &:active {
   
    text-decoration: none;
  }

  &:focus {
    outline: none;
    
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

function getStyle(provided: DraggableProvided, style: Object | null) {
    if (!style) {
        return provided.draggableProps.style;
    }

    return {
        ...provided.draggableProps.style,
        ...style,
    };
}

function BoardItem({...props}) {
    const {
        quote,
        isDragging,
        isGroupedOver,
        provided,
        style,
        isClone,
        index,
    } = props;
    const theme = useTheme();

    return (
        <Container
            href={quote.author.url}
            isDragging={isDragging}
            isGroupedOver={isGroupedOver}
            isClone={isClone}
            colors={quote.author.colors}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getStyle(provided, style)}
            data-is-dragging={isDragging}
            data-testid={quote.id}
            data-index={index}
            aria-label={`${quote.author.name} quote ${quote.content}`}>
            <Card sx={{width: "96%"}}>
                <CardContent sx={{p: 1}}>
                    <Stack direction={"row"} spacing={.5} alignItems={"start"} justifyContent={"space-between"}>
                        <Stack>
                            <Typography color={"primary"} fontWeight={400} fontSize={14}>
                                {quote.content.patient.lastName} {quote.content.patient.firstName}
                            </Typography>
                            <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                                {quote.content.patient.contact[0].flag && <ImageHandler
                                    sx={{
                                        width: 26,
                                        height: 18,
                                        borderRadius: 0.4
                                    }}
                                    alt={"flags"}
                                    src={`https://flagcdn.com/${quote.content.patient.contact[0].flag.toLowerCase()}.svg`}
                                />}
                                <Typography variant="body2" fontWeight={400} fontSize={11} color="text.primary">
                                    {quote.content.patient.contact[0].code} {quote.content.patient.contact[0].value}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack direction={"row"} spacing={1}>
                            {quote.content.status === 1 && <>
                                <IconButton
                                    size={"small"}
                                    sx={{border: `1px solid ${theme.palette.divider}`, borderRadius: 1}}>
                                    <PlayCircleIcon fontSize={"small"}/>
                                </IconButton>
                                <IconButton
                                    size={"small"}
                                    disableFocusRipple
                                    sx={{background: theme.palette.primary.main, borderRadius: 1}}>
                                    <IconUrl color={"white"} width={20} height={20} path="ic_waiting_room"/>
                                </IconButton>
                            </>}
                            {quote.content.status === 3 && <>
                                <CustomIconButton
                                    variant="filled"
                                    color={"warning"}
                                    size={"small"}>
                                    <PlayCircleIcon fontSize={"small"}/>
                                </CustomIconButton>
                            </>}
                        </Stack>
                    </Stack>

                    <Stack direction={"row"} alignItems={"center"} mt={1} spacing={1}>
                        <ModelDot
                            color={quote.content.type?.color}
                            selected={false}
                            size={18} sizedot={10} padding={3}></ModelDot>
                        <Typography fontWeight={400} fontSize={12}>
                            {quote.content.type?.name}
                        </Typography>
                    </Stack>
                </CardContent>
                <CardActions>
                    <Stack direction={"row"} spacing={.5} alignItems={"center"}>
                        <AccessTimeIcon sx={{width: 16, height: 16}}/>
                        <Typography variant="body2" fontWeight={700} fontSize={14} color="text.primary">
                            {quote.content.startTime}
                        </Typography>
                    </Stack>

                    <Button
                        sx={{
                            p: 0,
                            minWidth: '2.5rem',
                            minHeight: '.5rem',
                            marginLeft: 'auto'
                        }} variant={"contained"} size={"small"}> AR -1</Button>
                </CardActions>
            </Card>
        </Container>
    )
        ;
}

export default React.memo<any>(BoardItem);
