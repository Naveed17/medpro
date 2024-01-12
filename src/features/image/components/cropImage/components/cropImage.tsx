import {useCallback, useState} from "react";
import {Box, Button, Slider, Stack, Typography} from "@mui/material";
import Cropper from "react-easy-crop";
import {pxToRem} from "@themes/formatFontSize";
import IconUrl from "@themes/urlIcon";
import getCroppedImg from "@themes/overrides/getCroppedImg";
import ModalStyled from "./overrides/modalStyled";
import {InputStyled} from "@features/tabPanel";

function CropImage({...props}) {
    const {img, setFieldValue, setPicture, setOpen, open, filedName = "file"} = props;
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const onCropComplete = useCallback(
        (croppedArea: any, croppedAreaPixels: any) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                img,
                croppedAreaPixels,
                rotation
            );
            if (setFieldValue)
                setFieldValue(filedName, croppedImage);
            else
                setPicture(croppedImage)

            handleClose();
        } catch (e) {
            console.log(e);
        }
    }, [croppedAreaPixels, rotation]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClose = () => {
        setOpen(false);
    };

    const handleDrop = (acceptedFiles: any) => {
        const file = acceptedFiles[0];
        if (setFieldValue)
            setFieldValue(filedName, URL.createObjectURL(file));
        else
            setPicture(URL.createObjectURL(file))
    };

    return (
        <ModalStyled open={open}>
            <Box className="modal-header">
                <Typography variant="subtitle1" component="h6">
                    Update profile picture
                </Typography>
            </Box>
            <Box className="modal-body">
                <Cropper
                    image={img}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        position: "absolute",
                        bottom: 20,
                        width: "90%",
                        margin: "auto",
                        "& svg": {
                            width: pxToRem(15),
                            height: pxToRem(15),
                        },
                    }}
                >
                    <IconUrl path="ic-moin"/>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, zoom: any) => setZoom(zoom)}
                        sx={{
                            "& .MuiSlider-rail": {
                                backgroundColor: (theme) => theme.palette.grey["A300"],
                            },
                        }}
                    />
                    <IconUrl path="ic-plus"/>
                </Stack>
            </Box>
            <Box className="modal-actions">
                <label htmlFor="contained-button-file">
                    <InputStyled
                        id="contained-button-file"
                        onChange={(e: any) => handleDrop(e.target.files)}
                        type="file"
                    />
                    <Button
                        variant="text-black"
                        component="span"
                        startIcon={<IconUrl path="ic-refrech"/>}
                    >
                        upload another photo
                    </Button>
                </label>

                <Button
                    onClick={showCroppedImage}
                    sx={{ml: 1, "& .react-svg svg": {width: "15px", height: "15px"}}}
                    startIcon={<IconUrl path="check"/>}
                >
                    Enregistrer
                </Button>
            </Box>
        </ModalStyled>
    );
}

export default CropImage;
