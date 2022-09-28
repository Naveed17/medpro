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

const SideBarMenu = dynamic(
    () => import("@features/sideBarMenu/components/sideBarMenu")
);
const variants = {
    hidden: {opacity: 0},
    enter: {opacity: 1},
    exit: {opacity: 0},
};

function DashLayout({children}: LayoutProps) {
    const router = useRouter();
    const {data: session, status} = useSession();
    const dispatch = useAppDispatch();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const {data: httpAgendasResponse, error: errorHttpAgendas} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    }, SWRNoValidateConfig);

    const agenda = (httpAgendasResponse as HttpResponse)?.data.find((item: AgendaConfigurationModel) =>
        item.isDefault) as AgendaConfigurationModel;

    const {data: httpOngoingResponse, error: errorHttpOngoing} = useRequest(agenda ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/ongoing/appointments/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    } : null, SWRNoValidateConfig);

    useEffect(() => {
        if (agenda) {
            dispatch(setConfig(agenda));
        }
    }, [agenda, dispatch])

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
