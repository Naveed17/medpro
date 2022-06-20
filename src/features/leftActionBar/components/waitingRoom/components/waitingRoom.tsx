import React, { useState } from "react";
import { Typography } from "@mui/material";
import RootStyled from "./overrides/waitingRoomBarStyled";
import { Accordion } from "@features/accordion/components";
import { SidebarCheckbox } from "@features/sidebarCheckbox/components";
import { motifData, statutData, typeRdv } from "./config";
import { useTranslation } from "next-i18next";
function WaitingRoom() {
  const [motifstate, setmotifstate] = useState({});
  const [statutstate, setstatutstate] = useState({});
  const [typeRdvstate, settypeRdvstate] = useState({});
  const { t, ready } = useTranslation("waitingRoom");
  if (!ready) return <>loading translations...</>;
  return (
    <RootStyled>
      <Typography
        px={1.1}
        pt={5}
        mb={8}
        textTransform="capitalize"
        variant="subtitle2"
      >
        {t("filter.title")}
      </Typography>
      <Accordion
        t={t}
        badge={null}
        data={[
          {
            heading: {
              id: "reson",
              icon: "ic-edit-file2",
              title: "filter.collapse.reson",
            },
            children: motifData.map((item, index) => (
              <React.Fragment key={index}>
                <SidebarCheckbox
                  data={item}
                  onChange={(v) =>
                    setmotifstate({ ...motifstate, [item.name]: v })
                  }
                />
              </React.Fragment>
            )),
          },
          {
            heading: {
              id: "status",
              icon: "ic-edit-file2",
              title: "filter.collapse.status",
            },
            children: statutData.map((item, index) => (
              <React.Fragment key={index}>
                <SidebarCheckbox
                  data={item}
                  onChange={(v) =>
                    setstatutstate({ ...statutstate, [item.name]: v })
                  }
                />
              </React.Fragment>
            )),
          },
          {
            heading: {
              id: "meetingType",
              icon: "ic-agenda-jour-color",
              title: "filter.collapse.meetingType",
            },
            children: typeRdv.map((item, index) => (
              <React.Fragment key={index}>
                <SidebarCheckbox
                  data={item}
                  onChange={(v) =>
                    settypeRdvstate({ ...typeRdvstate, [item.name]: v })
                  }
                />
              </React.Fragment>
            )),
          },
        ]}
      />
    </RootStyled>
  );
}

export default WaitingRoom;
