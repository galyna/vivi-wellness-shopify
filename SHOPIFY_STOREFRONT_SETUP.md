# Shopify Storefront API Setup

## 1. Create a Storefront App in Shopify

1. Go to your Shopify admin panel
2. Navigate to **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app**
4. Give it a name (e.g., "Vivi Wellness Storefront")
5. Click **Create app**

## 2. Configure Storefront API Access

1. In your app, go to **Configuration** → **Storefront API access scopes**
2. Add these scopes:
   - `unauthenticated_read_product_listings` - to read published products
   - `unauthenticated_read_product_inventory` - to read inventory levels
   - `unauthenticated_read_product_tags` - to read product tags
   - `unauthenticated_read_product_pickup_locations` - to read pickup locations
3. Click **Save**

## 3. Generate Storefront Access Token

1. Go to **API credentials** → **Storefront API access token**
2. Click **Install app**
3. Copy the **Storefront API access token**

## 4. Environment Variables

Update your `.env.local` file:

```env
# Shopify Storefront Configuration
SHOPIFY_SHOP_NAME=vivi-wellness.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token

# Keep existing Sanity config for other content
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
```

## 5. Test the Integration

1. Run `npm run dev`
2. Go to `/products` page
3. Your Shopify products should now appear

## 6. Advantages of Storefront API

- **Public access** - no need for admin API
- **Better performance** - optimized for frontend
- **GraphQL** - more flexible queries
- **No redirect issues** - direct access to products

## 7. GraphQL Queries

The integration uses GraphQL queries for:
- Product listing with pagination
- Product details by handle
- Filtering by product type and search
- Image and variant information

## 8. Migration Notes

- Products are now fetched via GraphQL Storefront API
- Articles and recipes still use Sanity
- Better performance and reliability
- No more redirect issues 