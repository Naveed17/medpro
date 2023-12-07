import {AbilityBuilder, PureAbility, AbilityClass} from '@casl/ability';

type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects =
    'agenda'
    | 'waiting-room'
    | 'patient'
    | 'payment'
    | 'cashbox'
    | 'documents'
    | 'inventory'
    | 'statistics'
    | 'settings';

export type AppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;

export default function defineRulesFor(features: FeatureModel[]) {
    const {can, build} = new AbilityBuilder(AppAbility);

    features.forEach(feature => can(['manage', 'read', 'create'], feature.slug as Subjects))

    return build;
}

export function buildAbilityFor(features: FeatureModel[]): AppAbility {
    return defineRulesFor(features)({
        detectSubjectType: (object: any) => object.type
    });
}
