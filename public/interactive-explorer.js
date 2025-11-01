// public/interactive-explorer.js
class SimulationExplorer {
  constructor() {
    this.parameters = {
      dimensions: 4,
      complexity: 0.6,
      quantization: 0.4,
      symmetry: 0.5,
      simulationProbability: 0.42
    };
    
    this.initializeElements();
    this.setupEventListeners();
    this.updateAllVisualizations();
  }
  
  initializeElements() {
    // Parameter sliders
    this.dimensionSlider = document.getElementById('dimension-slider');
    this.complexitySlider = document.getElementById('complexity-slider');
    this.quantizationSlider = document.getElementById('quantization-slider');
    this.symmetrySlider = document.getElementById('symmetry-slider');
    
    // Parameter value displays
    this.dimensionValue = document.getElementById('dimension-value');
    this.complexityValue = document.getElementById('complexity-value');
    this.quantizationValue = document.getElementById('quantization-value');
    this.symmetryValue = document.getElementById('symmetry-value');
    
    // Probability display
    this.probabilityDisplay = document.getElementById('probability-display');
    
    // Interactive visualization
    this.visualizationCanvas = document.getElementById('interactive-visualization');
    this.ctx = this.visualizationCanvas.getContext('2d');
    
    // Results table
    this.resultsTable = document.getElementById('results-table');
  }
  
  setupEventListeners() {
    // Slider events
    this.dimensionSlider.addEventListener('input', (e) => {
      this.parameters.dimensions = parseInt(e.target.value);
      this.dimensionValue.textContent = e.target.value;
      this.updateAllVisualizations();
    });
    
    this.complexitySlider.addEventListener('input', (e) => {
      this.parameters.complexity = parseFloat(e.target.value);
      this.complexityValue.textContent = e.target.value;
      this.updateAllVisualizations();
    });
    
    this.quantizationSlider.addEventListener('input', (e) => {
      this.parameters.quantization = parseFloat(e.target.value);
      this.quantizationValue.textContent = e.target.value;
      this.updateAllVisualizations();
    });
    
    this.symmetrySlider.addEventListener('input', (e) => {
      this.parameters.symmetry = parseFloat(e.target.value);
      this.symmetryValue.textContent = e.target.value;
      this.updateAllVisualizations();
    });
  }
  
  updateAllVisualizations() {
    // Calculate new probability based on parameters
    this.calculateProbability();
    
    // Update probability display
    this.updateProbabilityDisplay();
    
    // Update the interactive visualization canvas
    this.updateVisualization();
    
    // Update results table
    this.updateResultsTable();
  }
  
  calculateProbability() {
    // Complex formula for simulation probability
    let probability = 0.1; // Base
    
    // Dimensions effect
    probability += (this.parameters.dimensions - 3) * 0.08;
    
    // Complexity effect
    probability += this.parameters.complexity * 0.2;
    
    // Quantization effect
    probability += this.parameters.quantization * 0.3;
    
    // Symmetry effect
    probability += this.parameters.symmetry * 0.15;
    
    // Apply sigmoid function to keep it in 0-1 range
    probability = 1 / (1 + Math.exp(-5 * (probability - 0.5)));
    
    this.parameters.simulationProbability = Math.min(1, Math.max(0, probability));
  }
  
  updateProbabilityDisplay() {
    const prob = this.parameters.simulationProbability;
    this.probabilityDisplay.textContent = `${(prob * 100).toFixed(1)}%`;
    
    // Update probability bar width
    const probBar = document.getElementById('probability-bar');
    if (probBar) {
      probBar.style.width = `${prob * 100}%`;
    }
    
    // Update probability color based on value
    if (prob > 0.7) {
      this.probabilityDisplay.style.color = '#ff0088';
      this.probabilityDisplay.style.textShadow = '0 0 10px #ff0088';
    } else if (prob > 0.4) {
      this.probabilityDisplay.style.color = '#00ff88';
      this.probabilityDisplay.style.textShadow = '0 0 10px #00ff88';
    } else {
      this.probabilityDisplay.style.color = '#0088ff';
      this.probabilityDisplay.style.textShadow = '0 0 10px #0088ff';
    }
  }
  
  updateVisualization() {
    const canvas = this.visualizationCanvas;
    const ctx = this.ctx;
    
    // Set canvas size to match display
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid with cyberpunk aesthetic
    this.drawGrid(ctx, canvas.width, canvas.height);
    
    // Draw interactive elements based on parameters
    this.drawDimensionalSpheres(ctx, canvas.width, canvas.height);
    this.drawProbabilityField(ctx, canvas.width, canvas.height);
    this.drawQuantumPaths(ctx, canvas.width, canvas.height);
  }
  
  drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
  
  drawDimensionalSpheres(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw multiple spheres representing different dimensions
    for (let i = 0; i < this.parameters.dimensions; i++) {
      const radius = 30 + i * 10;
      const angle = (i / this.parameters.dimensions) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * (50 + i * 20);
      const y = centerY + Math.sin(angle) * (50 + i * 20);
      
      // Create gradient for sphere
      const gradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
      gradient.addColorStop(0, '#ffffff');
      
      if (i === this.parameters.dimensions - 1) {
        gradient.addColorStop(1, '#ff00ff'); // Highlight the highest dimension
      } else {
        gradient.addColorStop(1, '#00ffff');
      }
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw dimension number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(i+3, x, y + 5);
    }
  }
  
  drawProbabilityField(ctx, width, height) {
    // Visualize probability as a field around the center
    const centerX = width / 2;
    const centerY = height / 2;
    
    const fieldRadius = this.parameters.simulationProbability * 200;
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, fieldRadius
    );
    
    gradient.addColorStop(0, `rgba(255, 0, ${Math.floor(this.parameters.simulationProbability * 255)}, 0.3)`);
    gradient.addColorStop(1, `rgba(0, ${Math.floor(this.parameters.simulationProbability * 255)}, 255, 0.1)`);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, fieldRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  drawQuantumPaths(ctx, width, height) {
    // Draw quantum paths based on parameters
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      
      let x = centerX;
      let y = centerY;
      
      // Draw a quantum path with randomness based on parameters
      for (let j = 0; j < 20; j++) {
        x += (Math.random() - 0.5) * 20 * this.parameters.complexity;
        y += (Math.random() - 0.5) * 20 * this.parameters.complexity;
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Set color based on probability
      const hue = this.parameters.simulationProbability * 360;
      ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.6)`;
      ctx.stroke();
    }
  }
  
  updateResultsTable() {
    // Update results table with current parameters and probability
    const results = [
      { parameter: 'Dimensions', value: this.parameters.dimensions, description: 'Number of spatial dimensions' },
      { parameter: 'Complexity', value: this.parameters.complexity.toFixed(2), description: 'System complexity factor' },
      { parameter: 'Quantization', value: this.parameters.quantization.toFixed(2), description: 'Quantum discretization level' },
      { parameter: 'Symmetry', value: this.parameters.symmetry.toFixed(2), description: 'Perfect symmetry detection' },
      { parameter: 'Simulation Probability', value: `${(this.parameters.simulationProbability * 100).toFixed(1)}%`, description: 'Calculated simulation likelihood' }
    ];
    
    let tableHTML = '<thead><tr><th>Parameter</th><th>Value</th><th>Description</th></tr></thead><tbody>';
    
    results.forEach(item => {
      tableHTML += `<tr><td>${item.parameter}</td><td>${item.value}</td><td>${item.description}</td></tr>`;
    });
    
    tableHTML += '</tbody>';
    this.resultsTable.innerHTML = tableHTML;
  }
}

// Initialize the interactive explorer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new SimulationExplorer();
});