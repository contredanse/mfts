import { configure } from 'enzyme';
// Sorry ts-lint require important here if allowSyntheticImports: false
const Adapter = require('enzyme-adapter-react-16');

import 'jest-enzyme';

configure({ adapter: new Adapter() });
