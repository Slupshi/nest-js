import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    products: Array<ProductQuantity>;
}

class ProductQuantity {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    quantity: number;
    @IsNumber()
    @IsNotEmpty()
    price: number;
    @IsNumber()
    @IsNotEmpty()
    productId: number;
}
