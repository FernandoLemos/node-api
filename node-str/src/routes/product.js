const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller');
const authService = require('../services/aut-services');

router.get('/', controller.get);
router.get('/:slug', controller.getBySlug);
router.get('/admin/:id', controller.getById);
router.get('/tags/:tags', controller.getByTags);
router.post('/', authService.isAdmin,controller.post);
router.put('/:id',authService.isAdmin, controller.put);
router.delete('/',authService.isAdmin, controller.delete);

module.exports = router;