// hooks
import { useState } from "react";
import { useTranslation } from "next-i18next";
// material
import {
    Typography,
    Paper,
    Grid,
    Button,
    Skeleton,
    DialogActions,
} from "@mui/material";
// ____________________________________
import { Dialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import RootStyled from "./overrides/rootStyled";
// utils
import Icon from "@themes/urlIcon";
import { useAppDispatch } from "@app/redux/hooks";
import { openDrawer } from "@features/calendar";
import { useRequestMutation } from "@app/axios";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

// selected dumy data
const cardItems: PatientDetailsList[] = [
    {
        id: 0,
        title: "title",
        icon: "ic-doc",
        items: [
            { id: 0, name: "Diabète / Hypoglycémie" },
            { id: 1, name: "Problèmes cardiaques / Hypertension" },
        ],
    },
];

const emptyObject = {
    title: "",
    value: "",
};

function BackgroundCard({ ...props }) {
    const { loading, patient, mutate } = props;
    const [data, setdata] = useState([...cardItems]);
    const dispatch = useAppDispatch();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [info, setInfo] = useState<string>("");
    const [size, setSize] = useState<string>("sm");
    const [state, setState] = useState<AntecedentsModel[] | FamilyAntecedentsModel[]>([]);

    const { trigger } = useRequestMutation(null, "/antecedent");
    const router = useRouter();
    const { data: session, status } = useSession();

    const codes: any = {
        way_of_life: "0",
        allergic: "1",
        treatment: "2",
        antecedents: "3",
        family_antecedents: "4",
        surgical_antecedents: "5",
        medical_antecedents: "6",
    };

    const handleClickDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        const form = new FormData();
        form.append("antecedents", JSON.stringify(state));
        form.append("patient_uuid", patient.uuid);
        trigger(
            {
                method: "POST",
                url:
                    "/api/medical-entity/" +
                    medical_entity.uuid +
                    "/patients/" +
                    patient.uuid +
                    "/antecedents/" +
                    codes[info] +
                    "/" +
                    router.locale,
                data: form,
                headers: {
                    ContentType: "multipart/form-data",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
            { revalidate: true, populateCache: true }
        ).then((r) => console.log("edit qualification", r));

        mutate();
        setOpenDialog(false);
        setInfo("");
    };
    const handleOpen = (action: string) => {
        if (action === "consultation") {
            dispatch(openDrawer({ type: "add", open: true }));
            return;
        }
        setState(patient.antecedents[action]);
        console.log(action);
        setInfo(action);
        action === "add_treatment" ? setSize("lg") : setSize("sm");

        handleClickDialog();
    };

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;

    const onChangeList = (prop: PatientDetailsList) => {
        const newState = data.map((obj) => {
            if (obj.id === prop.id) {
                return { ...prop };
            }
            return obj;
        });
        setdata(newState);
    };
    const { t, ready } = useTranslation("patient", { keyPrefix: "background" });
    if (!ready) return <div>Loading...</div>;

    return (
        <RootStyled>
            <Typography
                variant="body1"
                color="text.primary"
                gutterBottom
            >
                {loading ? (
                    <Skeleton variant="text" sx={{ maxWidth: 200 }} />
                ) : (
                    t("title")
                )}
            </Typography>
            <Grid container spacing={2}>
                {Object.keys(loading ? emptyObject : patient.antecedents).map(
                    (antecedent, idx: number) => (
                        <Grid key={Math.random()} item md={6} sm={12} xs={12}>
                            <Paper sx={{ p: 1.5, borderWidth: 0, height: "100%" }}>
                                <Typography
                                    variant="body1"
                                    color="text.primary"
                                    className="item"
                                    component="span"
                                >
                                    {/* <Icon path={antecedent.icon} /> */}
                                    {loading ? (
                                        <Skeleton
                                            variant="text"
                                            sx={{ maxWidth: 150, width: "100%" }}
                                        />
                                    ) : (
                                        t(antecedent)
                                    )}
                                </Typography>
                                {(loading
                                    ? Array.from(new Array(3))
                                    : patient.antecedents[antecedent]
                                ).map((v: any) => (
                                    <Typography
                                        key={Math.random()}
                                        mt={0.5}
                                        color="text.secondary"
                                        fontSize={11}
                                    >
                                        {loading ? <Skeleton variant="text" /> : v.name}
                                    </Typography>
                                ))}
                                {loading ? (
                                    <Skeleton variant="text" sx={{ maxWidth: 200 }} />
                                ) : (
                                    <Button
                                        variant="text"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleOpen(antecedent)}
                                        sx={{
                                            mt: 1,
                                            svg: { width: 15, mr: 0.5, path: { fill: "#0696D6" } },
                                        }}
                                    >
                                        <Icon path="ic-plus" /> {t("add-background")}
                                    </Button>
                                )}
                            </Paper>
                        </Grid>
                    )
                )}
            </Grid>
            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    data={{
                        state: state,
                        setState: setState,
                        patient_uuid: patient.uuid,
                        action: info,
                    }}
                    change={false}
                    max
                    size={size}
                    direction={"ltr"}
                    actions={true}
                    title={t(info)}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
                                {t("cancel")}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCloseDialog}
                                startIcon={<Icon path="ic-dowlaodfile" />}
                            >
                                {t("save")}
                            </Button>
                        </DialogActions>
                    }
                />
            )}
        </RootStyled>
    );
}

export default BackgroundCard;
