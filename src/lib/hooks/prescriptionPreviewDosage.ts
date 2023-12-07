export const prescriptionPreviewDosage = (dosage: string) => {
    const dosageTimes: any = {
        'Matin/Midi/Soir': 'Matin, Midi et Soir',
        'Matin/Midi': 'Matin et Midi',
        'Matin/Soir': 'Matin et Soir',
        'Midi/Soir': 'Midi et Soir'
    };

    const reg = new RegExp(Object.keys(dosageTimes).join("|"), "g");
    return dosage.replace(reg, (matched) => dosageTimes[matched]);
}
