const express = require("express");
const db = require("./database");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Consistent JSON response for invalid JSON request bodies.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON body." });
  }
  next(error);
});

function validBookBody(body) {
  return body &&
    typeof body.title === "string" && body.title.trim().length > 0 &&
    typeof body.author === "string" && body.author.trim().length > 0 &&
    typeof body.price === "number" && Number.isFinite(body.price) &&
    body.price >= 0;
}

// GET /books - search, sort, paginate and filter by price.
app.get("/books", (req, res) => {
  const {
    search_q = "",
    order_by = "id",
    order = "ASC",
    limit = "10",
    offset = "0",
    min_price,
    max_price
  } = req.query;

  const allowedColumns = ["id", "title", "author", "price"];
  const sortOrder = String(order).toUpperCase();
  const pageLimit = Number(limit);
  const pageOffset = Number(offset);

  if (!allowedColumns.includes(order_by)) {
    return res.status(400).json({ message: "Invalid order_by. Use id, title, author or price." });
  }
  if (!["ASC", "DESC"].includes(sortOrder)) {
    return res.status(400).json({ message: "Invalid order. Use ASC or DESC." });
  }
  if (!Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 100) {
    return res.status(400).json({ message: "limit must be an integer between 1 and 100." });
  }
  if (!Number.isInteger(pageOffset) || pageOffset < 0) {
    return res.status(400).json({ message: "offset must be a non-negative integer." });
  }
  if (typeof search_q !== "string") {
    return res.status(400).json({ message: "search_q must be a string." });
  }

  let sql = "SELECT * FROM books WHERE title LIKE ?";
  const params = [`%${search_q}%`];

  if (min_price !== undefined) {
    const min = Number(min_price);
    if (min_price === "" || !Number.isFinite(min) || min < 0) {
      return res.status(400).json({ message: "min_price must be a non-negative number." });
    }
    sql += " AND price >= ?";
    params.push(min);
  }

  if (max_price !== undefined) {
    const max = Number(max_price);
    if (max_price === "" || !Number.isFinite(max) || max < 0) {
      return res.status(400).json({ message: "max_price must be a non-negative number." });
    }
    sql += " AND price <= ?";
    params.push(max);
  }

  if (min_price !== undefined && max_price !== undefined &&
      Number(min_price) > Number(max_price)) {
    return res.status(400).json({ message: "min_price cannot be greater than max_price." });
  }

  // Identifiers cannot be bound as SQL parameters, so order_by and order
  // are restricted to allow-listed values before being added to the query.
  sql += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(pageLimit, pageOffset);

  db.all(sql, params, (error, rows) => {
    if (error) {
      console.error("GET /books database error:", error.message);
      return res.status(500).json({ message: "Could not retrieve books." });
    }
    return res.status(200).json(rows);
  });
});

// GET /books/:id - retrieve one book.
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Book id must be a positive integer." });
  }

  db.get("SELECT * FROM books WHERE id = ?", [id], (error, book) => {
    if (error) {
      console.error("GET /books/:id database error:", error.message);
      return res.status(500).json({ message: "Could not retrieve the book." });
    }
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
    return res.status(200).json(book);
  });
});

// POST /books - create a book.
app.post("/books", (req, res) => {
  if (!validBookBody(req.body)) {
    return res.status(400).json({
      message: "title and author are required strings; price must be a non-negative number."
    });
  }

  const { title, author, price } = req.body;
  db.run(
    "INSERT INTO books (title, author, price) VALUES (?, ?, ?)",
    [title.trim(), author.trim(), price],
    function (error) {
      if (error) {
        console.error("POST /books database error:", error.message);
        return res.status(500).json({ message: "Could not create the book." });
      }
      return res.status(201).json({
        message: "Book created successfully.",
        id: this.lastID
      });
    }
  );
});

// PUT /books/:id - update a book.
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Book id must be a positive integer." });
  }
  if (!validBookBody(req.body)) {
    return res.status(400).json({
      message: "title and author are required strings; price must be a non-negative number."
    });
  }

  const { title, author, price } = req.body;
  db.run(
    "UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?",
    [title.trim(), author.trim(), price, id],
    function (error) {
      if (error) {
        console.error("PUT /books/:id database error:", error.message);
        return res.status(500).json({ message: "Could not update the book." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Book not found." });
      }
      return res.status(200).json({ message: "Book updated successfully." });
    }
  );
});

// DELETE /books/:id - delete a book.
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Book id must be a positive integer." });
  }

  db.run("DELETE FROM books WHERE id = ?", [id], function (error) {
    if (error) {
      console.error("DELETE /books/:id database error:", error.message);
      return res.status(500).json({ message: "Could not delete the book." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Book not found." });
    }
    return res.status(200).json({ message: "Book deleted successfully." });
  });
});

// Fallback for unknown routes.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
