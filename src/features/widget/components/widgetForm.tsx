import React, {memo} from "react";
import {Widget} from "@features/widget";

const WidgetForm: any = memo(
    ({src, ...props}: any) => {
        const {
            modal,
            data,
            setSM,
            models,
            appuuid,
            changes,
            setChanges,
            handleClosePanel,
            isClose,
            expandButton,
            acts,setActs,setSelectedAct,selectedAct,setSelectedUuid
        } = props;
        return (
            <Widget
                {...{modal, data, models, appuuid, changes, setChanges, isClose, expandButton,acts,setActs,setSelectedAct,selectedAct,setSelectedUuid}}
                setModal={setSM}
                handleClosePanel={handleClosePanel}></Widget>
        );
    },
    // NEVER UPDATE
    () => true
);
WidgetForm.displayName = "widget-form";

export default WidgetForm
