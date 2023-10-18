import React, { useEffect, useState } from 'react'
import {Box, Button, Card, CardContent, FormControl, IconButton, MenuItem, Select, Stack, TextField, Theme, Typography} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import AddIcon from "@mui/icons-material/Add";
import { motion } from 'framer-motion';
import CheckCard from './checkCard';

function PaymentCard({...props}) {
    const {t,paymentTypesList,item,i,formik,devise} = props;
    const {setFieldValue,values} = formik
    const openPanel = paymentTypesList.find((panel:any)=>panel.uuid === item.selected);
    const addCheck = () => setFieldValue(`paymentMethods[${i}].check`,[...values.paymentMethods[i].check,{
            amount: "",
            carrier: "",
            bank: "",
            check_number: '',
            payment_date: new Date(),
            expiry_date: new Date(),

    }])
  return (
    <Card className='payment-card'>
        <CardContent>
            <Stack spacing={2}>
            <Typography variant='body2' color="text.secondary">{t('choose_a_payment_method')}</Typography>
            <Stack direction='row' spacing={2} alignItems="center">
            <FormControl fullWidth size="small">

                                                <Select
                                                    labelId="select-type"
                                                    id="select-type"
                                                    value={values.paymentMethods[i].selected}
                                                    displayEmpty
                                                    MenuProps={{
                                                        PaperProps:{
                                                            sx:{
                                                                bgcolor:(theme:Theme)=> theme.palette.back.main,
                                                                p:1,
                                                                ".MuiMenuItem-root":{
                                                                    "&:not(:last-child)":{
                                                                    mb:1,
                                                                    },
                                                                    borderRadius:1,
                                                                    border:1,
                                                                    borderColor:"divider",
                                                                    '&:hover':{
                                                                        bgcolor:(theme:Theme)=> theme.palette.primary.main,
                                                                        color:(theme:Theme)=> theme.palette.common.white,
                                                                        img:{
                                                                            filter:"brightness(0) invert(1)",
                                                                        }
                                                                    },
                                                                    
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    onChange={(e) => setFieldValue(`paymentMethods.${i}.selected`, e.target.value)}
                                                    renderValue={(selected) => {
                                                        const payment = paymentTypesList?.find(
                                                            (payment:any) => payment?.uuid === selected
                                                        );
                                                        
                                                        return (
                                                             <Stack direction='row' alignItems='center' spacing={1}>
                                                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img style={{width: 16}} src={payment?.logoUrl?.url} alt={'payment means'}/>
                                                                <Typography>{t(payment?.name)}</Typography>
                                                            </Stack>
                                                        );
                                                    }}>
                                                    {paymentTypesList?.map((payment:any) => (
                                                        <MenuItem value={payment.uuid} key={payment.uuid}>
                                                            <Stack direction='row' alignItems='center' spacing={1}>
                                                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img style={{width: 16}} src={payment?.logoUrl?.url} alt={'payment means'}/>
                                                                <Typography>{t(payment?.name)}</Typography>
                                                            </Stack>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {i > 0 && (
                                            <IconButton  className='btn-del' onClick={()=>{
                                                setFieldValue("paymentMethods",
                                                values.paymentMethods.filter((payment:any,index:number)=>index !== i)
                                                )
                                            }}>
                                                <IconUrl path={"setting/icdelete"}/>
                                            </IconButton>
                                            )}
                                            
                                            </Stack>
                                            <Stack component={motion.div} animate={{opacity:openPanel?.slug === 'cash' ? 1 : 0}} initial={{opacity:0}} transition={{duration:0.5}} style={{display:openPanel?.slug === 'cash' ? 'block' : 'none'}}>
                                                
                                                <Stack spacing={.5}>
                                                    <Typography variant='body2' color="text.secondary">
                                                        {t("amount")}
                                                    </Typography>
                                                    <Stack direction='row' alignItems='center' spacing={1}>
                                                    <TextField 
                                                    sx={{
                                                        input:{
                                                            fontWeight:700
                                                        }
                                                    }}
                                                        size='small'
                                                        fullWidth
                                                        value={values.paymentMethods[i].amount}
                                                        onChange={(e)=>setFieldValue(`paymentMethods.${i}.amount`,e.target.value)}
                                                        type="number"
                                                        InputProps={{
                                                            inputProps: {
                                                                min: 0,  
                                                            }
                                                            }}
                                                    />
                                                    <Typography>
                                                        {devise}
                                                    </Typography>
</Stack>
                                                </Stack>
                                            </Stack>
                                            <Stack spacing={2} component={motion.div} animate={{opacity:openPanel?.slug === 'check' ? 1 : 0}} initial={{opacity:0}} transition={{duration:0.5}} style={{display:openPanel?.slug === 'check' ? 'block' : 'none'}}>
                                                {item?.check.map((check:any,idx:any)=>(
                                                 <motion.div key={idx} 
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    exit={{opacity:0}}
                                    transition={{duration:0.3}}>
                                          <CheckCard {...{formik,i,t,devise,item,idx,check}}/>
                                                 </motion.div>   
                                                ))}
                                               
                                                 <Button size="small" startIcon={<AddIcon/>} 
                                                    onClick={addCheck}
                                                 >
                                                    {t('add_check')}
                                                    </Button>           
                                            </Stack>
            </Stack>
            
        </CardContent>
    </Card>
  )
}

export default PaymentCard