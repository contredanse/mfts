//declare var jest, describe, it, expect;
import * as React from 'react';
// see https://stackoverflow.com/questions/43771517/using-jest-to-test-a-link-from-react-router-v4
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import Home from '../home';
import AppAssetsLocator from '@src/core/app-assets-locator';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({
    lang: 'en',
});

describe('<Home />', () => {
    const assetsLocator = new AppAssetsLocator({
        assetsUrls: {
            default: 'http://default',
            videos: 'http://videos',
            //            videoCovers: '',
        },
    });

    it('should contain title', () => {
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <Home assetsLocator={assetsLocator} lang="en" />
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.find(Home).html()).toContain('Material for the spine');
    });
});
