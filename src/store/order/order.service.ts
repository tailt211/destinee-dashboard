import { destineeApi } from '../../https';
import { ORDER_BY } from '../../model/order-by.enum';
import { OrderDetailDTO } from '../../model/order/dto/order-detail.dto';
import { OrderDTO } from '../../model/order/dto/order.dto';
import { ORDER_STATUS } from '../../model/order/order-status.enum';
import { OrderDetailRESP } from '../../model/order/response/order-detail.response';
import { OrderRESP } from '../../model/order/response/order.response';
import { PaginationRESP } from '../../model/pagination.response';

export const fetchOrders = async (
    limit?: number,
    page?: number,
    orderBy?: ORDER_BY,
    sortBy?: string,
    owner?: string,
    status?: ORDER_STATUS,
) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<OrderRESP>>(`/orders/dashboard`, {
                params: { limit, page, orderBy, sortBy, owner, status },
            })
        ).data;
        return {
            orders: data.results.map((order) => ({
                id: order.id,
                owner: {
                    id: order.owner.id,
                    avatarUrl: order.owner.avatarUrl,
                    name: order.owner.name,
                    username: order.owner.username,
                },
                description: order.description,
                paymentId: order.paymentId,
                status: order.status,
                totalPrice: order.totalPrice,
                createdAt: order.createdAt,
            })) as OrderDTO[],
            totalPage: data.totalPage,
            page: data.page,
        };
    } catch (err: any) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải danh sách đơn hàng');
    }
};

export const fetchOrder = async (id: string) => {
    try {
        const data = (await destineeApi.get<OrderDetailRESP>(`/orders/${id}/dashboard`)).data;
        return {
            id: data.id,
            owner: {
                id: data.owner.id,
                avatarUrl: data.owner.avatarUrl,
                name: data.owner.name,
                username: data.owner.username,
            },
            status: data.status,
            totalPrice: data.totalPrice,
            createdAt: data.createdAt,
            items: data.items,
        } as OrderDetailDTO;
    } catch (err: any) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải đơn hàng');
    }
};