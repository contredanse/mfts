import { configure } from 'enzyme';
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

import 'jest-enzyme';

configure({ adapter: new Adapter() });
