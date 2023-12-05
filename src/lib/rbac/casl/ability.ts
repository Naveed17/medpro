import {AbilityBuilder, PureAbility, AbilityClass} from '@casl/ability';

type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = 'agenda' | 'waiting-room' | 'patient' | 'payment' | 'cashbox' | 'documents' | 'inventory';

export type AppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;

export default function defineRulesFor(role: string) {
    const {can, build} = new AbilityBuilder(AppAbility);

    if (role === 'ROLE_PROFESSIONAL') {
        can(['manage', 'read', 'create'], 'agenda');
        can(['manage', 'read', 'create'], 'waiting-room');
        can(['manage', 'read', 'create'], 'patient');
        can(['manage', 'read', 'create'], 'cashbox');
        can(['manage', 'read', 'create'], 'documents');
    } else {
        can(['read', 'create'], 'agenda');
        can([ 'read', 'create'], 'waiting-room');
    }

    return build;
}

export function buildAbilityFor(role: string): AppAbility {
    return defineRulesFor(role)({
        detectSubjectType: (object: any) => object.type
    });
}
