//declare var jest, describe, it, expect;
import * as React from 'react';

import { shallow } from 'enzyme';
import Home from '../home';

describe('Home component', () => {
    it('renders', () => {
        const wrapper = shallow(<Home />);
        expect(wrapper.find('div').html()).toMatch(/Home/);
    });
});
