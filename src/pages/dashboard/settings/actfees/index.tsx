import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState, useRef} from "react";
import {DashLayout} from "@features/base";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {Box, useMediaQuery} from "@mui/material";
import {Button} from "@mui/material";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {RootStyled} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";
import {Otable} from '@features/table';
import {isEmpty} from 'lodash';
import {TriggerWithoutValidation} from "@app/swr/swrProvider";

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "acts",
        sortable: true,
        align: "left",
    },
    {
        id: "fees",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "left",
    },

];

function ActFees() {
    const {data: session} = useSession();
    const isMobile = useMediaQuery("(max-width:669px)");

    const [mainActes, setMainActes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const didMountRef = useRef<boolean>(false);
    const router = useRouter();
    const [selected, setselected] = useState<any>({});
    const [isNew, setNew] = useState(false)
    const [stateAct, setstateAct] = useState({
        "uuid": "NEWROW",
        "isTopAct": true,
        fees: 0,
        "act": {
            "uuid": "",
            "name": "",
            "description": "",
            "weight": 0
        }
    });

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;

    const {trigger} = useRequestMutation(null, "/settings/acts");
    const {data: httpProfessionalsActs, error: errorActs, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/acts/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            if (httpProfessionalsActs !== undefined) {
                const response = await ((httpProfessionalsActs as any).data)
                setMainActes(response as ActModel[])
                setLoading(false)
            }
        };
        fetchData()
    }, [httpProfessionalsActs]);

    useEffect(() => {
        if (didMountRef.current) {
            if (isNew) {
                const form = new FormData();
                form.append('name', JSON.stringify({
                    "fr": selected.act,
                }));
                form.append('price', `${selected.fees}`)
                trigger({
                    method: "POST",
                    url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/new-acts/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }, TriggerWithoutValidation).then(r => {
                    setNew(false);
                    mutate()
                })
            } else if (!isEmpty(selected) && selected.fees) {
                const form = new FormData();
                form.append("attribute", "price");
                form.append("value", `${selected.fees}`);
                trigger({
                    method: "PATCH",
                    url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + medical_professional.uuid + "/acts/" + selected.uuid + '/' + router.locale,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }, TriggerWithoutValidation).then((r) => mutate());
            }
        }
        didMountRef.current = true;
    }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleCreate = () => {
        setNew(true);
        setMainActes([
            stateAct,
            ...mainActes
        ])
    }

    const handleRemove = () => {
        setMainActes([
            ...mainActes
        ].filter((act: any) => act.uuid !== "NEWROW"));
        setNew(false);
    }

    const {t, ready} = useTranslation("settings", {keyPrefix: "actfees"});
    if (!ready) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('path')}</p>
                </RootStyled>
                {
                    isNew ? <Button variant="contained" onClick={handleRemove}>{t('cancel')}</Button> :
                        <Button
                            onClick={() => handleCreate()}
                            variant="contained"
                            startIcon={<IconUrl width={"14"} height={"14"} color={"white"}
                                                path="ic-plus"/>}>{t("add_a_new_act")}</Button>
                }
            </SubHeader>
            <Box sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}, 'table': {tableLayout: 'fixed'}}}>
                <Otable
                    headers={headCells}
                    rows={mainActes}
                    from={"actfees"}
                    edit={setselected}
                    {...{t, loading, isNew}}
                />
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})

export default ActFees;

ActFees.auth = true;

ActFees.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
