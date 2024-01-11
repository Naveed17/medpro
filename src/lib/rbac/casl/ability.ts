import {AbilityBuilder, PureAbility, AbilityClass, FieldMatcher} from '@casl/ability';

type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects =
    'agenda'
    | 'waiting-room'
    | 'patient'
    | 'payment'
    | 'cashbox'
    | 'documents'
    | 'consultation'
    | 'inventory'
    | 'statistics'
    | 'settings';

export type AppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;
export const fieldMatcher: FieldMatcher = fields => field => fields.includes(field);

export default function defineRulesFor(features: FeatureModel[]) {
    const {can, build} = new AbilityBuilder(AppAbility);

    features.forEach(feature => can(['manage', 'read'], feature.slug as Subjects, [...feature?.permissions?.map(permission => permission?.slug) ?? '*']))

    return build;
}

export function buildAbilityFor(features: FeatureModel[]): AppAbility {
    return defineRulesFor(features)({
        fieldMatcher,
        detectSubjectType: (object: any) => object.type
    });
}
