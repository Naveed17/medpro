import {DialogData} from "@features/settingsDialogs";

function SettingsDialogs({...props}) {
    const selectted = DialogData.find((item) =>
        item.action === props.action
    );

    const Component: any = selectted?.component;
    return selectted ? (
        <>
            <Component/>
        </>): <></>

}

export default SettingsDialogs;
