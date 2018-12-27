//declare var jest, describe, it, expect;
import * as React from 'react';

import { mount, shallow } from 'enzyme';
import VideoPlayer from '../video-player';

describe('Video player component', () => {
    it('should render with "video" tag', () => {
        const wrapper = mount(<VideoPlayer />);
        // Because of fragment
        expect(wrapper.find('video')).toBeTruthy();
    });

    it('should set properties', () => {
        const wrapper = shallow(<VideoPlayer loop={true} />);
        expect(wrapper.find('video').props().loop).toEqual(true);
    });

    it('should set videos sources', () => {
        const wrapper = shallow(
            <VideoPlayer
                srcs={[
                    { src: 'http://localhost/videos/test_video.webm', type: 'video/webm; vp9' },
                    { src: 'http://localhost/videos/test_video.mp4', type: 'video/mp4' },
                ]}
            />
        );
        expect(wrapper.find('video').children().length).toEqual(2);
        expect(
            wrapper
                .find('video')
                .find('source')
                .first()
                .props().src
        ).toEqual('http://localhost/videos/test_video.webm');
    });

    it('should call events', () => {
        const spyFn = jest.fn();
        const wrapper = shallow(<VideoPlayer onCanPlay={spyFn} />);
        wrapper.find('video').simulate('canPlay');
        expect(spyFn).toHaveBeenCalled();
    });
});
