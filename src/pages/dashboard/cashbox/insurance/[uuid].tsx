import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement, useContext, useEffect, useRef, useState} from "react";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {useTranslation} from "next-i18next";
import {useFormik} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    DialogActions,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Skeleton,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {useReactToPrint} from "react-to-print";
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import {UploadFile} from "@features/uploadFile";
import {FileuploadProgress} from "@features/progressUI";
import Zoom from "@mui/material/Zoom";
import PreviewA4 from "@features/files/components/previewA4";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {Editor} from '@tinymce/tinymce-react';
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import {Dialog} from "@features/dialog";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {useAppSelector} from "@lib/redux/hooks";
import Autocomplete from "@mui/material/Autocomplete";
import {MuiAutocompleteSelectAll} from "@features/muiAutocompleteSelectAll";
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {DefaultCountry, tinymcePlugins, tinymceToolbar} from "@lib/constants";

import {LoadingScreen} from "@features/loadingScreen";
import {getServerTranslations} from "@lib/i18n/getServerTranslations";
import {useSession} from "next-auth/react";
import {AbilityContext} from "@features/casl/can";
import {useInsurances} from "@lib/hooks/rest";
import {cashBoxSelector} from "@features/leftActionBar";
import {tableActionSelector} from "@features/table";
import {Session} from "next-auth";
import {saveAs} from "file-saver";

function InscDetail() {

    const router = useRouter();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const ability = useContext(AbilityContext);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const theme = useTheme() as Theme
    const {insurances} = useInsurances()
    const {filterCB} = useAppSelector(cashBoxSelector);

    const headCellsArchiveSlip: readonly any[] = [
        {
            id: "dateArc",
            numeric: false,
            disablePadding: true,
            label: "dateArc",
            sortable: true,
            align: "left",
        },
        {
            id: "refSlip",
            numeric: false,
            disablePadding: true,
            label: "refSlip",
            sortable: true,
            align: "center",
        },
        {
            id: "start_date",
            numeric: true,
            disablePadding: false,
            label: "start_date",
            sortable: true,
            align: "center",
        },
        {
            id: "end_date",
            numeric: true,
            disablePadding: false,
            label: "end_date",
            sortable: true,
            align: "center",
        },
        {
            id: "act_reject",
            numeric: true,
            disablePadding: false,
            label: "status",
            sortable: true,
            align: "center",
        },
        {
            id: "mtt_requested",
            numeric: true,
            disablePadding: false,
            label: "mtt_requested",
            sortable: true,
            align: "center",
        },
        /*        {
                    id: "mtt_granted",
                    numeric: true,
                    disablePadding: false,
                    label: "mtt_granted",
                    sortable: true,
                    align: "left",
                },
                {
                    id: "balance",
                    numeric: true,
                    disablePadding: false,
                    label: "balance",
                    sortable: true,
                    align: "left",
                }, {
                    id: "vir",
                    numeric: true,
                    disablePadding: false,
                    label: "vir",
                    sortable: true,
                    align: "center",
                },*/
    ];
    const headCells: readonly any[] = [
        {
            id: "select-all",
            numeric: false,
            disablePadding: true,
            label: "empty",
            sortable: false,
            align: "left",
        },
        {
            id: "member_no",
            numeric: false,
            disablePadding: true,
            label: "memberNo",
            sortable: true,
            align: "left",
        }, {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "name",
            sortable: true,
            align: "left",
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "date",
            sortable: true,
            align: "left",
        },
        {
            id: "time",
            numeric: true,
            disablePadding: false,
            label: "time",
            sortable: true,
            align: "left",
        },
        {
            id: "apci",
            numeric: true,
            disablePadding: false,
            label: "apci",
            sortable: true,
            align: "center",
        },
        /*         {
                     id: "patientPart",
                     numeric: true,
                     disablePadding: false,
                     label: "patientPart",
                     sortable: true,
                     align: "center",
                 }, {
                     id: "remb",
                     numeric: true,
                     disablePadding: false,
                     label: "remb",
                     sortable: true,
                     align: "center",
                 },*/
        {
            id: "amount",
            numeric: true,
            disablePadding: false,
            label: "amount",
            sortable: true,
            align: "center",
        }
    ];

    const {t, i18n} = useTranslation("payment", {keyPrefix: "insurances"});
    //***** SELECTORS ****//
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {trigger} = useRequestQueryMutation("/docket/create");
    const {tableState: {rowsSelected}} = useAppSelector(tableActionSelector);

    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [selectedTab, setSelectedTab] = useState("global");
    const [dockets, setDockets] = useState([]);
    const [total, setTotal] = useState([]);
    const [total_acts, setTotalActs] = useState([]);
    const [total_appointment, setTotalAppointment] = useState([]);
    const [rows, setRows] = useState([])

    const topCard = [
        {
            icon: "ic-text-red",
            amount: total_appointment,
            title: "nbConsult",
        },

        {
            icon: "ic-acte-light-blue",
            amount: total_acts,
            title: "nbAct",
        },
        {
            icon: "ic-cash-light-green",
            amount: `${total} ${devise}`,
            title: "amount",
        }
    ]

    const uuid = router.query.uuid as string;

    const {data: httpDocket, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/insurance-dockets/insurance/${uuid}/${router.locale}`,
    })

    const {data: httpAppointments} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/insurances/appointments/${uuid}/${router.locale}`,
    })
    const appointments = (httpAppointments as HttpResponse)?.data ?? null;

    const {data: httpInsuranceConv} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${uuid}/conventions/${router.locale}?start_date=${filterCB.start_date}&end_date=${filterCB.end_date}`,
    })
    const conv = (httpInsuranceConv as HttpResponse)?.data ?? [];

    const tabsData = [
        ...(ability.can('manage', 'agenda', 'agenda__appointment__show') ? [{
            label: "global",
            value: "global"
        }] : []),
        ...(ability.can('manage', 'cashbox', 'cash_box__transaction__show') ? [{
            label: "archived",
            value: "archived"
        }] : []),
        /*...(ability.can('manage', 'cashbox', 'cash_box__transaction__show') ? [{
            label: "stat",
            value: "stat"
        }] : [])*/
    ];

    const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    }

    const createDockets = () => {
        const form = new FormData();
        form.append('insurance', uuid);
        form.append('start_date', filterCB.start_date);
        form.append('end_date', filterCB.end_date);
        form.append('status', "1");
        form.append('name', `Bordereau ${filterCB.start_date} - ${filterCB.end_date}`);
        form.append('appointments', rowsSelected.map(rs => rs.uuid).join(','));

        trigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/insurance-dockets/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutate()
            }
        });
    }

    const exportDoc = () => {
        trigger(
            {
                method: "GET",
                url: `${urlMedicalEntitySuffix}/insurance-dockets/export/${router.locale}`,
            },
            {
                onSuccess: (result) => {
                    const buffer = Buffer.from(result.data, "base64");
                    saveAs(new Blob([buffer]), "apps.xlsx");
                },
            }
        );
    }

    const printDoc = () => {
        trigger(
            {
                method: "GET",
                url: `${urlMedicalEntitySuffix}/insurance-dockets/print/${router.locale}`,
            },
            {
                onSuccess: (result) => {
                    const buffer = Buffer.from(result.data, "base64");
                    saveAs(new Blob([buffer]), "transaction.xlsx");
                },
            }
        );
    }

    useEffect(() => {
        console.log("dockets", httpDocket)
        if (httpDocket)
            setDockets(httpDocket.data)
    }, [httpDocket]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["payment"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (appointments) {
            setTotal(appointments.total)
            setTotalActs(appointments.total_acts)
            setTotalAppointment(appointments.total_appointment)
            setRows(appointments.list)
        }
    }, [appointments])

    return (
        <>
           ok
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await getServerTranslations(context.locale as string, [
            "payment",
            "menu",
            "common"
        ])),
    },
});
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default InscDetail;

InscDetail.auth = true;

InscDetail.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
