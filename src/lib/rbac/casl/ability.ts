import {AbilityBuilder, AbilityClass, FieldMatcher, PureAbility} from '@casl/ability';

function tuple<T extends string[]>(...o: T) {
    return o;
}

const roots = tuple('agenda', 'waiting-room', 'patients', 'payment', 'cashbox', 'documents', 'consultation', 'inventory', 'statistics', 'settings');
type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = typeof roots[number];
type Permissions = { [key: string]: any[] } | null;

export type AppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;
export const fieldMatcher: FieldMatcher = fields => field => fields.includes(field);

export default function defineRulesFor(features: FeatureModel[], permissions: Permissions) {
    const {can, build} = new AbilityBuilder(AppAbility);
    features.forEach(feature => can(['manage', 'read'], feature.root as Subjects, permissions ? permissions[feature.root] : ['*']))
    return build;
}

export function buildAbilityFor(features: FeatureModel[], permissions: Permissions): AppAbility {
    return defineRulesFor(features, permissions)({
        fieldMatcher,
        detectSubjectType: (object: any) => object.type
    });
}
