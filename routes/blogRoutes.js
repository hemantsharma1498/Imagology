const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
      //Adding temporary route specific redis cacheing layer
      const redis=require('redis');
      const {promisify}=require('util').promisify;

      //Instantiate redis client instance
      const client=redis.createClient({
        host:'127.0.0.1',
        port:6379
      });


      //Promisify client.get's callback requirement
      client.get=promisify(client.get);

      //Assign return value to variable
      let cachedResult=await client.get(req.user.id);









    const blogs = await Blog.find({ _user: req.user.id });

    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
