# Lab 3: REST API, query parameters, validation, debugging

## Student details
- Name: YOUR NAME
- Registration number: YOUR REGISTRATION NUMBER
- Section: YOUR SECTION

## Live link
Not deployed yet. Add the deployed public URL here after deployment. If deployment is not possible, explain why and include Postman screenshots of every endpoint.

## Technologies
- Node.js
- Express
- SQLite
- Postman

## Install and run
1. Install Node.js.
2. Open a terminal in this `lab-03` directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start in development mode:

   ```bash
   npm run dev
   ```

   Or start normally:

   ```bash
   npm start
   ```

The server uses port `3000` by default. To use another port, set the `PORT` environment variable. No credentials or `.env` values are required for this local version. The SQLite database file is created automatically.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/books` | List books with search, sorting, pagination and price filters |
| GET | `/books/:id` | Retrieve one book by ID |
| POST | `/books` | Create a book after validating the request body |
| PUT | `/books/:id` | Update a book after validating the request body |
| DELETE | `/books/:id` | Delete a book by ID |

### GET `/books` query parameters

| Parameter | Default | Description |
|---|---|---|
| `search_q` | empty string | Partial title search using `LIKE` |
| `order_by` | `id` | Sort column: `id`, `title`, `author`, or `price` |
| `order` | `ASC` | Sort direction: `ASC` or `DESC` |
| `limit` | `10` | Maximum number of records (1–100) |
| `offset` | `0` | Number of records to skip |
| `min_price` | none | Minimum price, inclusive |
| `max_price` | none | Maximum price, inclusive |

Example:

```text
http://localhost:3000/books?search_q=Harry&order_by=price&order=ASC&limit=5&offset=0&min_price=100&max_price=500
```

## Request body for POST and PUT

Send JSON with all three fields. `price` must be a JSON number, not a quoted string.

```json
{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "price": 450
}
```

## Status codes
- `200`: successful GET, update or delete
- `201`: successful creation
- `400`: invalid input or query parameter
- `404`: book or route not found
- `500`: unexpected database/server error

## Postman test list

Use `http://localhost:3000` as the base URL.

| Test | Method and URL | Body / expected result |
|---|---|---|
| List books | GET `/books` | 200 |
| Search title | GET `/books?search_q=Harry` | 200 |
| Sort | GET `/books?order_by=price&order=DESC` | 200 |
| Pagination | GET `/books?limit=5&offset=0` | 200 |
| Price range | GET `/books?min_price=100&max_price=500` | 200 |
| Combined filters | GET `/books?search_q=Harry&order_by=price&order=ASC&limit=5&offset=0&min_price=100&max_price=500` | 200 |
| Create book | POST `/books` | Valid JSON; 201 |
| Missing title | POST `/books` | Omit title; 400 |
| Missing author | POST `/books` | Omit author; 400 |
| Non-numeric price | POST `/books` | `"price": "450"`; 400 |
| Get existing ID | GET `/books/1` | 200 if ID 1 exists |
| Get missing ID | GET `/books/99999` | 404 if absent |
| Invalid sort column | GET `/books?order_by=unknown` | 400 |
| Invalid sort direction | GET `/books?order=SIDEWAYS` | 400 |
| Invalid price range | GET `/books?min_price=500&max_price=100` | 400 |
| Update existing ID | PUT `/books/1` | Valid JSON; 200 if ID exists |
| Update missing ID | PUT `/books/99999` | 404 if absent |
| Delete existing ID | DELETE `/books/1` | 200 if ID exists |
| Delete missing ID | DELETE `/books/99999` | 404 if absent |

For create/update, use Body → raw → JSON in Postman. For invalid-price testing, send `"price": "450"` with quotes to verify the API rejects a string.

## Debugging notes

1. `EADDRINUSE`: another process is already using the port. Stop the other server or select a free port using the `PORT` environment variable.
2. Wrong import path: verify that `server.js` uses `require("./database")` and that `database.js` is in the same directory.
3. `no such table`: verify that the SQL table name is `books` and that database initialization runs before requests are handled.
4. Missing `await`: when using Promise-based database methods, await the operation inside an `async` function. This project uses SQLite callbacks, so the callback handles completion and results.

## Screenshots

Save screenshots in the `screenshots/` directory and embed them below. Replace these example filenames with your actual screenshot filenames.

```markdown
![Create book success](screenshots/post-create-book.png)
![Get books](screenshots/get-books.png)
![Validation error](screenshots/post-validation-error.png)
![Not found response](screenshots/get-book-not-found.png)
```

## Notes: problems faced and solutions
Write the actual issues you encountered while completing the lab and how you resolved them.

## Submission checklist
- [ ] Replace student detail placeholders.
- [ ] Add actual live URL, or explain why deployment was not possible.
- [ ] Add screenshots for successful responses, error cases and database view.
- [ ] Ensure screenshots are displayed in this README.
- [ ] Do not commit `node_modules`, `.env` or `books.db`.
- [ ] Commit regularly with meaningful messages.
- [ ] Push the course repository and share it with faculty.
