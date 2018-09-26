/**
 * Utility HOC for getting video currentTime, bufferedTime and duration
 */
import React from 'react';
import { Subtract } from 'utility-types';

export type InjectedWithMediaActionsProps = {};

type WithMediaActionsProps = {};

type MediaActionsState = {};

const defaultState: MediaActionsState = {};

const withMediaActions = <P extends InjectedWithMediaActionsProps>(WrappedComponent: React.ComponentType<P>) => {
    type MediaActionsInnerProps = Subtract<P, InjectedWithMediaActionsProps> & WithMediaActionsProps;

    class WithMediaActions extends React.Component<MediaActionsInnerProps, MediaActionsState> {
        readonly state: MediaActionsState;

        protected interval!: number;

        constructor(props: P & WithMediaActionsProps) {
            super(props);
            this.state = defaultState;
        }

        componentDidMount() {}

        componentWillUnmount() {}

        render() {
            // destructure inner props
            const { ...componentProps } = this.props as WithMediaActionsProps;

            return <WrappedComponent {...componentProps} />;
        }
    }
    return WithMediaActions;
};

export default withMediaActions;
