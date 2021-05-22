import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { productsService } from '../services';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const CART_STORAGE_KEY = '@RocketShoes:cart';

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const initialRender = useRef(true);

  const [cart, setCart] = useState<Product[]>(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY) ?? '';
      return JSON.parse(storedCart);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart])

  const addProduct = async (productId: number) => {
    try {
      const hasStockAvailable = productsService.hasStock(productId, 1);

      if (!hasStockAvailable) {
        throw new Error('Quantidade solicitada fora de estoque');
      }

      const productInCart = cart.find((p) => p.id === productId);

      if (productInCart) {
        updateProductAmount({
          productId,
          amount: productInCart.amount + 1,
        });
        return;
      }

      const product = await productsService.findById(productId);

      setCart((prev) => ([
        ...prev,
        {
          ...product,
          amount: 1,
        }
      ]));
    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productInCart = cart.find((p) => p.id === productId);

      if (!productInCart) {
        throw new Error('Erro na remoção do produto')
      }

      setCart((prev) => prev.filter((p) => p.id !== productInCart.id))
    } catch (error) {
      toast.error(error.message)
    }
  };

  const updateProductAmount = async (payload: UpdateProductAmount) => {
    try {
      if (payload.amount < 1) {
        throw new Error('Quantidade não pode ser menor que "1"')
      }

      const product = cart.find((p) => p.id === payload.productId);

      if (!product) {
        throw new Error('Erro na alteração de quantidade do produto')
      }

      const hasStockAvailable = await productsService.hasStock(payload.productId, payload.amount);

      if (!hasStockAvailable) {
        throw new Error('Quantidade solicitada fora de estoque');
      }

      setCart((prev) => {
        return prev.map((product) => {
          if (product.id === payload.productId) {
            return {
              ...product,
              amount: payload.amount
            }
          }

          return product;
        });
      });
    } catch (error) {
      toast.error(error.message)
    }
  };

  const cartContextValue = {
    cart,
    addProduct,
    removeProduct,
    updateProductAmount
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
