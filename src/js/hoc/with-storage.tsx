import React from 'react';
import { Subtract } from 'utility-types';

type InjectedStorageProps = {
    load: (key: string) => string | null;
    save: (key: string, data: string) => void;
    remove: (key: string) => void;
};

type WithStorageState = {
    localStorageAvailable: boolean;
};

const withStorage = <P extends InjectedStorageProps>(WrappedComponent: React.ComponentType<P>) => {
    class WithStorage extends React.Component<Subtract<P, InjectedStorageProps>, WithStorageState> {
        state = {
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
            return <WrappedComponent load={this.load} save={this.save} remove={this.remove} {...this.props} />;
        }
    }

    return WithStorage;
};

export default withStorage;
