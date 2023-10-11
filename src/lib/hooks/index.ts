export {default as useIsMountedRef} from "./useIsMountedRef";
export {default as useDateConverture} from "./useDateConverture";
export {default as unsubscribeTopic} from "./unsubscribeTopic";
export {default as useMedicalEntitySuffix} from "./useMedicalEntitySuffix";
export {default as useMedicalProfessionalSuffix} from "./useMedicalProfessionalSuffix";
export {default as useMutateOnGoing} from "./useMutateOnGoing";
export {default as useInvalidateQueries} from "./useInvalidateQueries";
export {default as useLastPrescription} from "./useLastPrescription";
export * from "./prepareSearchKeys";
export * from "./prepareInsurancesData";
export * from "./filterReasonOptions";
export * from "./capitalizeFirst";
export * from "./increaseNumberInString";
export * from "./convertHexToRGBA";
export * from "./getDiffDuration";
export * from "./checkNotification";
export * from "./flattenObject";
export * from "./checkObjectChange";
export * from "./appointmentGroupByDate";
export * from "./appointmentPrepareEvent";
export * from "./arrayUniqueByKey";
export * from "./clearBrowserCache";
export * from "./conditionalWrapper";
export * from "./getBirthday";
export * from "./getBirthdayFormat";
export * from "./getDifference";
export * from "./generatePdfFromHtml";
export * from "./a11yProps";
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
