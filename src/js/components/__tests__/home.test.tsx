//declare var jest, describe, it, expect;
import React from 'react';
// see https://stackoverflow.com/questions/43771517/using-jest-to-test-a-link-from-react-router-v4
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import Home from '../home';
import AppAssetsLocator from '@src/core/app-assets-locator';

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
            <MemoryRouter>
                <Home assetsLocator={assetsLocator} />
            </MemoryRouter>
        );
        expect(wrapper.find(Home).html()).toContain('Material for the spine');
    });
});
