interface LocationModel {
  uuid: string;
  name: string;
  point: string[];
  polygon: array<string>[];
  radius: number;
  country: CountryModel;
}