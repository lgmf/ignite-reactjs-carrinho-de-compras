
import { HttpClient, ProductModel } from '../../types';
import { StockService } from '../Stock';

export interface ProductsService {
  list: () => Promise<ProductModel[]>;
  findById: (id: number) => Promise<ProductModel>;
  hasStock: (id: number, amount: number) => Promise<boolean>;
}

export class ProductsServiceImpl implements ProductsService {
  httpClient: HttpClient;
  stockService: StockService;

  baseUrl = '/products';

  constructor(httpClient: HttpClient, stockService: StockService) {
    this.httpClient = httpClient;
    this.stockService = stockService;
  }

  list(): Promise<ProductModel[]> {
    return this.httpClient
      .get<ProductModel[]>(`${this.baseUrl}`)
      .then((response) => response.data);
  }

  async findById(id: number): Promise<ProductModel> {
    return this.httpClient
      .get<ProductModel>(`${this.baseUrl}/${id}`)
      .then((response) => response.data);
  }

  async hasStock(id: number, amount: number): Promise<boolean> {
    try {
      const stock = await this.stockService.getByProductId(id);
      return stock.amount >= amount;
    } catch {
      return false;
    }
  }
}
