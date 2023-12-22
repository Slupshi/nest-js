import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDTO: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        title: createProductDTO.title,
        price: createProductDTO.price,
      }
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.product.delete({
      where: { id }
    });;
  }
}
