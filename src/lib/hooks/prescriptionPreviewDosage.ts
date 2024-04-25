export const prescriptionPreviewDosage = (dosage: string) => {
    let previewDosage = "";
    const dosageCycles = dosage.split(" • ");
    dosageCycles.forEach((dosage: any, index) => {
        const dosageData = dosage.split(" ");
        const cycleUnit = `${dosageData[0]} ${dosageData[1]}`.replace(",", "");
        const ampersand = index === 0 && dosageCycles.length > 1 ? "," : "et"
        const dosageTimes: any = {
            [`${cycleUnit},`]: cycleUnit,
            'Matin/Midi/Soir': `Matin, ${cycleUnit} Midi ${ampersand} ${cycleUnit} Soir`,
            'Matin/Midi': `Matin ${ampersand} ${cycleUnit} Midi`,
            'Matin/Soir': `Matin ${ampersand} ${cycleUnit} Soir`,
            'Midi/Soir': `Midi ${ampersand} ${cycleUnit} Soir`
        };
        const reg = new RegExp(Object.keys(dosageTimes).join("|"), "g");
        previewDosage += `${index > 0 && !dosage.match(reg, (matched: any) => dosageTimes[matched]) ? " et " : (index !== 0 ? ", " : " ")}${dosage.replace(reg, (matched: any) => dosageTimes[matched])}`;
    })

    return previewDosage
}
