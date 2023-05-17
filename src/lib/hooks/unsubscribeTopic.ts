import axios from "axios";

// ----------------------------------------------------------------------
const unsubscribeTopic = async ({...props}) => {
    const {general_information} = props;
    // get FCM_WEB_API_KEY from server side
    const {data: fcm_api_key} = await axios({
        url: "/api/helper/server_env",
        method: "POST",
        data: {
            key: "FCM_WEB_API_KEY"
        }
    });
    // Unsubscribe from Topic
    axios({
        url: "https://iid.googleapis.com/iid/v1:batchRemove",
        method: "POST",
        headers: {
            Authorization: `key=${fcm_api_key}`
        },
        data: {
            to: `/topics/${general_information.roles[0]}-${general_information.uuid}`,
            registration_tokens: [localStorage.getItem("fcm_token")]
        }
    });
    return fcm_api_key;
}

export default unsubscribeTopic
