//import { PageBreadcrumbProps } from '@src/components/page-breadcrumb';

export type NavBreadcrumbProps = {
    title: string;
};

// Use const enums for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.

export const enum NavActionTypes {
    SET_NAV_BREADCRUMB = '@@nav/SET_PAGE_BREADCRUMB',
}

export interface NavState {
    readonly navBreadcrumb?: NavBreadcrumbProps;
    readonly previousLocation?: string;
    readonly currentLocation?: string;
}
