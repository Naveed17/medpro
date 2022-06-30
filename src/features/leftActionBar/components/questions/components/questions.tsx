import React, { useState } from 'react'
import { Box, Tab, List, ListItem, Typography, Link } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTheme } from '@mui/material/styles'
import Icon from '@themes/urlIcon';
import QuestionStyled from './overrides/questionsStyle';
function Questions() {
    const theme = useTheme();
    const [value, setValue] = useState('1');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <QuestionStyled>
            <TabContext value={value}>
                <Box className='tab-container'>
                    <TabList onChange={handleChange}>
                        <Tab label="In progress" value="1" />
                        <Tab label="Closed" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <List>
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <ListItem key={idx}>
                                <Box>
                                    <Typography variant="body2" color='text.primary'>
                                        Dr Doctor
                                    </Typography>
                                    <Typography className='date-container' component="div" variant="body2">
                                        <Icon path="ic-agenda" />
                                        01/10/2021
                                    </Typography>
                                </Box>
                                <Link className="link" href="/">
                                    analysis result
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
