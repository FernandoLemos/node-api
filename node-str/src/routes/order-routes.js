const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller');
const authService = require('../services/aut-services');


router.get('/', authService.authorize, controller.get);
router.post('/', authService.authorize, controller.post);

module.exports = router;