import * as React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loading = () => (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    </div>
);

export default Loading;
