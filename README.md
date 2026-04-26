# Node.js REST API Documentation

This REST API provides endpoints to manage resources with a **standardized JSON response envelope**.

---

## Response Structure

All API responses follow the same structure:

```json
{
  "status": "string",
  "message": "string",
  "data": "object | null"
}
```

---

## Response Status

### Request Phase (request in progress)

- **IDLE** – Request has not started yet
- **LOADING** – Request is in progress

### Response Phase (successful response)

- **SUCCESS** – Request completed successfully with data
- **EMPTY** – Request completed successfully but no data found
- **VALIDATION_ERROR** – Input validation failed
- **INTERNAL_SERVER_ERROR** – Unexpected server error
- **PRODUCT_NOT_FOUND** – Requested product does not exist

### Error Phase (network or client errors)

- **ERROR** – Generic error
- **NETWORK_ERROR** – Network request failed
- **ABORTED** – Request was canceled by the client

---

## Data Field per Endpoint

### GET /get-all-products

Obtiene la lista completa de productos disponibles en el catálogo.

**Request:**
`GET /api/products/get-all-products`

**Posibles respuestas:**

- **Status: `SUCCESS`**
  - **Data:** `Array<Product>`
  - **Estructura del objeto Product:**
    ```json
    {
      "id_product": "string (UUID)",
      "id_color": "string (Hex/ID)",
      "id_model": "string",
      "title": "string",
      "description": "string",
      "category": "men | women | kids",
      "price": 0.0,
      "size": 0,
      "stock_total": 0,
      "stock_reserved": 0,
      "image": "url_string"
    }
    ```

- **Status: `EMPTY`**
  - **Data:** `[]` (Array vacío cuando no hay productos en la DB).

- **Status: `INTERNAL_SERVER_ERROR`**
  - **Data:** null

---

### GET /get-product-by-id/:id

Obtiene los detalles de un producto específico mediante su ID.

**Request:**
`GET /api/products/get-product-by-id/123`

**Posibles respuestas:**

- **Status: `SUCCESS`**
  - **Data:** `Object (Product)` (El objeto individual del producto).

- **Status: `PRODUCT_NOT_FOUND`**
  - **Data:** `null`
  - **Message:** "El producto con el ID proporcionado no existe."

---

### POST /create-product

Registra un nuevo producto en el sistema.

**Request Body:**

```json
{
  "name": "string",
  "price": "number",
  "stock": "number"
}
```

## How to enable for production

-  Comment and uncomment some lines of code on files api.js / createPaypalOrderService.js  (search for an astherisc * to locate them)

