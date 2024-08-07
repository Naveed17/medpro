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
            expandButton, previousData, selectedModel,
            url,showToolbar,
            autoUpdate = true,
            acts, setActs, setSelectedAct, selectedAct, setSelectedUuid, mutateSheetData,printGlasses
        } = props;

        return (
            <Widget
                {...{
                    modal,
                    data,
                    models,
                    appuuid,
                    changes,
                    setChanges,
                    isClose,
                    expandButton,
                    acts,
                    setActs,
                    setSelectedAct,
                    autoUpdate,
                    selectedAct,
                    setSelectedUuid,
                    previousData,
                    closed,
                    selectedModel,
                    showToolbar,
                    url,printGlasses
                }}
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
