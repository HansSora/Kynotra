/* ============================================
   Glossary Routes
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/glossary.controller');

router.get('/', ctrl.list); // Public

module.exports = router;
