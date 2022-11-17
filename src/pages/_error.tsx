import {NextPage, NextPageContext} from 'next';
import {LoadingScreen} from "@features/loadingScreen";


interface Props {
    statusCode?: number
}

const Error: NextPage<Props> = ({statusCode}) => {
    return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error-404"}/>);
}

Error.getInitialProps = ({res, err}: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return {statusCode}
}

export default Error
