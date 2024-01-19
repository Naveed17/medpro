import {AbilityBuilder, AbilityClass, FieldMatcher, PureAbility} from '@casl/ability';

function tuple<T extends string[]>(...o: T) {
    return o;
}

const roots = tuple('agenda', 'waiting-room', 'patient', 'payment', 'cashbox', 'documents', 'consultation', 'inventory', 'statistics', 'settings');
type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = typeof roots[number];

export type AppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;
export const fieldMatcher: FieldMatcher = fields => field => fields.includes(field);

export default function defineRulesFor(features: FeatureModel[]) {
    const {can, build} = new AbilityBuilder(AppAbility);
    features.forEach(feature => can(['manage', 'read'], feature.slug as Subjects, [...feature?.permissions ?? '*']))
    return build;
}

export function buildAbilityFor(features: FeatureModel[]): AppAbility {
    return defineRulesFor(features)({
        fieldMatcher,
        detectSubjectType: (object: any) => object.type
    });
}
