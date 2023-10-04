const arrayRange = (start: number, stop: number, step: number) =>
    Array.from(
        {length: (stop - start) / step + 1},
        (value, index) => (start + index * step).toString()
    );

export const defaultValues: any = {
    sphere: arrayRange(-25, 25, 0.25),
    cylindre: arrayRange(-10, 10, 0.25),
    axe: arrayRange(5, 180, 5),
    cl: ["PL-", "PLMO", "PL+", "CD 10cm", "CD 20cm", "CD 30cm", "CD 40cm", "CD 50cm", "CD 1m", "CD 2m", "CD 3m", "CD 4m", "CD 5m", "1/20", "1/10", "2/10", "3/10", "4/10", "5/10", "6/10", "7/10", "8/10", "9/10", "10/10"],
    cp: ["P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20"]
}

export const impact = [
    {pachymetry: "445", correction: 7},
    {pachymetry: "455", correction: 6},
    {pachymetry: "465", correction: 6},
    {pachymetry: "475", correction: 5},
    {pachymetry: "485", correction: 4},
    {pachymetry: "495", correction: 4},
    {pachymetry: "505", correction: 3},
    {pachymetry: "515", correction: 2},
    {pachymetry: "525", correction: 1},
    {pachymetry: "535", correction: 1},
    {pachymetry: "545", correction: 0},
    {pachymetry: "555", correction: -1},
    {pachymetry: "565", correction: -1},
    {pachymetry: "575", correction: -2},
    {pachymetry: "585", correction: -3},
    {pachymetry: "595", correction: -4},
    {pachymetry: "605", correction: -4},
    {pachymetry: "615", correction: -5},
    {pachymetry: "625", correction: -6},
    {pachymetry: "635", correction: -6},
    {pachymetry: "645", correction: -7},
]