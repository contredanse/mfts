import { VideoHTMLAttributes } from 'react';
import * as React from 'react';

export type SimpleVideoProps = {
    videoSrcs: Array<{ src: string; type: string }>;
} & VideoHTMLAttributes<HTMLVideoElement>;

const SimpleVideo: React.SFC<SimpleVideoProps> = (props: SimpleVideoProps) => {
    const { videoSrcs, ...mediaProps } = props;
    return (
        <video {...mediaProps}>
            {videoSrcs.map((v, idx) => (
                <source key={idx} src={v.src} type={v.type} />
            ))}
        </video>
    );
};

export default SimpleVideo;
