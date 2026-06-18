'use client';

import { Button, Dropdown } from 'antd';
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

    const menuProps = {
        items,
        selectedKeys: [String(columnCount)],
    };

    return (
        <Dropdown menu={menuProps} trigger={['click']} placement="bottomLeft">
            <Button className="!bg-[var(--color-accent)] !w-[140px] !h-[45px] !text-[var(--text-btn-upload)] !text-[24px] !font-bold hover:!bg-[var(--color-accent-hover)] !rounded-xl !justify-center !items-center">
                Team {columnCount}
                <img src="/image/arrow 1.png" width={30} height={30} alt="User" />
            </Button>
        </Dropdown>
    );
};
