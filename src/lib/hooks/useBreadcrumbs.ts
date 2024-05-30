import {capitalize} from "@mui/material";
import {setTabIndex, SettingConfig} from "@features/leftActionBar";
import {useAppDispatch} from "@lib/redux/hooks";

function useBreadcrumbs({...props}) {
    const {group, breadcrumbsData, tabIndex} = props;
    const dispatch = useAppDispatch();

    const stepperData = SettingConfig.dashboard.find(v => v.name === group)?.submenu ?? [];
    let currentIndex = tabIndex;

    if (stepperData.length - 1 < tabIndex) {
        dispatch(setTabIndex(0))
        currentIndex = 0
    }

    const breadcrumbsDataMap = breadcrumbsData.map((item: any, i: number) => {
        if (breadcrumbsData.length - 1 === i) {
            item.title = stepperData[currentIndex]?.name;
            item.title = capitalize(item.title.replace(/_/g, ' '))
        }
        return item;
    });

    return {breadcrumbsDataMap, currentIndex, stepperData};
}

export default useBreadcrumbs;
