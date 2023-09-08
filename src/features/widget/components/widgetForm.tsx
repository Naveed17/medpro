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
            closed,
            handleClosePanel,
            isClose,
            expandButton,previousData,selectedModel,
            trigger,
            url,mutateSheetData,
            acts,setActs,setSelectedAct,selectedAct,setSelectedUuid
        } = props;

        return (
            <Widget
                {...{modal, data, models, appuuid, changes, setChanges, isClose, expandButton,acts,setActs,setSelectedAct,selectedAct,setSelectedUuid,previousData,closed,selectedModel,
                    trigger,mutateSheetData,
                    url}}
                setModal={setSM}
                handleClosePanel={handleClosePanel}></Widget>
        );
    },
    // NEVER UPDATE
    () => true
);
WidgetForm.displayName = "widget-form";

export default WidgetForm
