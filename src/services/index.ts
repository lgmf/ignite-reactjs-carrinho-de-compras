import { api } from './api';
import { ProductsServiceImpl } from './Products';
import { StockServiceImpl } from './Stock';

export const stockService = new StockServiceImpl(api);
export const productsService = new ProductsServiceImpl(api, stockService);