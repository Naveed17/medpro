import React, {useState} from "react"
import {Typography} from "@mui/material"
import WaitingRoomStyled from "./overrides/waitingRoomStyle"
import {Accordion} from '@features/accordion'
import {SidebarCheckbox} from '@features/sidebarCheckbox'
import {motifData, statutData, typeRdv} from './config'
import {useTranslation} from "next-i18next"

function WaitingRoom() {
    const [motifstate, setmotifstate] = useState({});
    const [statutstate, setstatutstate] = useState({});
    const [typeRdvstate, settypeRdvstate] = useState({});
    const {t, ready} = useTranslation('waitingRoom', {keyPrefix: 'filter'});
    if (!ready) return (<>loading translations...</>);

    return (
        <WaitingRoomStyled>
            <Typography px={1.1} pt={5} mb={8} textTransform="capitalize" variant="subtitle2"
                        display={{xs: 'none', sm: 'block'}}>
                {t("title")}
            </Typography>
            <Accordion
                translate={{
                    t: t,
                    ready: ready,
                }}
                badge={null}
                defaultValue={"reson"}
                data={[
                    {
                        heading: {
                            id: "reson",
                            icon: "ic-edit-file2",
                            title: "reson",
                        },
                        children: motifData.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox
                                    translate={{
                                        t: t,
                                        ready: ready,
                                    }}
                                    data={item} onChange={(v) => setmotifstate({...motifstate, [item.name]: v})}/>
                            </React.Fragment>
                        ))
                    },
                    {
                        heading: {
                            id: "status",
                            icon: "ic-edit-file2",
                            title: "status",
                        },
                        children: statutData.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox
                                    translate={{
                                        t: t,
                                        ready: ready,
                                    }}
                                    data={item} onChange={(v) => setstatutstate({...statutstate, [item.name]: v})}/>
                            </React.Fragment>
                        ))
                    },
                    {
                        heading: {
                            id: "meetingType",
                            icon: "ic-agenda-jour-color",
                            title: "meetingType",
                        },
                        children: typeRdv.map((item, index) => (
                            <React.Fragment key={index}>
                                <SidebarCheckbox
                                    translate={{
                                        t: t,
                                        ready: ready,
                                    }}
                                    data={item} onChange={(v) => settypeRdvstate({...typeRdvstate, [item.name]: v})}/>
                            </React.Fragment>
                        ))
                    },
                ]
                }
            />
        </WaitingRoomStyled>
    )
}

export default WaitingRoom;
