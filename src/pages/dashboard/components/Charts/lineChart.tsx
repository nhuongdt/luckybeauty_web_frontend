import React from 'react';
import { Line } from '@ant-design/charts';

const LineChart: React.FC = () => {
    const data = [
        { day: 'Thứ 2', value: 10, name: 'Tuần này' },
        { day: 'Thứ 3', value: 23, name: 'Tuần này' },
        { day: 'Thứ 4', value: 21, name: 'Tuần này' },
        { day: 'Thứ 5', value: 22, name: 'Tuần này' },
        { day: 'Thứ 6', value: 41, name: 'Tuần này' },
        { day: 'Thứ 7', value: 38, name: 'Tuần này' },
        { day: 'Chủ nhật', value: 18, name: 'Tuần này' },
        { day: 'Thứ 2', value: 20, name: 'Tuần trước' },
        { day: 'Thứ 3', value: 34, name: 'Tuần trước' },
        { day: 'Thứ 4', value: 32, name: 'Tuần trước' },
        { day: 'Thứ 5', value: 38, name: 'Tuần trước' },
        { day: 'Thứ 6', value: 36, name: 'Tuần trước' },
        { day: 'Thứ 7', value: 38, name: 'Tuần trước' },
        { day: 'Chủ nhật', value: 30, name: 'Tuần trước' }
    ];

    const config = {
        data,
        xField: 'day',
        yField: 'value',
        seriesField: 'name',
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000
            }
        },
        color: ['#B085A4', '#FFC700']
    };
    return <Line {...config} height={336} />;
};
export default LineChart;
