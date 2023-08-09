import React, {ReactElement} from "react";
import {DashLayout} from "@features/base";
import {Redirect} from "@features/redirect";

function Dashboard() {
    return (
        <Redirect to='/dashboard/agenda'/>
    )
}

Dashboard.auth = true

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default Dashboard
