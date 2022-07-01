import React, { useState, useEffect } from 'react'
import { Box, Tab, List, ListItem, Typography, Link } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Icon from '@themes/urlIcon';
import QuestionStyled from './overrides/questionsStyle';
import { useTranslation } from 'next-i18next';
import { useAppDispatch } from "@app/redux/hooks";
import { setQs } from "@features/leftActionBar";
import { upperFirst } from 'lodash';
import data from './config';

function Questions() {
    const [value, setValue] = useState('1');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setQs(data[0]));
    }, []);


    const { t, ready } = useTranslation('questions');
    if (!ready) return (<>loading translations...</>);
    return (
        <QuestionStyled>
            <TabContext value={value}>
                <Box className='tab-container'>
                    <TabList onChange={handleChange}>
                        <Tab label={upperFirst(t('in_progress'))} value="1" />
                        <Tab label={upperFirst(t('closed'))} value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <List>
                        {data.map((item, idx) => (
                            <ListItem key={idx} onClick={() => dispatch(setQs(item))}>
                                <Box>
                                    <Typography variant="body2" color='text.primary'>
                                        {item.patient.illness}
                                    </Typography>
                                    <Typography className='date-container' component="div" variant="body2">
                                        <Icon path="ic-agenda" />
                                        {item.date}
                                    </Typography>
                                </Box>
                                <Link className="link">
                                    {item.question}
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
                <TabPanel value="2">
                    <List>
                        <ListItem>
                            Closed data
                        </ListItem>
                    </List>
                </TabPanel>
            </TabContext>

        </QuestionStyled>
    )
}

export default Questions
