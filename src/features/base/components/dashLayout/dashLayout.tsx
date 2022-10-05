import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {motion} from "framer-motion";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useEffect} from "react";
import {setConfig} from "@features/calendar";
import {useAppDispatch} from "@app/redux/hooks";
import {dashLayoutState, setOngoing} from "@features/base";

const SideBarMenu = dynamic(() => import("@features/sideBarMenu/components/sideBarMenu"));
const variants = {
    hidden: {opacity: 0},
    enter: {opacity: 1},
    exit: {opacity: 0},
};

function DashLayout({children, ...props}: LayoutProps) {
    const router = useRouter();
    const {data: session, status} = useSession();
    const dispatch = useAppDispatch();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAgendasResponse} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    }, SWRNoValidateConfig);

    const agendas = (httpAgendasResponse as HttpResponse)?.data as AgendaConfigurationModel[];
    const agenda = agendas?.find((item: AgendaConfigurationModel) => item.isDefault) as AgendaConfigurationModel;

    const {data: httpOngoingResponse} = useRequest(agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/ongoing/appointments/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    } : null, SWRNoValidateConfig);

    const calendarStatus = (httpOngoingResponse as HttpResponse)?.data as dashLayoutState;

    useEffect(() => {
        if (agenda) {
            dispatch(setConfig(agenda));
        }
    }, [agenda, dispatch])

    useEffect(() => {
        if (calendarStatus) {
            console.log("waiting_room", calendarStatus.waiting_room)
            dispatch(setOngoing({waiting_room: calendarStatus.waiting_room}))
        }
    }, [calendarStatus, dispatch]);

    return (
        <SideBarMenu>
            <motion.main
                key={router.route}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{type: "linear"}}
            >
                {children}
            </motion.main>
        </SideBarMenu>
    );
}

export default DashLayout;
