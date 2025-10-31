// tests/simulation.test.js
const SimulationModel = require('../models/SimulationModel');

// Basic tests for the simulation model
describe('Simulation Model', () => {
  test('should create a simulation with correct dimensions', async () => {
    const simulation = new SimulationModel(4, { sampleSize: 100 });
    const results = await simulation.run();
    
    expect(results.inputDimensions).toBe(4);
    expect(results.projectedData).toHaveLength(100);
    expect(results.simulationProbability).toBeGreaterThanOrEqual(0);
    expect(results.simulationProbability).toBeLessThanOrEqual(1);
  });
  
  test('should detect artifacts in simulation', async () => {
    const simulation = new SimulationModel(5, { sampleSize: 50 });
    const results = await simulation.run();
    
    expect(Array.isArray(results.artifacts)).toBe(true);
  });
  
  test('should handle different dimension values', async () => {
    const simulation = new SimulationModel(10, { hiddenUnits: 64, sampleSize: 10 });
    const results = await simulation.run();
    
    expect(results.inputDimensions).toBe(10);
    expect(results.parameters.hiddenUnits).toBe(64);
  });
});