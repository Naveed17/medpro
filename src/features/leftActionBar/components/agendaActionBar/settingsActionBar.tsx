import React from 'react';
// components

import {BoxStyled} from "@features/leftActionBar/components/agendaActionBar/index";
import {CalandarPickers} from "@features/calandarPickers";

function AgendaActionBar() {

    return (
        <BoxStyled>
            <CalandarPickers />
            {/*<Collapse />*/}
        </BoxStyled>
    )
}

export default AgendaActionBar
