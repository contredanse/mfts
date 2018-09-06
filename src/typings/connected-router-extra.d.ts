/**
 * Remove this when connected router is > 4.4.1
 */

import { LOCATION_CHANGE, RouterState } from 'connected-react-router';

export interface LocationChangeAction {
    type: typeof LOCATION_CHANGE;
    payload: RouterState;
}
