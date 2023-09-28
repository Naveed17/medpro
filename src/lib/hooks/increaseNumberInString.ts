export const increaseNumberInString = (text: string) => {
    return text.replace(
        /(\d+$)/g, //match any sequence of digits
        function (match, value) {
            const num = parseInt(value); //convert to a number
            return String(num + 1) //increase by one and turn to a string
                .padStart(value.length, "0");  //pad with zeroes back to the initial length
        });
}
