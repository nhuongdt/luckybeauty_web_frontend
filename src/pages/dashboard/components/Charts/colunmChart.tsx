import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
const RevenueColumnChart: React.FC = () => {
    const data = [
        {
            month: 'Tháng 1',
            value: 100,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 2',
            value: 15,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 3',
            value: 6,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 4',
            value: 18,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 5',
            value: 13,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 6',
            value: 125,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 7',
            value: 40,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 8',
            value: 55,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 9',
            value: 55,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 10',
            value: 7,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 11',
            value: 10,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 12',
            value: 6,
            type: 'Tuần này'
        },
        {
            month: 'Tháng 1',
            value: 110,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 2',
            value: 260,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 3',
            value: 200,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 4',
            value: 180,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 5',
            value: 240,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 6',
            value: 120,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 7',
            value: 230,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 8',
            value: 115,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 9',
            value: 205,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 10',
            value: 201,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 11',
            value: 135,
            type: 'Tuần trước'
        },
        {
            month: 'Tháng 12',
            value: 270,
            type: 'Tuần trước'
        }
    ];
    const configColumn = {
        data,
        isStack: true,
        xField: 'month',
        yField: 'value',
        seriesField: 'type',
        colorField: 'type',
        columnStyle: {
            lineWidth: 1
        },
        color: ['#7C3367', '#E5D6E1']
    };
    return <Column {...configColumn} height={300} autoFit={false} />;
};
export default RevenueColumnChart;
