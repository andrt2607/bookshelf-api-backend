const {
  getAllBook, postNewBook, getBookById, updateBook, deleteBook,
} = require('../handler');

const route = [
  {
    method: 'GET',
    path: '/books',
    handler: getAllBook,
  },
  {
    method: 'POST',
    path: '/books',
    handler: postNewBook,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBook,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBook,
  },
];

module.exports = route;
