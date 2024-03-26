export {default as useIsMountedRef} from "./useIsMountedRef";
export {default as useDateConverture} from "./useDateConverture";
export {default as unsubscribeTopic} from "./unsubscribeTopic";
export {default as useMedicalEntitySuffix} from "./useMedicalEntitySuffix";
export {default as useMedicalProfessionalSuffix} from "./useMedicalProfessionalSuffix";
export {default as useMutateOnGoing} from "./useMutateOnGoing";
export {default as useInvalidateQueries} from "./useInvalidateQueries";
export {default as useLastPrescription} from "./useLastPrescription";
export {default as useTimer} from "./useTimer";
export * from "./prepareSearchKeys";
export * from "./prepareInsurancesData";
export * from "./filterReasonOptions";
export * from "./capitalizeFirst";
export * from "./increaseNumberInString";
export * from "./convertHexToRGBA";
export * from "./getDiffDuration";
export * from "./checkNotification";
export * from "./flattenObject";
export * from "./unflattenObject";
export * from "./checkObjectChange";
export * from "./appointmentGroupByDate";
export * from "./appointmentPrepareEvent";
export * from "./arrayUniqueByKey";
export * from "./clearBrowserCache";
export * from "./conditionalWrapper";
export * from "./getBirthday";
export * from "./getBirthdayFormat";
export * from "./getDifference";
export * from "./getMilliseconds";
export * from "./splitLastOccurrence";
export * from "./generatePdfFromHtml";
export * from "./shortEnglishHumanizer";
export * from "./a11yProps";
export * from "./mergeArrayByKey";
export * from "./useStopwatch";
export * from "./prepareContextMenu";
export * from "./isSupported";
export * from "./isAppleDevise";
export * from "./highlightedDays";
export * from "./downloadFileAsPdf";
export * from "./groupPermissionsByFeature";
export * from "./getPermissionsCount";
export * from "./prescriptionPreviewDosage";
export * from './rest/useContactType';
export * from './rest/useSendNotification';
export * from './rest/useTransactionEdit';

Array.prototype.group = function (fn) {
    return this?.reduce((prev: any, next: any) => {
            const prop = fn(next);
            return {
                ...prev,
                [prop]: prev[prop] ? [...prev[prop], next] : [next],
            };
        }
        , {})
}
