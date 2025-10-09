'use client';

import { Button, Dropdown, Menu } from 'antd';
import React from 'react';
import type { MenuProps } from 'antd';

type ButtonChangeColumnProps = {
    setColumnCount: (count: number) => void;
    columnCount: number;
};

export const ButtonChangeColumn = ({
    setColumnCount,
    columnCount,
}: ButtonChangeColumnProps) => {
    const items: MenuProps['items'] = [
        {
            key: '7',
            label: 'Team 7',
            onClick: () => setColumnCount(7),
        },
        {
            key: '5',
            label: 'Team 5',
            onClick: () => setColumnCount(5),
        },
        {
            key: '2',
            label: 'Team 2',
            onClick: () => setColumnCount(2),
        },
    ];

    const menu = <Menu items={items} selectedKeys={[String(columnCount)]} />;

    return (
        <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
            <Button className="!bg-[#97DDD9] !w-[140px] !h-[45px] !text-black !text-[24px] !font-bold hover:!bg-blue-400 !rounded-xl !justify-center !items-center">
                Team {columnCount}
                <img src="/image/arrow 1.png" width={30} height={30} alt="User" />
            </Button>
        </Dropdown>
    );
};