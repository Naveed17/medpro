import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {getServerTranslations} from "@lib/i18n/getServerTranslations";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import useApci from "@lib/hooks/rest/useApci";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";

function InscDetail() {

    const router = useRouter();
    const {t} = useTranslation("settings", {keyPrefix: 'insurance.config'});
    const {apcis} = useApci(router.query.name as string);
    const [search, setSearch] = React.useState("");
    const [mainActes, setMainActes] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [newAct, setNewAct] = useState<any>(null);

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {trigger} = useRequestQueryMutation("/act/update");

    const {data: httpActs, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${router.locale}`,
    });
    const headCells = [
        {
            id: "act",
            numeric: false,
            disablePadding: false,
            label: "act",
            align: "left",
            sortable: true,
        },
        {
            id: "fees",
            numeric: false,
            disablePadding: false,
            label: "fees",
            align: "center",
            sortable: false,
        },
        {
            id: "rem_amount",
            numeric: true,
            disablePadding: false,
            label: "rem_amount",
            align: "center",
            sortable: false,
        },
        {
            id: "patient_share",
            numeric: true,
            disablePadding: false,
            label: "patient_share",
            align: "center",
            sortable: false,
        },
        {
            id: "apci",
            numeric: false,
            disablePadding: false,
            label: "apci",
            align: "center",
            sortable: false,
        }, {
            id: "action",
            numeric: false,
            disablePadding: false,
            label: "action",
            align: "center",
            sortable: false,
        },
    ];
    const handleChange = (row: ActModel) => {
        const updated = mainActes.map((item: ActModel) => {
            if (item.uuid === row.uuid) {
                return row
            }
            return item;
        })
        setMainActes(updated);
    }
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearch(query);
        if (query.length === 0) return setMainActes(httpActs?.data.acts)
        const data = mainActes.filter((row: any) => {
            return row?.act?.name.toLowerCase().includes(query.toLowerCase())
        })
        setMainActes(data);
    }
    const handleEvent = ({...props}) => {
        if (props.action === "DELETE")
            trigger({
                method: "DELETE",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${props.data.uuid}/${router.locale}`,
            }, {
                onSuccess: () => {
                    mutate()
                    setLoading(false);
                },
                onError: () => setLoading(false)
            });
    }
    const save = () => {
        if (newAct) {
            const method = newAct.uuid ? "PUT" : "POST"
            const url = newAct.uuid ? `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${newAct.uuid}/${router.locale}` : `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${router.locale}`;

            const form = new FormData();
            form.append("fees", newAct.fees)
            form.append("refund", newAct.refund ? newAct.refund : 0)
            form.append("patient_part", newAct.patient_part)
            form.append("apcis", newAct.apci)
            if (method === "POST")
                form.append("act", newAct.md_act)

            trigger({
                method,
                url,
                data: form
            }, {
                onSuccess: () => {
                    mutate()
                    setLoading(false);
                    setNewAct(null);
                    setOpen(false)
                },
                onError: () => setLoading(false)
            });
        }
    }

    useEffect(() => {
        setLoading(true);
        if (httpActs) {
            setMainActes(httpActs.data.acts as ActModel[]);
            setLoading(false);
        }
    }, [httpActs]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            hello
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await getServerTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
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
