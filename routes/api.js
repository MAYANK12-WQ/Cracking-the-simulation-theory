const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

// Routes for simulation data
router.get('/dimensions', simulationController.getDimensions);
router.post('/simulate', simulationController.simulate);
router.get('/patterns', simulationController.getPatterns);
router.get('/artifacts', simulationController.getArtifacts);

module.exports = router;