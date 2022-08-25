import React, { useState } from 'react'
import ConsultationModalDialogStyle from './overides/consultationModalDialogStyle'
import { List, ListItem, FormControlLabel, Checkbox, Collapse, Paper } from '@mui/material'
import Icon from '@themes/urlIcon'
function ConsultationModalDialog({ data: propsData }: { data: any }) {
    const [open, setOpen] = useState('');
    const [genral, setGenral] = useState<any[]>([]);
    const [cardio, setCardio] = useState<any[]>([]);
    const [autre, setAutre] = useState<any[]>([]);
    const handleOpen = (id: string) => {
        if (open === id) {
            setOpen('');
        } else {
            setOpen(id);
        }
    };
    const { data, change } = propsData;
    const handleChangeParent = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
        event.stopPropagation();
        const children = data.find((item: any) => {
            return item.children
        });
        if (name === "general") {
            const add = children.children.map((item: any) => {
                return item.name
            });
            if (event.target.checked) {
                setGenral(add);
            } else {
                setGenral([]);
            }
        }
        if (name === 'cardio') {
            const add = data.map((item: any) => {
                return item.name
            });
            if (event.target.checked) {
                setCardio(add);
            }
            else {
                setCardio([]);
            }
        }
        if (name === 'autre') {
            const add = data.map((item: any) => {
                return item.name
            });
            if (event.target.checked) {
                setAutre(add);
            }
            else {
                setAutre([]);
            }
        }


    }
    const handleChangeChild = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
        if (event.target.checked) {
            if (name === "general") {
                setGenral([...genral, event.target.name]);
            }

        }
        else {
            if (name === "general") {
                const filtered = genral.filter((item: any) => item !== event.target.name);
                setGenral(filtered);
            }
        }

    }
    return (
        <ConsultationModalDialogStyle>
            {!change ?
                <List>
                    {data.map((item: any, index: number) => (
                        <ListItem key={`parent-${index}`} onClick={() => handleOpen(item.name)}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={item.name === 'general' && genral.length > 0
                                        || item.name === 'cardio' && cardio.length > 0
                                        || item.name === 'autre' && autre.length > 0
                                    } onChange={(e) => handleChangeParent(e, item.name)} name={item.name} />
                                }
                                label={item.label}

                            />

                            {item.children && (
                                <>
                                    <Icon path="ic-flesh-bas-y" className='collapse' />
                                    <Collapse in={item.name === open} timeout="auto" unmountOnExit>
                                        <Paper>
                                            <List component="div" disablePadding>
                                                {item.children.map((child: any) => (
                                                    <ListItem component='div' key={child.name}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox checked={item.name === 'general' && genral.indexOf(child.name) > -1}
                                                                    onChange={(e) => handleChangeChild(e, item.name)}
                                                                    name={child.name} />
                                                            }
                                                            label={child.label}
                                                        />
                                                    </ListItem>
                                                )
                                                )}
                                            </List>
                                        </Paper>
                                    </Collapse>
                                </>
                            )}
                        </ListItem>
                    ))}
                </List>
                : null}
        </ConsultationModalDialogStyle>
    )
}

export default ConsultationModalDialog