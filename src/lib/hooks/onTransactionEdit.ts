import {TransactionStatus, TransactionType} from "@lib/constants";
import {Session} from "next-auth";

// @ts-ignore
export const OnTransactionEdit = (selectedPayment: any, selectedBoxes: any, locale: string | undefined, session: Session | null, medical_entity_uuid: string, transactions: any, trigger, urlMedicalEntitySuffix, successFn) => {

    let payed_amount = 0
    let transaction_data: any[] = [];
    let insurances = [];

    selectedPayment.payments.map((pay: any) => {
            payed_amount += pay.amount
            insurances.push(pay.insurance)
            transaction_data.push({
                amount: pay.amount,
                payment_means: pay.payment_means ? pay.payment_means.uuid : "",
                insurance: pay.insurance ? pay.insurance : "",
                status_transaction: pay.status_transaction,
                type_transaction: pay.type_transaction,
                data: {
                    rest: selectedPayment.total - selectedPayment.payed_amount - payed_amount,
                    total: selectedPayment.total,
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
        form.append("rest_amount", (selectedPayment.total - payed_amount).toString());
        form.append("appointment", selectedPayment.appointment?.uuid);
        form.append("transaction_data", JSON.stringify(transaction_data));
        const method = selectedPayment.isNew ? "POST" : "PUT";
        const url = selectedPayment.isNew ? `${urlMedicalEntitySuffix}/transactions/${locale}` : `${urlMedicalEntitySuffix}/transactions/${transactions?.uuid}/${locale}`;

        trigger({
            method,
            url,
            data: form
        }).then(() => {
            successFn();
        })
    }
};
