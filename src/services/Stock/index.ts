import { HttpClient, Stock } from '../../types';

export interface StockService {
  getByProductId: (id: number) => Promise<Stock>;
}

export class StockServiceImpl implements StockService {
  baseUrl = '/stock';
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getByProductId(id: number): Promise<Stock> {
    return this.httpClient
      .get<Stock>(`${this.baseUrl}/${id}`)
      .then((response) => response.data);
  }
}
