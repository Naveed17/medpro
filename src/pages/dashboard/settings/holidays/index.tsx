import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {useTranslation} from "next-i18next";
import {Box, Button, Drawer, Paper} from "@mui/material";
import {configSelector, DashLayout} from "@features/base";
import {Otable} from "@features/table";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import moment from "moment-timezone";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {agendaSelector, openDrawer} from "@features/calendar";
import {batch} from "react-redux";
import {AbsenceDrawer, absenceDrawerSelector, resetAbsenceData, setAbsenceData} from "@features/drawer";
import {LoadingButton} from "@mui/lab";
import {NoDataCard} from "@features/card";
import IconUrl from "@themes/urlIcon";

function Holidays() {
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("settings", {keyPrefix: "holidays.config"});
    const {direction} = useAppSelector(configSelector);
    const {config: agenda, openAbsenceDrawer} = useAppSelector(agendaSelector);
    const absenceData = useAppSelector(absenceDrawerSelector);

    const [loadingRequest, setLoadingRequest] = useState(false);
    const [selectedAbsence, setSelectedAbsence] = useState<any>(null);

    let page = parseInt((new URL(location.href)).searchParams.get("page") || "1");

    const {
        data: httpAbsencesResponse,
        isLoading: isAbsencesLoading,
        mutate: mutateAbsences
    } = useRequestQuery(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/absences`
    } : null, {
        refetchOnWindowFocus: false,
        ...(agenda && {variables: {query: `?page=${page}&limit=10&withPagination=true`}})

    });

    const {trigger: triggerAddAbsence} = useRequestQueryMutation("/absence/add");
    const {trigger: triggerDeleteAbsence} = useRequestQueryMutation("/absence/delete");

    const handleDeleteAbsence = (uuid: string) => {
        setLoadingRequest(true);
        triggerDeleteAbsence({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/absences/${uuid}`,
        }, {
            onSuccess: () => mutateAbsences(),
            onSettled: () => setLoadingRequest(false)
        });
    }

    const handleAddAbsence = () => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append('title', absenceData.title);
        params.append('dates', JSON.stringify([{
            "start_date": moment(absenceData.startDate).format('DD-MM-YYYY'),
            "start_time": moment(absenceData.startDate).format('HH:mm'),
            "end_date": moment(absenceData.endDate).format('DD-MM-YYYY'),
            "end_time": moment(absenceData.endDate).format('HH:mm'),
        }]));

        triggerAddAbsence({
            method: absenceData.mode === "edit" ? "PUT" : "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/absences${absenceData.mode === "edit" ? `/${selectedAbsence?.uuid}` : ""}`,
            data: params
        }, {
            onSuccess: () => {
                batch(() => {
                    dispatch(openDrawer({type: "absence", open: false}));
                    dispatch(resetAbsenceData());
                });
                mutateAbsences();
            },
            onSettled: () => setLoadingRequest(false)
        });
    }

    const handleTableActions = (action: string, event?: any) => {
        switch (action) {
            case "onEditAbsence":
                setSelectedAbsence(event);
                batch(() => {
                    dispatch(setAbsenceData({
                        title: event.title,
                        mode: "edit",
                        startDate: moment(event.startDate, "DD-MM-YYYY HH:mm").toDate(),
                        endDate: moment(event.endDate, "DD-MM-YYYY HH:mm").toDate()
                    }));
                    dispatch(openDrawer({type: "absence", open: true}));
                });
                break;
            case "onDeleteAbsence":
                handleDeleteAbsence(event?.uuid);
                break;
        }
    }

    const absences = ((httpAbsencesResponse as HttpResponse)?.data?.list ?? []) as any[];
    const totalPages = ((httpAbsencesResponse as HttpResponse)?.data?.totalPages ?? 0);
    const total = ((httpAbsencesResponse as HttpResponse)?.data?.total ?? 0);
    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'name',
            align: 'left',
            sortable: true,
        },
        {
            id: 'start-date',
            numeric: false,
            disablePadding: false,
            label: 'start',
            align: 'center',
            sortable: true
        },
        {
            id: 'end-date',
            numeric: false,
            disablePadding: false,
            label: 'end',
            align: 'center',
            sortable: true
        },
        {
            id: 'action',
            numeric: false,
            disablePadding: false,
            label: 'action',
            align: 'right',
            sortable: false
        },
    ];

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (<>
        <SubHeader>
            <RootStyled>
                <p style={{margin: 0}}>{t('path')}</p>
            </RootStyled>

            <Button type='submit'
                    variant="contained"
                    onClick={() => {
                        dispatch(openDrawer({type: "absence", open: true}));
                    }}
                    color="success">
                {t('add')}
            </Button>
        </SubHeader>

        <Box className="container">
            {(absences.length > 0 || isAbsencesLoading) ?
                <Otable
                    {...{t}}
                    headers={headCells}
                    rows={absences}
                    from={'holidays'}
                    handleEvent={handleTableActions}
                    total={total}
                    totalPages={totalPages}
                    pagination
                />
                :
                <NoDataCard
                    sx={{mt: 16}}
                    ns={"settings"}
                    {...{t}}
                    data={{
                        mainIcon: <IconUrl width={100} height={100} path={"setting/ic-time"}/>,
                        title: "table.no-data.vacation.sub-title",
                        description: "table.no-data.vacation.title"
                    }}/>
            }

            <Drawer
                anchor={"right"}
                open={openAbsenceDrawer}
                dir={direction}
                onClose={() => {
                    batch(() => {
                        dispatch(openDrawer({type: "absence", open: false}));
                        dispatch(resetAbsenceData());
                    });
                }}>
                <AbsenceDrawer {...{t}} main={true}/>
                <Paper
                    sx={{
                        display: "inline-block",
                        borderRadius: 0,
                        borderWidth: 0,
                        textAlign: "right",
                        p: "1rem"
                    }}
                    className="action">
                    <Button
                        sx={{
                            mr: 1
                        }}
                        variant="text-primary"
                        onClick={() => {
                            batch(() => {
                                dispatch(openDrawer({type: "absence", open: false}));
                                dispatch(resetAbsenceData());
                            });
                        }}>
                        {t(`dialogs.absence-dialog.cancel`)}
                    </Button>
                    <LoadingButton
                        loading={loadingRequest}
                        onClick={handleAddAbsence}
                        disabled={absenceData.title.length === 0}
                        variant="contained"
                        color={"primary"}>
                        {t(`dialogs.absence-dialog.save`)}
                    </LoadingButton>
                </Paper>
            </Drawer>
        </Box>

    </>)
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu', "patient", 'settings']))
    }
})

export default Holidays
Holidays.auth = true;

Holidays.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
