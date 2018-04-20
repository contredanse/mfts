//declare var jest, describe, it, expect;
import * as React from 'react';

import { shallow } from 'enzyme';
import { Intro } from '../intro';

describe('Intro component', () => {
    it('renders', () => {
        const wrapper = shallow(<Intro />);
        expect(wrapper.find('div').html()).toMatch(/Introduction/);
    });
});
