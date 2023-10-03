import {TransactionStatus, TransactionType} from "@lib/constants";
import {useCallback} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import moment from "moment";

function useTransactionEdit() {
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {selectedBoxes} = useAppSelector(cashBoxSelector);

    const {trigger: triggerPostTransaction} = useRequestQueryMutation("/payment/transaction");

    const trigger = useCallback((selectedPayment: any, transaction: any, successFn: Function) => {
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
                    payment_date: pay.payment_date,
                    payment_time: pay.payment_time,
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
            const url = `${urlMedicalEntitySuffix}/transactions/${selectedPayment.isNew ? router.locale : `${transaction?.uuid}/${router.locale}`}`;
            triggerPostTransaction({
                method,
                url,
                data: form
            }, {
                onSuccess: () => successFn && successFn()
            })
        }
    }, [router.locale, selectedBoxes, triggerPostTransaction, urlMedicalEntitySuffix]);

    return {
        trigger
    }
}

export default useTransactionEdit;
