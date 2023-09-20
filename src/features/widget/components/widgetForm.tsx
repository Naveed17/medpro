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
            url,
            acts,setActs,setSelectedAct,selectedAct,setSelectedUuid,mutateSheetData
        } = props;

        return (
            <Widget
                {...{modal, data, models, appuuid, changes, setChanges, isClose, expandButton,acts,setActs,setSelectedAct,selectedAct,setSelectedUuid,previousData,closed,selectedModel,
                    url}}
                setModal={setSM}
                mutateSheetData={mutateSheetData}
                handleClosePanel={handleClosePanel}></Widget>
        );
    },
    // NEVER UPDATE
    () => true
);
WidgetForm.displayName = "widget-form";

export default WidgetForm
