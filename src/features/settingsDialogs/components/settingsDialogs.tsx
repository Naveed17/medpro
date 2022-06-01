import {dialogData} from "@features/settingsDialogs";

function SettingsDialogs({...props}) {
    const selectted = dialogData.find((item) =>
        item.action === props.action
    );

    const Component: any = selectted?.component;
    return selectted ? (
        <>
            <Component/>
        </>): <></>

}

export default SettingsDialogs;