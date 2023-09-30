// const { nanoid } = require('nanoid');
// const { nanoid } = require('nanoid');
const { v4 } = require('uuid');
const books = require('../services/books');

const getAllBook = async (req, h) => {
  let currentBooks = books;
  if (req.query.name) {
    // console.log(req.query.name)
    currentBooks = currentBooks.filter((book) => book.name.toLowerCase()
      .includes(req.query.name.toLowerCase()));
    // currentBooks.includes(req.query.name);
  }
  if (req.query.reading) {
    // console.log(req.query.reading);
    currentBooks = req.query.reading === '1' ? currentBooks.filter((book) => book.reading === true)
      : currentBooks.filter((book) => book.reading === false);
  }
  if (req.query.finished) {
    // console.log(req.query.finished);
    currentBooks = req.query.finished === '1' ? currentBooks.filter((book) => book.finished === true)
      : currentBooks.filter((book) => book.finished === false);
  }
  const response = h.response({
    status: 'success',
    data: {
      books: currentBooks,
    },
  });
  response.code(200);
  return response;
};

const getBookById = async (req, h) => {
  const { id } = req.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined || !book) {
    const response = h.response({
      status: 'success',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const postNewBook = async (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = v4();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  // cek id
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const updateBook = async (req, h) => {
  const { id } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const updatedAt = new Date().toISOString();

  // cari buku
  const indexBook = books.findIndex((book) => book.id === id);

  if (indexBook !== -1) {
    books[indexBook] = {
      ...books[indexBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBook = async (req, h) => {
  const { id } = req.params;

  const indexBook = books.findIndex((note) => note.id === id);

  if (indexBook !== -1) {
    books.splice(indexBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  getAllBook, postNewBook, getBookById, updateBook, deleteBook,
};
