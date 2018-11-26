import { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// https://medium.com/netscape/connecting-react-component-to-redux-store-with-render-callback-53fd044bb42b

interface OuterProps {
    children: (state: any, dispatch: Dispatch<any>) => ReactElement<any>;
    selector?: (state: any) => any;
}

interface InnerProps extends OuterProps {
    state: any;
    dispatch: Dispatch<any>;
}

function WithStoreInner({ children, state, dispatch }: InnerProps) {
    return children(state, dispatch);
}

// TODO: try to make this type safe
const defaultSelector = (state: any) => state;

// TODO:use selector to limit number of times component will update
export const WithStore = connect(
    (state, { selector = defaultSelector }: any) => ({ state: selector(state) }),
    dispatch => ({ dispatch })
)(WithStoreInner) as React.ComponentClass<OuterProps>;
