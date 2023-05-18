import {instanceAxios} from "@lib/axios";

async function sendRequest(params: string, {arg}: any) {
    const form = new FormData();
    if (arg.data) {
        Object.entries(arg.data).map((param: any) => {
            form.append(param[0], param[1]);
        });
    }

    return instanceAxios.request({
        method: arg.method,
        url: arg.url,
        ...arg.data && {data: form},
        headers: params[1] as any
    })
}

export default sendRequest;
