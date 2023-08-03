import {TransactionStatus, TransactionType} from "@lib/constants";
import {Session} from "next-auth";

// @ts-ignore
export const OnTransactionEdit = (selectedPayment: any, selectedBoxes: any, locale: string | undefined, session: Session | null, medical_entity_uuid: string,transactions: any, trigger) => {

    let payed_amount = 0
    let transaction_data: any[] = [];
    let insurances = [];

    selectedPayment.payments.map((pay: any) => {
            payed_amount += pay.amount
            insurances.push(pay.insurance)
            transaction_data.push({
                //...pay,
                amount:pay.amount,
                payment_means: pay.payment_means ? pay.payment_means.uuid : "",
                insurance: pay.insurance ? pay.insurance.uuid : "",
                status_transaction: TransactionStatus[1].value,
                type_transaction: TransactionType[2].value,
                data: {
                    insurances: pay.insurance ? [{uuid: pay.insurance.uuid}] : "",
                    rest: selectedPayment.total - selectedPayment.payed_amount - payed_amount,
                    total: selectedPayment.total,
                    //type: selectedPayment.appointment.appointment_type.name,
                    ...pay.data
                }
            })
        }
    )

    if (selectedBoxes.length > 0) {
        const form = new FormData();
        form.append("type_transaction", TransactionType[2].value);
        form.append("status_transaction", TransactionStatus[1].value);
        form.append("cash_box", selectedBoxes[0]?.uuid);
        form.append("amount", selectedPayment.total.toString());
        form.append("rest_amount", (selectedPayment.total - selectedPayment.payed_amount - payed_amount).toString());
        form.append("appointment", selectedPayment.uuid);
        form.append("transaction_data", JSON.stringify(transaction_data));
        //if (selectedPayment.isNew) {
        const method = selectedPayment.isNew ? "POST" : "PUT";
        const url = selectedPayment.isNew  ? `/api/medical-entity/${medical_entity_uuid}/transactions/${locale}` : `/api/medical-entity/${medical_entity_uuid}/transactions/${transactions?.uuid}/${locale}`;
        trigger({
            method,
            url,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then(() => {
            //enqueueSnackbar(t("addsuccess"), {variant: 'success'})
        }).catch((error: any) => console.log("error ", error))
    }
};
