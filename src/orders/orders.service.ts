import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createOrderDto: CreateOrderDto, userId: number) {

    const total = createOrderDto.products.reduce((accumulator, value) => {
      return accumulator + (value.price * value.quantity);
    }, 0);

    return await this.prisma.order.create({
      data: {
        userId,
        total,
        products: {
          createMany: {
            data: createOrderDto.products.map((e) =>
            ({
              productId: e.productId,
              quantity: e.quantity
            }))
          }
        }
      },
      include: {
        products: true,
      }
    });
  }

  async findAll() {
    return await this.prisma.order.findMany({
      include: {
        products: true,
      }
    });
  }

  async findOne(id: number) {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        products: true,
      }
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {

    const total = updateOrderDto.products.reduce((accumulator, value) => {
      return accumulator + (value.price * value.quantity);
    }, 0);

    return await this.prisma.order.update({
      where: { id },
      data: {
        total,
        products: {
          deleteMany: {
            orderId: id,
            NOT: updateOrderDto.products.map(({ productId }) => ({ productId })),
          },
          upsert: updateOrderDto.products.map((e) =>
          ({
            where: {
              productId_orderId: {
                orderId: id,
                productId: e.productId,
              }
            },
            create: {
              productId: e.productId,
              quantity: e.quantity,
            },
            update: {
              productId: e.productId,
              quantity: e.quantity,
            },
          }))
        }
      },
      include: {
        products: true,
      }
    });
  }

  async remove(id: number) {
    return await this.prisma.order.delete({
      where: { id }
    });;
  }
}
