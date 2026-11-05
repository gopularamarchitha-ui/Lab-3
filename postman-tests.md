# Postman test guide

Base URL: `http://localhost:3000`

For POST and PUT requests, select **Body → raw → JSON**.

## Create a book
POST `/books`

```json
{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "price": 450
}
```

Expected: 201 Created.

## Validation failures
POST `/books`

Missing title:
```json
{
  "author": "J.K. Rowling",
  "price": 450
}
```

Non-numeric price:
```json
{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "price": "450"
}
```

Expected: 400 Bad Request.

## Query examples
- GET `/books`
- GET `/books?search_q=Harry`
- GET `/books?order_by=price&order=DESC`
- GET `/books?limit=5&offset=0`
- GET `/books?min_price=100&max_price=500`
- GET `/books?search_q=Harry&order_by=price&order=ASC&limit=5&offset=0&min_price=100&max_price=500`

## Item operations
- GET `/books/1`
- PUT `/books/1` with a valid book JSON body
- DELETE `/books/1`

Also test a non-existent ID such as `99999` for GET, PUT and DELETE. Expected: 404 if the ID does not exist.
