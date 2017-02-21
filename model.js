var uuid = require('uuid');

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


function StorageException(message) {
  this.message = message;
  this.name = "StorageException";
}

var BlogPosts = {
  create: function create(title, content, author, publishDate) {
    var post = {
      id: uuid.v4(),
      title: title,
      content: content,
      author: author,
      publishDate: publishDate || Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function get() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    // if id passed in, retrieve single post,
    // otherwise send all posts.
    if (id !== null) {
      return this.posts.find(function (post) {
        return post.id === id;
      });
    }
    // return posts sorted (descending) by
    // publish date
    return this.posts.sort(function (a, b) {
      return b.publishDate - a.publishDate;
    });
  },
  delete: function _delete(id) {
    var postIndex = this.posts.findIndex(function (post) {
      return post.id === id;
    });
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    }
  },
  update: function update(updatedPost) {
    var id = updatedPost.id;

    var postIndex = this.posts.findIndex(function (post) {
      return post.id === updatedPost.id;
    });
    if (postIndex === -1) {
      throw StorageException("Can't update item `" + id + "` because doesn't exist.");
    }
    this.posts[postIndex] = Object.assign(this.posts[postIndex], updatedPost);
    return this.posts[postIndex];
  }
};

function createBlogPostsModel() {
  var storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}

module.exports = { BlogPosts: createBlogPostsModel() };