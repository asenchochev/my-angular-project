const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const perfumeController = require('./controllers/perfumeController');

router.use(homeController);
router.use('/user', userController)
router.use('/perfumes', perfumeController);

module.exports = router;