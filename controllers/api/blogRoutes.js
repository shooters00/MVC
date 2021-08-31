const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      attributes: [
        'id',
        'title',
        'description',
        'user_id',
        'created_at'
      ],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'description',
            'created_at',
            'blog_id',
            'user_id'
          ]
        }
      ]
    });

    res.status(200).json(blogData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'description',
            'created_at',
            'blog_id',
            'user_id'
          ]
        }
      ]
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
