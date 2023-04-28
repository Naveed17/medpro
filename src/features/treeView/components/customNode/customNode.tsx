import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {TypeIcon} from "@features/treeView";
import CustomNodeStyled from "./overrides/customNodeStyled";
import {Box, Button, IconButton, useTheme} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import {Dialog} from "@features/dialog";
import {useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import {useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useSWRConfig} from "swr";

export const CustomNode = ({...props}) => {
    const {switchPrescriptionModel, t, node: {droppable, data}, depth: {indent}} = props;
    const {data: session} = useSession();
    const theme = useTheme();
    const router = useRouter();
    const {mutate} = useSWRConfig();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerDeleteModel} = useRequestMutation(null, "/prescription/model/delete");

    const {direction} = useAppSelector(configSelector);

    const [deleteModelDialog, setDeleteModelDialog] = useState<boolean>(false);
    const [dialogAction, setDialogAction] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<any | null>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    }

    const handleDeleteModel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);
        triggerDeleteModel({
            method: "DELETE",
            url: `/api/medical-entity/${medical_entity.uuid}/prescriptions/modals${selectedModel.parent === 0 ? "/parents/" : "/"}${selectedModel.id}/${router.locale}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setSelectedModel(null);
            mutate(`/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/parents/${router.locale}`).then(
                () => {
                    setLoading(false);
                    setDeleteModelDialog(false);
                });
        })
    }

    return (
        <>
            <CustomNodeStyled
                {...(props.node.parent !== 0 && {
                    onClick: event => {
                        event.stopPropagation();
                        switchPrescriptionModel(props.node.data.drugs);
                    }
                })}
                className={`tree-node`}
                style={{paddingInlineStart: indent}}
            >
                <div
                    className={`expandIconWrapper ${
                        props.isOpen ? "isOpen" : ""
                    }`}
                >
                    {props.node.droppable && (
                        <div onClick={handleToggle}>
                            <ArrowRightIcon/>
                        </div>
                    )}
                </div>
                <div>
                    <TypeIcon droppable={droppable} fileType={data?.fileType}/>
                </div>
                <div className={"labelGridItem"}>
                    <Typography {...(props.node.parent !== 0 && {color: "primary", sx: {cursor: "pointer"}})}
                                variant="body2">{props.node.text}</Typography>
                </div>
                <IconButton
                    disableRipple
                    className="btn-del"
                    onClick={(event) => {
                        event.stopPropagation();
                        setSelectedModel(props.node);
                        setDialogAction(props.node.parent === 0 ? "parent" : "model");
                        setDeleteModelDialog(true);
                    }}>
                    <IconUrl color="red" width={12} height={12} path="icdelete"/>
                </IconButton>
            </CustomNodeStyled>
            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dialogClose={() => setDeleteModelDialog(false)}
                sx={{
                    direction: direction
                }}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`dialogs.delete-${dialogAction}-dialog.sub-title`)} </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t(`dialogs.delete-${dialogAction}-dialog.description`)}</Typography>
                        </Box>)
                }}
                open={deleteModelDialog}
                title={t(`dialogs.delete-${dialogAction}-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => setDeleteModelDialog(false)}
                            startIcon={<CloseIcon/>}
                        >
                            {t(`dialogs.delete-${dialogAction}-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"error"}
                            onClick={handleDeleteModel}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="icdelete"></Icon>}
                        >
                            {t(`dialogs.delete-${dialogAction}-dialog.confirm`)}
                        </LoadingButton>
                    </>
                }
            />
        </>
    );
};

export default CustomNode;
