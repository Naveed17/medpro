import React, { useState } from "react"
import { Typography } from "@mui/material"
import RootStyled from "./overrides/waitingRoomBarStyled"
import { Accordion } from '@features/accordion/components'
import { SidebarCheckbox } from '@features/sidebarCheckbox/components'
import { motifData, statutData, typeRdv } from './config'
function WaitingRoom() {
    const [motifstate, setmotifstate] = useState({});
    const [statutstate, setstatutstate] = useState({});
    const [typeRdvstate, settypeRdvstate] = useState({});
    return (
        <RootStyled>
            <Typography px={1.1} pt={5} mb={8} variant="subtitle2">
                Filter
            </Typography>
            <Accordion badge={null}
                data={[
                    {
                        heading: {
                            icon: "ic-edit-file2",
                            title: "Motif de consultation",
                        },
                        children: motifData.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox data={item} onChange={(v) => setmotifstate({ ...motifstate, [item.name]: v })} />
                            </React.Fragment>
                        ))
                    },
                    {
                        heading: {
                            icon: "ic-edit-file2",
                            title: "Statut",
                        },
                        children: statutData.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox data={item} onChange={(v) => setstatutstate({ ...statutstate, [item.name]: v })} />
                            </React.Fragment>
                        ))
                    },
                    {
                        heading: {
                            icon: "ic-agenda-jour-color",
                            title: "Type RDV",
                        },
                        children: typeRdv.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox data={item} onChange={(v) => settypeRdvstate({ ...typeRdvstate, [item.name]: v })} />
                            </React.Fragment>
                        ))
                    },
                ]
                }
            />
        </RootStyled>
    )
}

export default WaitingRoom