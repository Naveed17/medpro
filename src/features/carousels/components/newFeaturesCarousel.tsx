import Slider from 'react-slick';
import {motion} from 'framer-motion';
import {useState, useRef} from 'react';
// material
import {useTheme} from '@mui/material/styles';
import {new_feature_data, varFadeInLeft, varFadeInDown, varFadeInUp} from './config'
import {Box, Card, Button, Typography, CardActions, Stack, IconButton, Grid} from '@mui/material';
import MotionContainer from './motionContainer';
import IconUrl from '@themes/urlIcon';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

function CarouselItem({item, isActive}: any) {
    return (
        <Grid component={MotionContainer} sx={{flexDirection: {xs: 'column-reverse', sm: 'row'}}} container spacing={2}
              open={isActive}>
            <Grid item xs={12} md={6}>
                <motion.div variants={varFadeInUp}>
                    <Typography textAlign={{xs: 'center', sm: 'left'}} color='warning.main' variant="h5" gutterBottom>
                        {item.title}
                    </Typography>
                </motion.div>
                <motion.div variants={varFadeInDown}>
                    <Typography variant="subtitle1" fontWeight={600} color="common.white">
                        {item.description}
                    </Typography>
                </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
                <motion.div variants={varFadeInLeft}>
                    <Box maxWidth={1} component='img' src={`/static/icons/features/${item.img}.png`}/>
                </motion.div>
            </Grid>
        </Grid>
    );
}

export default function NewFeaturesCarousel({...props}) {
    const {t, onClose} = props
    const theme = useTheme();
    const carouselRef = useRef<any>(null);
    const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? new_feature_data.length - 1 : 0);

    const settings = {
        speed: 1600,
        dots: false,
        fade: true,
        arrows: false,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        beforeChange: (current: number, next: number) => setCurrentIndex(next)
    };

    return (
        <Card sx={{
            border: 'none', bgcolor: 'transparent', borderRadius: 0, mt: 6, ".slick-slide": {
                height: 'auto'
            }
        }}>
            <Slider ref={carouselRef} {...settings}>
                {new_feature_data.map((item, index) => (
                    <CarouselItem key={item.title} item={item} isActive={index === currentIndex}/>
                ))}
            </Slider>
            <CardActions sx={{justifyContent: {xs: 'center', sm: 'stretch'}}}>
                <Stack sx={{width: "100%"}} direction='row' alignItems='center' justifyContent={"space-between"}>
                    <Stack direction='row' alignItems='center'>
                        <IconButton
                            size='small'
                            disableRipple
                            {...(currentIndex > 0 && {
                                onClick: () => {
                                    carouselRef.current.slickGoTo(currentIndex - 1);
                                }
                            })}>
                            <ArrowBackIosNewRoundedIcon
                                fontSize={"small"}
                                htmlColor={currentIndex === 0 ? theme.palette.white.dark : theme.palette.info.main}/>
                        </IconButton>
                        {[...Array(new_feature_data.length)].map((_, index) => (
                            <IconButton size='small' disableRipple
                                        {...(index === currentIndex && {
                                            sx: {
                                                svg: {
                                                    rect: {
                                                        fill: theme.palette.warning.main
                                                    }
                                                }
                                            }
                                        })}
                                        key={index}
                                        onClick={() => {
                                            carouselRef.current.slickGoTo(index);
                                        }}>
                                <IconUrl path="dot-indicator"/>
                            </IconButton>
                        ))}
                        <IconButton
                            size='small'
                            disableRipple
                            {...(currentIndex < (new_feature_data.length - 1) && {
                                onClick: () => {
                                    carouselRef.current.slickGoTo(currentIndex + 1);
                                }
                            })}>
                            <ArrowForwardIosRoundedIcon
                                fontSize={"small"}
                                htmlColor={currentIndex === (new_feature_data.length - 1) ? theme.palette.white.dark : theme.palette.info.main}/>
                        </IconButton>
                    </Stack>
                    <Button
                        variant='text-transparent'
                        sx={{
                            display: {xs: 'none', sm: 'inline-flex'},
                            bgcolor: 'transparent',
                            color: theme.palette.common.white,
                            ml: 'auto'
                        }} onClick={onClose}>
                        {t("dialogs.new_features.close")}
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
}
