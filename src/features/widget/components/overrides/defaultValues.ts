const arrayRange = (start: number, stop: number, step: number) =>
    Array.from(
        {length: (stop - start) / step + 1},
        (value, index) => (start + index * step).toString()
    );

export const defaultValues:any = {
    sphere: arrayRange(-25, 25, 0.25),
    cylindre: arrayRange(-10, 10, 0.25),
    axe: arrayRange(5, 180, 5),
    cl: ["PL-", "PLMO", "PL+", "CD 10cm", "CD 20cm", "CD 30cm", "CD 40cm", "CD 50cm", "CD 1m", "CD 2m", "CD 3m", "CD 4m", "CD 5m", "1/20", "1/10", "2/10", "3/10", "4/10", "5/10", "6/10", "7/10", "8/10", "9/10", "10/10"],
    cp: ["P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20"]
}