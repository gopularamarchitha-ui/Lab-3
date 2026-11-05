# Backend Development Fundamentals – Lab 3

## Student Details

- **Name:** Gopularam Architha
- **Registration Number:** 252U1R6084
- **Section:** AIML-2B

## 1. Project Title

**Book Management REST API using Node.js, Express.js and SQLite**

## 2. Project Description

This project implements a RESTful API for managing book records using Node.js, Express.js and SQLite.

The API supports CRUD operations, searching, sorting, pagination and price-range filtering. It also includes input validation and consistent JSON error handling.

## 3. Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript
- Postman
- Visual Studio Code
- Git and GitHub
- Render (Deployment)

## 4. Installation and Setup

Clone the project repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project folder:

```bash
cd lab-03
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The local API runs at:

```text
http://localhost:3000
```

## 5. Deployment

The REST API is deployed using Render.

**Live API URL:**

[https://lab-3-lsz3.onrender.com](https://lab-3-lsz3.onrender.com)

**Get all books:**

[https://lab-3-lsz3.onrender.com/books](https://lab-3-lsz3.onrender.com/books)

**Build Command:**

```bash
npm install
```

**Start Command:**

```bash
npm start
```

## 6. API Endpoints

| HTTP Method | Endpoint     | Description           |
| ----------- | ------------ | --------------------- |
| GET         | `/books`     | Retrieve all books    |
| GET         | `/books/:id` | Retrieve a book by ID |
| POST        | `/books`     | Add a new book        |
| PUT         | `/books/:id` | Update a book         |
| DELETE      | `/books/:id` | Delete a book         |

## 7. Searching

The API supports partial title searching using the SQL `LIKE` operator.

Example:

```http
GET /books?search_q=The
```

This returns books whose titles contain the search term.

## 8. Sorting

Books can be sorted using `order_by` and `order`.

Example:

```http
GET /books?order_by=title&order=ASC
```

- ASC: Ascending order
- DESC: Descending order

## 9. Pagination

Pagination is implemented using `limit` and `offset`.

Example:

```http
GET /books?limit=5&offset=0
```

This retrieves five books starting from the first record.

## 10. Price-Range Filtering

The API supports filtering books by minimum and maximum prices.

Example:

```http
GET /books?min_price=100&max_price=500
```

The SQL `BETWEEN` condition is used to retrieve books within the specified price range.

## 11. Database

SQLite is used to store book records in `books.db`.

The database contains the following fields:

- ID
- Title
- Author
- Price

The local database contains 20 book records. Book records added to the deployed Render database are stored separately from the local database.

## 12. Input Validation and Error Handling

- Missing title or author returns HTTP 400.
- Invalid price returns HTTP 400.
- Successfully created books return HTTP 201.
- Successful update and delete operations return HTTP 200.
- A book that does not exist returns HTTP 404.
- Error responses use a consistent JSON message format.

Example:

```json
{
  "message": "Book not found."
}
```

## 13. Debugging Tasks

The following debugging scenarios were demonstrated:

1. **Port Conflict (EADDRINUSE):** Identified an occupied port and resolved it by stopping the existing server process.
2. **Wrong Import Path:** Identified and corrected an incorrect database module path.
3. **Wrong Table Name:** Corrected the table name from `book` to `books`.
4. **Missing Await:** Demonstrated how adding `await` retrieves resolved Promise data instead of displaying a Promise object.

## 14. API Testing

The API was tested using Postman.

The following operations were tested:

- GET all books
- GET book by ID
- POST a new book
- PUT update a book
- DELETE a book
- Searching by title
- Sorting books
- Pagination
- Price-range filtering
- Input validation
- Error handling

## 15. Screenshots

Screenshots of API testing, debugging demonstrations and deployment are included in the `screenshots` folder.

## 16. Deployment and Database Note

The application is deployed on Render and can be accessed through the live API URL.

The local SQLite database and deployed SQLite database are separate. Records stored locally are not automatically transferred to Render.

## 17. Conclusion

This lab helped me understand backend development and RESTful API creation using Node.js, Express.js and SQLite.

I learned how to implement CRUD operations, connect an SQLite database, perform searching, sorting, pagination and price filtering, validate input, handle errors and debug common backend issues.

I also learned how to use GitHub for version control and Render for deploying a backend application.

**End of Lab 3 Submission.**

