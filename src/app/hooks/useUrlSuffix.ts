import {UrlMedicalEntitySuffix} from "@app/constants";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

function useUrlSuffix() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse)?.medical_entity as MedicalEntityModel;

    return `${UrlMedicalEntitySuffix}/${medical_entity.uuid}`;
}

export default useUrlSuffix;
