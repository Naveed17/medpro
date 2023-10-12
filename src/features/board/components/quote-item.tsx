// @flow
import React from 'react';
import styled from '@emotion/styled';
import {DraggableProvided} from "react-beautiful-dnd";
import {Card, CardActions, CardContent, Stack, Typography} from "@mui/material";
import TimeIcon from "@themes/overrides/icons/time";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {ImageHandler} from "@features/image";
import {ModelDot} from "@features/modelDot";
import {IconsTypes} from "@features/calendar";

const getBorderColor = (isDragging: boolean, authorColors: any) =>
    isDragging ? authorColors.hard : 'transparent';

const imageSize: number = 40;

const CloneBadge = styled.div`
  bottom: ${1 / 2}px;

  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);

  height: ${imageSize}px;
  width: ${imageSize}px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

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

const Avatar = styled.img`
  width: ${imageSize}px;
  height: ${imageSize}px;
  border-radius: 50%;
  margin-right: 1px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;

  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;

  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.div`
  &::before {
    content: open-quote;
  }

  &::after {
    content: close-quote;
  }
`;

const Footer = styled.div`
  display: flex;
  margin-top: 1px;
  align-items: center;
`;

const Author = styled.small`
 
  flex-grow: 0;
  margin: 0;
 
  border-radius: 1px;
  font-weight: normal;
  padding: 1px;
`;

const QuoteId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
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

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function QuoteItem({...props}) {
    const {
        quote,
        isDragging,
        isGroupedOver,
        provided,
        style,
        isClone,
        index,
    } = props;

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
            <Card sx={{minWidth: 200}}>
                <CardContent sx={{p: 1}}>
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
                    <Stack direction={"row"} alignItems={"center"} mt={1} spacing={1}>
                        <ModelDot
                            icon={quote.content.type && IconsTypes[quote.content.type.icon]}
                            color={quote.content.type?.color}
                            selected={false}
                            size={20} sizedot={12} padding={3}></ModelDot>
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


                </CardActions>
            </Card>
        </Container>
    );
}

export default React.memo<any>(QuoteItem);
