// Функции для работы с Shopify Storefront API (Cart)

export interface ShopifyCartLine {
  id: string;
  merchandiseId: string;
  quantity: number;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLine[];
  subtotal: number;
}

const SHOPIFY_STOREFRONT_API_ENDPOINT = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_ENDPOINT!;
const SHOPIFY_STOREFRONT_API_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN!;

type ShopifyFetchResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

async function shopifyFetch<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(SHOPIFY_STOREFRONT_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json: ShopifyFetchResponse<T> = await res.json();
  if (json.errors && json.errors.length > 0) throw new Error(json.errors[0].message);
  return json.data;
}

// Создать новую корзину
export async function cartCreate(): Promise<ShopifyCart> {
  const query = `mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 50) { edges { node { id merchandise { ... on ProductVariant { id } } quantity } } }
        cost { subtotalAmount { amount } }
      }
    }
  }`;
  type Resp = { cartCreate: { cart: ShopifyCartGraphQL } };
  const data = await shopifyFetch<Resp>(query, { input: {} });
  return normalizeCart(data.cartCreate.cart);
}

// Добавить товар в корзину
export async function cartLinesAdd(cartId: string, merchandiseId: string, quantity: number): Promise<ShopifyCart> {
  const query = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) { edges { node { id merchandise { ... on ProductVariant { id } } quantity } } }
        cost { subtotalAmount { amount } }
      }
    }
  }`;
  type Resp = { cartLinesAdd: { cart: ShopifyCartGraphQL } };
  const data = await shopifyFetch<Resp>(query, { cartId, lines: [{ merchandiseId, quantity }] });
  return normalizeCart(data.cartLinesAdd.cart);
}

// Удалить товар из корзины
export async function cartLinesRemove(cartId: string, lineId: string): Promise<ShopifyCart> {
  const query = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 50) { edges { node { id merchandise { ... on ProductVariant { id } } quantity } } }
        cost { subtotalAmount { amount } }
      }
    }
  }`;
  type Resp = { cartLinesRemove: { cart: ShopifyCartGraphQL } };
  const data = await shopifyFetch<Resp>(query, { cartId, lineIds: [lineId] });
  return normalizeCart(data.cartLinesRemove.cart);
}

// Изменить количество товара
export async function cartLinesUpdate(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const query = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) { edges { node { id merchandise { ... on ProductVariant { id } } quantity } } }
        cost { subtotalAmount { amount } }
      }
    }
  }`;
  type Resp = { cartLinesUpdate: { cart: ShopifyCartGraphQL } };
  const data = await shopifyFetch<Resp>(query, { cartId, lines: [{ id: lineId, quantity }] });
  return normalizeCart(data.cartLinesUpdate.cart);
}

// Получить корзину по cartId
export async function getCart(cartId: string): Promise<ShopifyCart> {
  const query = `query cart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      lines(first: 50) { edges { node { id merchandise { ... on ProductVariant { id } } quantity } } }
      cost { subtotalAmount { amount } }
    }
  }`;
  type Resp = { cart: ShopifyCartGraphQL };
  const data = await shopifyFetch<Resp>(query, { id: cartId });
  return normalizeCart(data.cart);
}

// Типы для GraphQL-ответа
interface ShopifyCartGraphQL {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: {
        id: string;
        merchandise: { id: string };
        quantity: number;
      };
    }>;
  };
  cost: {
    subtotalAmount: { amount: string };
  };
}

// Привести объект корзины к удобному виду
function normalizeCart(cart: ShopifyCartGraphQL): ShopifyCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: cart.lines.edges.map((e): ShopifyCartLine => ({
      id: e.node.id,
      merchandiseId: e.node.merchandise.id,
      quantity: e.node.quantity,
    })),
    subtotal: parseFloat(cart.cost.subtotalAmount.amount),
  };
} 