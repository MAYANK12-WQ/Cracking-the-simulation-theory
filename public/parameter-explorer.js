// parameter-explorer.js
class ParameterExplorer {
  constructor() {
    this.parameters = {
      dimensions: 4,
      complexity: 0.5,
      quantization: 0.3,
      symmetry: 0.4
    };
    
    this.probabilityHistory = [];
    this.isAutoExploring = false;
    this.autoExploreInterval = null;
    
    this.initializeElements();
    this.setupEventListeners();
    this.initialize3D();
    this.initializeCharts();
    this.updateDisplay();
  }
  
  initializeElements() {
    this.dimensionRange = document.getElementById('dimension-range');
    this.complexityRange = document.getElementById('complexity-range');
    this.quantizationRange = document.getElementById('quantization-range');
    this.symmetryRange = document.getElementById('symmetry-range');
    
    this.dimensionValue = document.getElementById('dimension-value');
    this.complexityValue = document.getElementById('complexity-value');
    this.quantizationValue = document.getElementById('quantization-value');
    this.symmetryValue = document.getElementById('symmetry-value');
    
    this.projectionMethod = document.getElementById('projection-method');
    this.visualizationMode = document.getElementById('visualization-mode');
    
    this.runButton = document.getElementById('run-simulation');
    this.autoExploreButton = document.getElementById('auto-explore');
    this.resetButton = document.getElementById('reset-parameters');
    
    this.currentProbability = document.getElementById('current-probability');
    this.detectedArtifacts = document.getElementById('detected-artifacts');
  }
  
  setupEventListeners() {
    // Range sliders
    this.dimensionRange.addEventListener('input', (e) => {
      this.parameters.dimensions = parseInt(e.target.value);
      this.dimensionValue.textContent = e.target.value;
      this.updateDisplay();
    });
    
    this.complexityRange.addEventListener('input', (e) => {
      this.parameters.complexity = parseFloat(e.target.value);
      this.complexityValue.textContent = e.target.value;
      this.updateDisplay();
    });
    
    this.quantizationRange.addEventListener('input', (e) => {
      this.parameters.quantization = parseFloat(e.target.value);
      this.quantizationValue.textContent = e.target.value;
      this.updateDisplay();
    });
    
    this.symmetryRange.addEventListener('input', (e) => {
      this.parameters.symmetry = parseFloat(e.target.value);
      this.symmetryValue.textContent = e.target.value;
      this.updateDisplay();
    });
    
    // Buttons
    this.runButton.addEventListener('click', () => {
      this.runSimulation();
    });
    
    this.autoExploreButton.addEventListener('click', () => {
      this.toggleAutoExplore();
    });
    
    this.resetButton.addEventListener('click', () => {
      this.resetParameters();
    });
  }
  
  initialize3D() {
    const container = document.getElementById('3d-parameter-container');
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f1a2d);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Start animation loop
    this.animate();
  }
  
  initializeCharts() {
    // Main parameter chart
    const ctx = document.getElementById('parameter-chart').getContext('2d');
    this.mainChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Dimensions', 'Complexity', 'Quantization', 'Symmetry', 'Projection'],
        datasets: [{
          label: 'Parameter Values',
          data: [
            this.parameters.dimensions / 11, // Normalize to 0-1
            this.parameters.complexity,
            this.parameters.quantization,
            this.parameters.symmetry,
            0.5 // Placeholder for projection
          ],
          backgroundColor: 'rgba(162, 155, 254, 0.2)',
          borderColor: 'rgba(162, 155, 254, 1)',
          pointBackgroundColor: 'rgba(253, 121, 168, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(253, 121, 168, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 1
          }
        }
      }
    });
    
    // Probability trend chart
    const trendCtx = document.getElementById('probability-trend-chart').getContext('2d');
    this.trendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Simulation Probability',
          data: [],
          borderColor: '#fd79a8',
          backgroundColor: 'rgba(253, 121, 168, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Probability Trend'
          }
        },
        scales: {
          y: {
            min: 0,
            max: 1,
            title: {
              display: true,
              text: 'Probability'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Simulation Run'
            }
          }
        }
      }
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Rotate the visualization slightly
    if (this.parameterObject) {
      this.parameterObject.rotation.x += 0.005;
      this.parameterObject.rotation.y += 0.005;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  updateDisplay() {
    // Update radar chart
    this.mainChart.data.datasets[0].data = [
      this.parameters.dimensions / 11, // Normalize dimensions to 0-1
      this.parameters.complexity,
      this.parameters.quantization,
      this.parameters.symmetry,
      this.projectionMethod.value === 'perspective' ? 0.7 : 
      this.projectionMethod.value === 'orthographic' ? 0.5 : 0.9 // Different values for different projections
    ];
    this.mainChart.update();
    
    // Update 3D visualization
    this.update3DVisualization();
  }
  
  update3DVisualization() {
    // Clear previous object if it exists
    if (this.parameterObject) {
      this.scene.remove(this.parameterObject);
    }
    
    const mode = this.visualizationMode.value;
    
    if (mode === 'points') {
      this.createPointVisualization();
    } else if (mode === 'mesh') {
      this.createMeshVisualization();
    } else if (mode === 'field') {
      this.createFieldVisualization();
    }
  }
  
  createPointVisualization() {
    const geometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    
    // Create points based on parameters
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4 * this.parameters.complexity;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4 * this.parameters.symmetry;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 * this.parameters.quantization;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xa29bfe,
      size: this.parameters.dimensions * 0.02,
      transparent: true,
      opacity: 0.8
    });
    
    this.parameterObject = new THREE.Points(geometry, material);
    this.scene.add(this.parameterObject);
  }
  
  createMeshVisualization() {
    // Create a dynamic mesh based on parameters
    const size = 2 * this.parameters.complexity;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    
    // Modify geometry based on other parameters
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      // Apply quantization effects
      if (this.parameters.quantization > 0.5) {
        positions[i] = Math.round(positions[i] / 0.2) * 0.2;
        positions[i+1] = Math.round(positions[i+1] / 0.2) * 0.2;
        positions[i+2] = Math.round(positions[i+2] / 0.2) * 0.2;
      }
      
      // Apply symmetry effects
      if (this.parameters.symmetry > 0.5) {
        positions[i] = positions[i] * (0.8 + this.parameters.symmetry * 0.4);
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    
    const material = new THREE.MeshPhongMaterial({
      color: 0xfd79a8,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    
    this.parameterObject = new THREE.Mesh(geometry, material);
    this.scene.add(this.parameterObject);
  }
  
  createFieldVisualization() {
    // Create field lines based on parameters
    const geometry = new THREE.BufferGeometry();
    const points = [];
    
    // Create field lines based on parameters
    for (let i = 0; i < 20; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      
      // Apply parameter-based transformations
      const direction = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      
      direction.multiplyScalar(2 * this.parameters.complexity);
      
      // Add multiple points along the field line
      for (let j = 0; j <= 10; j++) {
        const factor = j / 10;
        const point = start.clone().add(direction.clone().multiplyScalar(factor));
        
        // Apply quantization effects
        if (this.parameters.quantization > 0.3) {
          point.x = Math.round(point.x / 0.3) * 0.3;
          point.y = Math.round(point.y / 0.3) * 0.3;
          point.z = Math.round(point.z / 0.3) * 0.3;
        }
        
        points.push(point.x, point.y, point.z);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    
    const material = new THREE.LineBasicMaterial({
      color: 0x6c5ce7,
      transparent: true,
      opacity: 0.6
    });
    
    this.parameterObject = new THREE.Line(geometry, material);
    this.scene.add(this.parameterObject);
  }
  
  runSimulation() {
    // Calculate simulation probability based on parameters
    const probability = this.calculateSimulationProbability();
    
    // Update probability display
    this.currentProbability.textContent = `${(probability * 100).toFixed(2)}%`;
    
    // Add to history for trend chart
    this.probabilityHistory.push({value: probability, params: {...this.parameters}});
    
    // Update trend chart
    this.trendChart.data.labels.push(`Run ${this.probabilityHistory.length}`);
    this.trendChart.data.datasets[0].data.push(probability);
    
    // Keep only last 10 points
    if (this.trendChart.data.labels.length > 10) {
      this.trendChart.data.labels.shift();
      this.trendChart.data.datasets[0].data.shift();
    }
    
    this.trendChart.update();
    
    // Generate artifacts based on parameters
    const artifacts = this.generateArtifacts(probability);
    
    // Display artifacts
    this.displayArtifacts(artifacts);
    
    // Update impact bars
    this.updateImpactBars();
  }
  
  calculateSimulationProbability() {
    // Calculate probability based on parameters
    // This is a simplified model - in reality, this would be much more complex
    let probability = 0.1; // Base probability
    
    // Dimensions effect (higher dimensions may suggest simulation)
    probability += (this.parameters.dimensions - 3) * 0.05;
    
    // Complexity effect (very complex systems might be computational artifacts)
    probability += this.parameters.complexity * 0.1;
    
    // Quantization effect (discretization suggests computational substrate)
    probability += this.parameters.quantization * 0.3;
    
    // Symmetry effect (perfect symmetry suggests optimization)
    probability += this.parameters.symmetry * 0.2;
    
    // Apply projection method modifier
    if (this.projectionMethod.value === 'stereographic') {
      probability += 0.1; // This projection might reveal more artifacts
    } else if (this.projectionMethod.value === 'pca') {
      probability -= 0.05; // PCA might obscure some artifacts
    }
    
    // Apply sigmoid function for more natural probability distribution
    probability = 1 / (1 + Math.exp(-8 * (probability - 0.5)));
    
    // Cap at 0.99
    return Math.min(probability, 0.99);
  }
  
  generateArtifacts(probability) {
    const artifacts = [];
    
    // Generate artifacts based on the simulation parameters and probability
    if (this.parameters.quantization > 0.4) {
      artifacts.push({
        type: 'Quantization Artifacts',
        description: 'Discretization patterns in physical measurements',
        confidence: this.parameters.quantization * 0.9
      });
    }
    
    if (this.parameters.symmetry > 0.5) {
      artifacts.push({
        type: 'Perfect Symmetries', 
        description: 'Physical systems with mathematically perfect symmetries',
        confidence: this.parameters.symmetry * 0.8
      });
    }
    
    if (this.parameters.dimensions > 5) {
      artifacts.push({
        type: 'Higher Dimension Signatures',
        description: 'Evidence of physics in dimensions beyond 3D',
        confidence: (this.parameters.dimensions - 3) * 0.15
      });
    }
    
    // Add general computational efficiency artifacts
    if (probability > 0.4) {
      artifacts.push({
        type: 'Computational Efficiency',
        description: 'Physical laws optimized for computational efficiency',
        confidence: probability * 0.7
      });
    }
    
    return artifacts;
  }
  
  displayArtifacts(artifacts) {
    if (artifacts.length === 0) {
      this.detectedArtifacts.innerHTML = '<p>No significant artifacts detected</p>';
      return;
    }
    
    let html = '<ul>';
    for (const artifact of artifacts) {
      html += `
        <li class="artifact-item">
          <strong>${artifact.type}</strong>
          <p>${artifact.description}</p>
          <p>Confidence: ${(artifact.confidence * 100).toFixed(1)}%</p>
        </li>
      `;
    }
    html += '</ul>';
    
    this.detectedArtifacts.innerHTML = html;
  }
  
  updateImpactBars() {
    // Update impact bars based on parameter values
    document.getElementById('dimension-impact').style.width = `${this.parameters.dimensions * 9}%`;
    document.getElementById('complexity-impact').style.width = `${this.parameters.complexity * 100}%`;
    document.getElementById('quantization-impact').style.width = `${this.parameters.quantization * 100}%`;
    document.getElementById('symmetry-impact').style.width = `${this.parameters.symmetry * 100}%`;
    
    // Update displayed values
    document.querySelector('.impact-item:nth-child(1) .impact-value').textContent = `${(this.parameters.dimensions * 9).toFixed(0)}%`;
    document.querySelector('.impact-item:nth-child(2) .impact-value').textContent = `${(this.parameters.complexity * 100).toFixed(0)}%`;
    document.querySelector('.impact-item:nth-child(3) .impact-value').textContent = `${(this.parameters.quantization * 100).toFixed(0)}%`;
    document.querySelector('.impact-item:nth-child(4) .impact-value').textContent = `${(this.parameters.symmetry * 100).toFixed(0)}%`;
  }
  
  toggleAutoExplore() {
    this.isAutoExploring = !this.isAutoExploring;
    
    if (this.isAutoExploring) {
      this.autoExploreButton.textContent = 'Stop Auto-Explore';
      this.startAutoExplore();
    } else {
      this.autoExploreButton.textContent = 'Auto-Explore Parameter Space';
      if (this.autoExploreInterval) {
        clearInterval(this.autoExploreInterval);
        this.autoExploreInterval = null;
      }
    }
  }
  
  startAutoExplore() {
    if (!this.isAutoExploring) return;
    
    this.autoExploreInterval = setInterval(() => {
      // Slightly randomize parameters
      this.parameters.dimensions = Math.min(11, Math.max(3, Math.round(this.parameters.dimensions + (Math.random() - 0.5))));
      this.parameters.complexity = Math.min(1.0, Math.max(0.1, this.parameters.complexity + (Math.random() - 0.5) * 0.1));
      this.parameters.quantization = Math.min(1.0, Math.max(0.0, this.parameters.quantization + (Math.random() - 0.5) * 0.1));
      this.parameters.symmetry = Math.min(1.0, Math.max(0.0, this.parameters.symmetry + (Math.random() - 0.5) * 0.1));
      
      // Update UI
      this.dimensionRange.value = this.parameters.dimensions;
      this.complexityRange.value = this.parameters.complexity;
      this.quantizationRange.value = this.parameters.quantization;
      this.symmetryRange.value = this.parameters.symmetry;
      
      this.dimensionValue.textContent = this.parameters.dimensions;
      this.complexityValue.textContent = this.parameters.complexity.toFixed(1);
      this.quantizationValue.textContent = this.parameters.quantization.toFixed(2);
      this.symmetryValue.textContent = this.parameters.symmetry.toFixed(2);
      
      // Update display and run simulation
      this.updateDisplay();
      this.runSimulation();
      
    }, 1500); // Update every 1.5 seconds
  }
  
  resetParameters() {
    // Reset to default values
    this.parameters = {
      dimensions: 4,
      complexity: 0.5,
      quantization: 0.3,
      symmetry: 0.4
    };
    
    // Update UI
    this.dimensionRange.value = this.parameters.dimensions;
    this.complexityRange.value = this.parameters.complexity;
    this.quantizationRange.value = this.parameters.quantization;
    this.symmetryRange.value = this.parameters.symmetry;
    
    this.dimensionValue.textContent = this.parameters.dimensions;
    this.complexityValue.textContent = this.parameters.complexity.toFixed(1);
    this.quantizationValue.textContent = this.parameters.quantization.toFixed(2);
    this.symmetryValue.textContent = this.parameters.symmetry.toFixed(2);
    
    // Update display
    this.updateDisplay();
    
    // Clear probability history
    this.probabilityHistory = [];
    this.trendChart.data.labels = [];
    this.trendChart.data.datasets[0].data = [];
    this.trendChart.update();
    
    // Stop auto explore if running
    if (this.isAutoExploring) {
      this.toggleAutoExplore();
    }
  }
}

// Initialize the parameter explorer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ParameterExplorer();
});