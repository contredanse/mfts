import { action } from 'typesafe-actions';

import { NavActionTypes, NavBreadcrumbProps } from './types';
import { LOCATION_CHANGE } from 'connected-react-router';

// Here we use the `action` helper function provided by `typesafe-actions`.
// This library provides really useful helpers for writing Redux actions in a type-safe manner.
// For more info: https://github.com/piotrwitek/typesafe-actions
//
// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly as well.

export const setPageBreadcrumb = (breadcrumb?: NavBreadcrumbProps) =>
    action(NavActionTypes.SET_NAV_BREADCRUMB, breadcrumb);
