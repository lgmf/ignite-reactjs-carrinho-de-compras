import { AxiosInstance } from "axios";

export interface ProductModel {
  id: number;
  title: string;
  price: number;
  image: string;
}
export interface Product extends ProductModel {
  amount: number;
}

export interface Stock {
  id: number;
  amount: number;
}

export interface HttpClient extends AxiosInstance {
  
}
