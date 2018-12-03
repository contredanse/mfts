import React from 'react';
import { Subtract } from 'utility-types';

type InjectedProps = {
    load: (key: string) => string | null;
    save: (key: string, data: string) => void;
    remove: (key: string) => void;
};

const withStorage = <WrappedProps extends InjectedProps>(WrappedComponent: React.ComponentType<WrappedProps>) => {
    // These props will be added to original component type

    type HocProps = Subtract<WrappedProps, InjectedProps> & {
        // here you can extend hoc props
        initialCount?: number;
    };

    type HocState = {
        localStorageAvailable: boolean;
    };

    class WithStorage extends React.Component<HocProps, HocState> {
        // Enhance component name for debugging and React-Dev-Tools
        static displayName = `withState(${WrappedComponent.name})`;
        // reference to original wrapped component
        static readonly WrappedComponent = WrappedComponent;

        readonly state: HocState = {
            localStorageAvailable: false,
        };

        componentDidMount() {
            this.checkLocalStorageExists();
        }

        checkLocalStorageExists(): void {
            const testKey = 'test';

            try {
                localStorage.setItem(testKey, testKey);
                localStorage.removeItem(testKey);
                this.setState({ localStorageAvailable: true });
            } catch (e) {
                this.setState({ localStorageAvailable: false });
            }
        }

        load = (key: string): string | null => {
            if (this.state.localStorageAvailable) {
                return localStorage.getItem(key);
            }

            return null;
        };

        save = (key: string, data: any): void => {
            if (this.state.localStorageAvailable) {
                localStorage.setItem(key, data);
            }
        };

        remove = (key: string): void => {
            if (this.state.localStorageAvailable) {
                localStorage.removeItem(key);
            }
        };

        render() {
            const { ...restProps } = this.props as {};

            return <WrappedComponent {...restProps} load={this.load} save={this.save} remove={this.remove} />;
        }
    }

    return WithStorage;
};

export default withStorage;
