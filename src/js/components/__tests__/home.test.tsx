//declare var jest, describe, it, expect;
import * as React from 'react';
// see https://stackoverflow.com/questions/43771517/using-jest-to-test-a-link-from-react-router-v4
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import Home from '../home';

describe('<Home />', () => {
    it('should contain title', () => {
        const wrapper = mount(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(wrapper.find(Home).html()).toContain('Material for the spine');
    });
});
