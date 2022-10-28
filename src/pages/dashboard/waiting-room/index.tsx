import { GetStaticProps } from "next";
import React, { ReactElement, useEffect, useState } from "react";
//components
import { DetailsCard, NoDataCard, setTimer } from "@features/card";
import Icon from "@themes/urlIcon";
// next-i18next
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { DashLayout, dashLayoutSelector, setOngoing } from "@features/base";
import { Box, LinearProgress, Menu, MenuItem, useTheme } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { RoomToolbar } from "@features/toolbar";
import { Otable } from "@features/table";
import { Session } from "next-auth";
import { useRequest, useRequestMutation } from "@app/axios";
import { SWRNoValidateConfig, TriggerWithoutValidation } from "@app/swr/swrProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { DesktopContainer } from "@themes/desktopConainter";
import { MobileContainer } from "@themes/mobileContainer";
import Typography from "@mui/material/Typography";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { leftActionBarSelector } from "@features/leftActionBar";
import moment from "moment-timezone";
import { useSnackbar } from "notistack";
import {toggleSideBar} from "@features/sideBarMenu";
import {useIsMountedRef} from "@app/hooks";
import {appLockSelector} from "@features/appLock";

export const headCells = [
    {
        id: "arrivaltime",
        numeric: false,
        disablePadding: true,
        label: "arrival time",
        align: "left",
        sortable: true,
    },
    {
        id: "appointmentTime",
        numeric: false,
        disablePadding: true,
        label: "Appointment time",
        align: "left",
        sortable: false,
    },
    {
        id: "waiting",
        numeric: false,
        disablePadding: true,
        label: "waiting",
        align: "left",
        sortable: true,
    },
    {
        id: "motif",
        numeric: false,
        disablePadding: true,
        label: "Reason",
        align: "left",
        sortable: false,
    },
    {
        id: "patient",
        numeric: false,
        disablePadding: true,
        label: "Patient's name",
        align: "left",
        sortable: true,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: true,
        label: "Action",
        align: "right",
        sortable: false,
    },
];

const AddWaitingRoomCardData = {
    mainIcon: "ic-salle",
    title: "empty",
    description: "desc",
    buttonText: "table.no-data.event.title",
    buttonIcon: "ic-salle",
    buttonVariant: "primary",
};

function WaitingRoom() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isMounted = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();

    const { t, ready } = useTranslation("waitingRoom", { keyPrefix: "config" });
    const { query: filter } = useAppSelector(leftActionBarSelector);
    const { waiting_room } = useAppSelector(dashLayoutSelector);
    const {lock} = useAppSelector(appLockSelector);

    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
    const [row, setRow] = useState<WaitingRoomModel | null>(null);
    const [popoverActions, setPopoverActions] = useState([{
        title: "start_the_consultation",
        icon: <PlayCircleIcon />,
        action: "onConsultationStart",
    }, {
        title: "leave_waiting_room",
        icon: <Icon color={"white"} path="ic-salle" />,
        action: "onLeaveWaitingRoom",
    }]);

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const roles = (session?.data as UserDataResponse)?.general_information.roles as Array<string>

    const { data: httpAgendasResponse, error: errorHttpAgendas } = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    }, SWRNoValidateConfig);

    const agenda = (httpAgendasResponse as HttpResponse)?.data
        .find((item: AgendaConfigurationModel) =>
            item.isDefault) as AgendaConfigurationModel;

    const {
        data: httpWaitingRoomsResponse,
        mutate: mutateWaitingRoom
    } = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/waiting-rooms/${router.locale}${filter?.type ? '?type=' + filter?.type : ''}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const {
        trigger: updateStatusTrigger
    } = useRequestMutation(null, "/agenda/update/appointment/status",
        TriggerWithoutValidation);

    const updateAppointmentStatus = (appointmentUUid: string, status: string, params?: any) => {
        const form = new FormData();
        form.append('status', status);
        if (params) {
            Object.entries(params).map((param: any, index) => {
                form.append(param[0], param[1]);
            });
        }
        return updateStatusTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${appointmentUUid}/status/${router.locale}`,
            data: form,
            headers: { Authorization: `Bearer ${session?.accessToken}` }
        });
    }

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const OnMenuActions = (action: string) => {
        switch (action) {
            case "onConsultationStart":
                const slugConsultation = `/dashboard/consultation/${row?.uuid}`;
                router.push(slugConsultation, slugConsultation, { locale: router.locale }).then(() => {
                    const event: any = {
                        publicId: row?.uuid as string,
                        extendedProps: {
                            patient: row?.patient
                        }
                    };
                    dispatch(setTimer({ isActive: true, isPaused: false, event }));
                    updateAppointmentStatus(row?.uuid as string, "4", {
                        start_date: moment().format("DD-MM-YYYY"),
                        start_time: moment().format("HH:mm")
                    });
                });
                break;
            case "onLeaveWaitingRoom":
                updateAppointmentStatus(row?.uuid as string, "6").then(() => {
                    dispatch(setOngoing({ waiting_room: waiting_room - 1 }))
                    mutateWaitingRoom();
                });
                break;
        }
    }

    const waitingRooms = (httpWaitingRoomsResponse as HttpResponse)?.data as any;

    useEffect(() => {
        if (isMounted.current && !lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (waitingRooms) {
            dispatch(setOngoing({ waiting_room: waitingRooms.length }))
        }
    }, [dispatch, waitingRooms]);

    useEffect(() => {
        if (roles && roles.includes('ROLE_SECRETARY')) {
            setPopoverActions([{
                title: "leave_waiting_room",
                icon: <Icon color={"white"} path="ic-salle" />,
                action: "onLeaveWaitingRoom",
            }])
        }
    }, [roles]);

    if (!ready) return <>loading translations...</>;

    return (
        <>
            <SubHeader>
                <RoomToolbar />
            </SubHeader>
            <Box>
                <LinearProgress sx={{
                    visibility: !httpWaitingRoomsResponse || loading ? "visible" : "hidden"
                }} color="warning" />
                <DesktopContainer>
                    <Box className="container">
                        <Box display={{ xs: "none", md: "block" }} mt={1}>
                            {waitingRooms &&
                                <>
                                    {waitingRooms.length > 0 && <Otable
                                        headers={headCells}
                                        rows={waitingRooms}
                                        from={"waitingRoom"}
                                        t={t}
                                        pagination
                                        handleEvent={(data: any) => {
                                            handleContextMenu(data.event);
                                            setRow(data.row);
                                        }}
                                    />}
                                    {waitingRooms.length === 0 && (
                                        <NoDataCard
                                            t={t}
                                            onHandleClick={() => {
                                                router.push('/dashboard/agenda').then(() => {
                                                    enqueueSnackbar(t("add-to-waiting-room"), { variant: 'info' })
                                                });
                                            }}
                                            ns={"waitingRoom"}
                                            data={AddWaitingRoomCardData} />
                                    )}

                                    <Menu
                                        open={contextMenu !== null}
                                        onClose={handleClose}
                                        anchorReference="anchorPosition"
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                backgroundColor: theme.palette.text.primary,
                                                "& .popover-item": {
                                                    padding: theme.spacing(2),
                                                    display: "flex",
                                                    alignItems: "center",
                                                    svg: { color: "#fff", marginRight: theme.spacing(1), fontSize: 20 },
                                                    cursor: "pointer",
                                                }
                                            },
                                        }}
                                        anchorPosition={
                                            contextMenu !== null
                                                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                                                : undefined
                                        }
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        {
                                            popoverActions.map(
                                                (v: any, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        className="popover-item"
                                                        onClick={() => {
                                                            OnMenuActions(v.action);
                                                            handleClose();
                                                        }}
                                                    >
                                                        {v.icon}
                                                        <Typography fontSize={15} sx={{ color: "#fff" }}>
                                                            {t(`${v.title}`)}
                                                        </Typography>
                                                    </MenuItem>
                                                )
                                            )}
                                    </Menu>
                                </>
                            }
                        </Box>
                    </Box>
                </DesktopContainer>
                <MobileContainer>
                    <DetailsCard waitingRoom rows={waitingRooms} t={t} />
                </MobileContainer>
            </Box>

        </>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "menu",
            "common",
            "waitingRoom",
        ])),
    },
});

export default WaitingRoom;

WaitingRoom.auth = true

WaitingRoom.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
