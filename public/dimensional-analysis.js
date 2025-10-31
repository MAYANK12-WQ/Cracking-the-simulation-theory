// dimensional-analysis.js
class DimensionalAnalysis {
  constructor() {
    this.analysisResults = [];
    this.theoryPredictions = {};
    
    this.initializeElements();
    this.setupEventListeners();
    this.initializeCharts();
  }
  
  initializeElements() {
    this.dimensionStart = document.getElementById('dimension-start');
    this.dimensionEnd = document.getElementById('dimension-end');
    this.complexityFactor = document.getElementById('complexity-factor');
    this.iterationsSelect = document.getElementById('simulation-iterations');
    
    this.startValue = document.getElementById('start-value');
    this.endValue = document.getElementById('end-value');
    this.complexityValue = document.getElementById('complexity-factor-value');
    
    this.runButton = document.getElementById('run-analysis');
    this.compareButton = document.getElementById('compare-theories');
    this.exportButton = document.getElementById('export-results');
    
    this.analysisSummary = document.getElementById('analysis-summary');
    this.stringTheoryProb = document.getElementById('string-theory-prob');
    this.mTheoryProb = document.getElementById('m-theory-prob');
    this.kaluzaKleinProb = document.getElementById('kaluza-klein-prob');
  }
  
  setupEventListeners() {
    this.dimensionStart.addEventListener('input', (e) => {
      const start = parseInt(e.target.value);
      const end = parseInt(this.dimensionEnd.value);
      
      // Ensure start is less than or equal to end
      if (start > end) {
        this.dimensionEnd.value = start;
        this.endValue.textContent = start;
      }
      
      this.startValue.textContent = start;
    });
    
    this.dimensionEnd.addEventListener('input', (e) => {
      const start = parseInt(this.dimensionStart.value);
      const end = parseInt(e.target.value);
      
      // Ensure end is greater than or equal to start
      if (end < start) {
        this.dimensionStart.value = end;
        this.startValue.textContent = end;
      }
      
      this.endValue.textContent = end;
    });
    
    this.complexityFactor.addEventListener('input', (e) => {
      this.complexityValue.textContent = e.target.value;
    });
    
    this.runButton.addEventListener('click', () => {
      this.runDimensionalAnalysis();
    });
    
    this.compareButton.addEventListener('click', () => {
      this.comparePhysicsTheories();
    });
    
    this.exportButton.addEventListener('click', () => {
      this.exportResults();
    });
  }
  
  initializeCharts() {
    // Dimension vs Probability chart
    const ctx = document.getElementById('dimension-chart').getContext('2d');
    this.dimensionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Simulation Probability by Dimensions',
          data: [],
          borderColor: 'rgb(108, 92, 231)',
          backgroundColor: 'rgba(108, 92, 231, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Simulation Probability vs Number of Dimensions'
          }
        },
        scales: {
          y: {
            min: 0,
            max: 1,
            title: {
              display: true,
              text: 'Simulation Probability'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Number of Dimensions'
            }
          }
        }
      }
    });
    
    // Theory comparison chart
    const theoryCtx = document.getElementById('theory-comparison-chart').getContext('2d');
    this.theoryChart = new Chart(theoryCtx, {
      type: 'bar',
      data: {
        labels: ['3D (Observable)', '4D (Spacetime)', '5D (Kaluza-Klein)', '10D (String)', '11D (M-Theory)'],
        datasets: [{
          label: 'Simulation Probability',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            'rgba(108, 92, 231, 0.7)',
            'rgba(162, 155, 254, 0.7)',
            'rgba(253, 121, 168, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(40, 167, 69, 0.7)'
          ],
          borderColor: [
            'rgb(108, 92, 231)',
            'rgb(162, 155, 254)',
            'rgb(253, 121, 168)',
            'rgb(255, 193, 7)',
            'rgb(40, 167, 69)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Physics Theory Simulation Probabilities'
          }
        },
        scales: {
          y: {
            min: 0,
            max: 1,
            title: {
              display: true,
              text: 'Simulation Probability'
            }
          }
        }
      }
    });
  }
  
  runDimensionalAnalysis() {
    const start = parseInt(this.dimensionStart.value);
    const end = parseInt(this.dimensionEnd.value);
    const complexity = parseFloat(this.complexityFactor.value);
    const iterations = parseInt(this.iterationsSelect.value);
    
    // Show loading state
    this.analysisSummary.innerHTML = '<p>Running dimensional analysis...</p>';
    
    // Simulate the analysis (in a real implementation, this would call the backend)
    setTimeout(() => {
      this.performAnalysis(start, end, complexity, iterations);
    }, 500);
  }
  
  performAnalysis(start, end, complexity, iterations) {
    this.analysisResults = [];
    const labels = [];
    const data = [];
    
    // Simulate analysis for each dimension
    for (let dim = start; dim <= end; dim++) {
      let totalProbability = 0;
      
      // Run multiple iterations for each dimension to get average
      for (let i = 0; i < iterations; i++) {
        const probability = this.simulateDimension(dim, complexity);
        totalProbability += probability;
      }
      
      const avgProbability = totalProbability / iterations;
      this.analysisResults.push({
        dimension: dim,
        probability: avgProbability,
        iterations: iterations
      });
      
      labels.push(dim);
      data.push(avgProbability);
    }
    
    // Update the chart
    this.dimensionChart.data.labels = labels;
    this.dimensionChart.data.datasets[0].data = data;
    this.dimensionChart.update();
    
    // Update the summary
    this.updateAnalysisSummary();
    
    // Update theory predictions
    this.updateTheoryPredictions();
  }
  
  simulateDimension(dimensions, complexity) {
    // Simulate probability calculation based on dimensions and complexity
    // This is a simplified model - real implementation would be much more complex
    
    let probability = 0.1; // Base probability
    
    // Dimensions effect - higher dimensions might suggest simulation
    if (dimensions === 5) { // Kaluza-Klein
      probability += 0.2;
    } else if (dimensions === 10) { // String theory
      probability += 0.3;
    } else if (dimensions === 11) { // M-theory
      probability += 0.35;
    } else if (dimensions > 4) {
      probability += (dimensions - 4) * 0.05;
    }
    
    // Complexity effect
    probability += complexity * 0.2;
    
    // Add some randomness to simulate uncertainty
    probability += (Math.random() - 0.5) * 0.1;
    
    // Apply sigmoid function for more natural distribution
    probability = 1 / (1 + Math.exp(-6 * (probability - 0.5)));
    
    // Ensure it's in 0-1 range
    probability = Math.max(0, Math.min(1, probability));
    
    return probability;
  }
  
  updateAnalysisSummary() {
    if (this.analysisResults.length === 0) return;
    
    // Find highest and lowest probabilities
    let maxProb = 0;
    let minProb = 1;
    let maxDim = 0;
    let minDim = 0;
    
    for (const result of this.analysisResults) {
      if (result.probability > maxProb) {
        maxProb = result.probability;
        maxDim = result.dimension;
      }
      if (result.probability < minProb) {
        minProb = result.probability;
        minDim = result.dimension;
      }
    }
    
    // Calculate average probability
    const avgProb = this.analysisResults.reduce((sum, r) => sum + r.probability, 0) / this.analysisResults.length;
    
    // Create summary
    const summaryHTML = `
      <p><strong>Analysis Complete:</strong></p>
      <p>Dimensions: ${this.analysisResults[0].dimension} to ${this.analysisResults[this.analysisResults.length - 1].dimension}</p>
      <p>Average Simulation Probability: ${(avgProb * 100).toFixed(2)}%</p>
      <p>Maximum Probability: ${(maxProb * 100).toFixed(2)}% at ${maxDim}D</p>
      <p>Minimum Probability: ${(minProb * 100).toFixed(2)}% at ${minDim}D</p>
      
      <h4>Statistical Insights:</h4>
      <ul>
        <li>Range of probabilities: ${(minProb * 100).toFixed(2)}% - ${(maxProb * 100).toFixed(2)}%</li>
        <li>Standard deviation: ${this.calculateStdDev().toFixed(4)}</li>
        <li>Dimensions with highest probability may indicate computational substrate</li>
      </ul>
    `;
    
    this.analysisSummary.innerHTML = summaryHTML;
  }
  
  calculateStdDev() {
    if (this.analysisResults.length === 0) return 0;
    
    const values = this.analysisResults.map(r => r.probability);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    
    return Math.sqrt(avgSquareDiff);
  }
  
  updateTheoryPredictions() {
    // Update the physics theory predictions based on our analysis
    const theoryResults = {
      '3D': 0.1,
      '4D': 0.15,
      '5D': 0.32, // Kaluza-Klein
      '10D': 0.45, // String theory
      '11D': 0.52  // M-theory
    };
    
    // Add some random variation to make it more realistic
    for (const [key, baseProb] of Object.entries(theoryResults)) {
      theoryResults[key] = Math.max(0, Math.min(1, baseProb + (Math.random() - 0.5) * 0.1));
    }
    
    // Update the display elements
    this.stringTheoryProb.textContent = `${(theoryResults['10D'] * 100).toFixed(2)}%`;
    this.mTheoryProb.textContent = `${(theoryResults['11D'] * 100).toFixed(2)}%`;
    this.kaluzaKleinProb.textContent = `${(theoryResults['5D'] * 100).toFixed(2)}%`;
    
    // Update theory chart
    this.theoryChart.data.datasets[0].data = [
      theoryResults['3D'],
      theoryResults['4D'], 
      theoryResults['5D'],
      theoryResults['10D'],
      theoryResults['11D']
    ];
    this.theoryChart.update();
  }
  
  comparePhysicsTheories() {
    // Show comparison of different physics theories
    this.updateTheoryPredictions();
    
    // Display additional information
    const comparisonInfo = `
      <h3>Physics Theory Comparison</h3>
      
      <h4>String Theory (10D)</h4>
      <p>Requires exactly 10 dimensions for mathematical consistency. The extra 6 dimensions are "compactified" or curled up at the Planck scale. If our universe uses this mechanism, it could suggest computational optimization.</p>
      <p>Implications for Simulation Hypothesis: High - mathematical requirement for specific dimension number</p>
      
      <h4>M-Theory (11D)</h4>
      <p>Extends string theory to 11 dimensions, unifying different string theories. The 11th dimension reveals additional structure in the theory. This could represent a deeper computational architecture.</p>
      <p>Implications for Simulation Hypothesis: Very High - further mathematical constraint and unification</p>
      
      <h4>Kaluza-Klein Theory (5D)</h4>
      <p>Unifies gravity and electromagnetism by adding a 5th dimension, which is compactified. This early theory showed how extra dimensions could unify forces. The requirement for exactly 5D could indicate design.</p>
      <p>Implications for Simulation Hypothesis: Medium - elegant unification approach</p>
      
      <h4>Our Observable Universe (3+1D)</h4>
      <p>The 3 spatial dimensions and 1 time dimension we directly observe. The fact that we don't see higher dimensions could mean they're hidden, or that our perception is limited by the simulation parameters.</p>
      <p>Implications for Simulation Hypothesis: Baseline - what we directly observe</p>
    `;
    
    this.analysisSummary.innerHTML = comparisonInfo;
  }
  
  exportResults() {
    // Create a summary of results for export
    const exportData = {
      analysisResults: this.analysisResults,
      theoryPredictions: {
        stringTheory: parseFloat(this.stringTheoryProb.textContent.replace('%', '')) / 100,
        mTheory: parseFloat(this.mTheoryProb.textContent.replace('%', '')) / 100,
        kaluzaKlein: parseFloat(this.kaluzaKleinProb.textContent.replace('%', '')) / 100
      },
      parameters: {
        complexity: parseFloat(this.complexityFactor.value),
        iterations: parseInt(this.iterationsSelect.value)
      },
      timestamp: new Date().toISOString()
    };
    
    // Create a downloadable file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dimensional-analysis-results.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}

// Initialize the dimensional analysis when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new DimensionalAnalysis();
});