import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { IsPublic } from 'src/utils/decorators/is-public.decorator';
import { Roles as RoleEnum } from '../users/dto/create-user.dto';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @Roles([RoleEnum.Manager])
  async create(@Res() res: Response, @Body() createProductDto: CreateProductDto) {
    try {
      if (!createProductDto) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need body');
      }
      const newProduct = await this.productsService.create(createProductDto);
      return res.status(HttpStatus.CREATED).send(newProduct);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Get()
  @IsPublic()
  async findAll(@Res() res: Response) {
    try {
      const products = await this.productsService.findAll();
      return res.status(HttpStatus.OK).send(products);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Get(':id')
  @IsPublic()
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      if (!+id) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need id');
      }
      const product = await this.productsService.findOne(+id);
      if (!product) {
        return res.status(HttpStatus.NOT_FOUND).send(`Product not found for id: ${+id}`);
      }
      return res.status(HttpStatus.OK).send(product);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Patch(':id')
  @Roles([RoleEnum.Manager])
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      if (!+id) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need id');
      }
      if (!updateProductDto) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need body');
      }
      const updatedProduct = await this.productsService.update(+id, updateProductDto);
      return res.status(HttpStatus.OK).send(updatedProduct);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Delete(':id')
  @Roles([RoleEnum.Manager])
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      if (!+id) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need id');
      }
      await this.productsService.remove(+id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }
}
