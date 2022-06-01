import {DialogData} from "@features/settingsDialogs";

function SettingsDialogs({...props}) {
    const selectted = DialogData.find((item) =>
        item.action === props.action
    );

    const Component:any = selectted?.component;
    return selectted ? (
        <>
            <Component />
        </>
    ) : (
        <p>Hello from action bar</p>
    );
}

export default SettingsDialogs;
