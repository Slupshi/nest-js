import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles as RoleEnum } from '../users/dto/create-user.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Response } from 'express';

@ApiTags('Orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @Roles([RoleEnum.Client])
  async create(@Res() res: Response, @Request() req, @Body() createOrderDto: CreateOrderDto) {
    try {
      if (!createOrderDto) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need body');
      }
      if (!req?.user?.id) {
        return res.status(HttpStatus.UNAUTHORIZED).send();
      }
      const newOrder = await this.ordersService.create(createOrderDto, req.user.id);
      return res.status(HttpStatus.CREATED).send(newOrder);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Get()
  @Roles([RoleEnum.Manager])
  async findAll(@Res() res: Response) {
    try {
      const orders = await this.ordersService.findAll();
      return res.status(HttpStatus.OK).send(orders);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Get(':id')
  @Roles([RoleEnum.Client])
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      if (!+id) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need id');
      }
      const order = await this.ordersService.findOne(+id);
      if (!order) {
        return res.status(HttpStatus.NOT_FOUND).send(`Order not found for id: ${+id}`);
      }
      return res.status(HttpStatus.OK).send(order);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Patch(':id')
  @Roles([RoleEnum.Client])
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      if (!+id) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need id');
      }
      if (!updateOrderDto) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need body');
      }
      const updatedOrder = await this.ordersService.update(+id, updateOrderDto);
      return res.status(HttpStatus.OK).send(updatedOrder);
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
      await this.ordersService.remove(+id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }
}
