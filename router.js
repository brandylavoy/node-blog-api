
var _templateObject = _taggedTemplateLiteral(['(', ') must match'], ['(', ') must match']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }



var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var _require = require('./model'),
    BlogPosts = _require.BlogPosts;

// we're going to add some items to BlogPosts
// so there's some data to look at
BlogPosts.create('The best blog post', 'Here is where the best blog post should go', 'Patrick hubbard');
BlogPosts.create('tomatoes', 'this is a blog post all about tomatoes', 'Tomatoe Farmer');
BlogPosts.create('peppers', 'this is a blog post about them spicy peppers!', 'hot chillie lover');



// when the root of this router is called with GET, return
// all current BlogPosts items
router.get('/', function (req, res) {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, function (req, res) {
  // ensure `title`, `content` and `author` are in request body
    var requiredFields = ['title', 'content', 'author'];
  for (var i = 0; i < requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!(field in req.body)) {
      var message = 'Missing `' + field + '` in request body';
      console.error(message);
      return res.status(400).send(message);
    }
  }

  var item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.update` with updated item.
router.put('/:id', jsonParser, function (req, res) {
  var requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
  for (var i = 0; i < requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!(field in req.body)) {
      var message = 'Missing `' + field + '` in request body';
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    var _message = ('Request path id (' + req.params.id + ') and request body id ')(_templateObject, req.body.id);
    console.error(_message);
    return res.status(400).send(_message);
  }
  console.log('Updating blog post `' + req.params.id + '`');
  var updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).json(updatedItem);
});

// when DELETE request comes in with an id in path,
// try to delete that item from BlogPosts.
router.delete('/:id', function (req, res) {
  BlogPosts.delete(req.params.id);
  console.log('Deleted blog post `' + req.params.ID + '`');
  res.status(204).end();
});

module.exports = router;