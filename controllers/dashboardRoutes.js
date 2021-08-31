const router = require('express').Router();
const { endsWith } = require('sequelize/types/lib/operators');
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const blogData = await Blog.findAll({
      where: {
        userID: req.session.userId,
      },
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('mydashboard', { 
      layout: 'dashboard',
      blogs
    });
  } catch (err) {
    res.redirect('login');
  }
});

router.get('/editpost/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id);
      if (postData) {
        const blog = blogData.get({ plain: true });
        res.render('editpost', {
          layout: 'dashboard',
          blog,
        });
      } else {
        res.status(404).end();
      }
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/newblog', withAuth, async (req, res) => {
  res.render('newblog', {
    layout: 'dashboard'
  });
});

module.exports = router;
