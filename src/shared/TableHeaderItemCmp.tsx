import { HStack, Icon, Text, Th } from '@chakra-ui/react';
import React from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { ORDER_BY } from '../model/order-by.enum';

export interface TableHeaderItemProps {
    label?: string;
    name: string;
    isSortable: boolean;
    orderBy?: ORDER_BY;
    sortBy?: string;
    sortHandler?: () => void;
    center?: boolean;
}

const TableHeaderItemCmp: React.FC<TableHeaderItemProps> = ({ name, isSortable, sortHandler, orderBy, sortBy, label, center = false }) => {
    const icon = isSortable
        ? ((orderBy === ORDER_BY.ASC && sortBy === label)
            ? FaCaretUp : FaCaretDown) : undefined;
    return (
        <Th color="gray.400"  onClick={isSortable ? sortHandler : () => {}} cursor={isSortable ? 'pointer' : 'default'}>
            <HStack justifyContent={center ? 'center' : undefined}>
                <Text>{name}</Text>
                {isSortable && <Icon as={icon} color={sortBy === label ? 'red.500' : 'gray.900'} />}
            </HStack>
        </Th>
    );
};

export default TableHeaderItemCmp;
