// app.js
class SimulationApp {
  constructor() {
    this.socket = io();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.points = null;
    this.chart = null;
    this.currentData = null;
    
    this.initializeElements();
    this.setupEventListeners();
    this.initialize3D();
    this.initializeChart();
    this.loadInitialData();
  }
  
  initializeElements() {
    this.dimensionSelect = document.getElementById('dimension-select');
    this.simulationFactor = document.getElementById('simulation-factor');
    this.simulationFactorValue = document.getElementById('simulation-factor-value');
    this.projectionType = document.getElementById('projection-type');
    this.runButton = document.getElementById('run-simulation');
    this.resetButton = document.getElementById('reset');
    this.probabilityDisplay = document.getElementById('probability-display');
    this.probabilityBar = document.getElementById('probability-bar');
    this.artifactsDisplay = document.getElementById('artifacts-display');
    this.patternsDisplay = document.getElementById('patterns-display');
  }
  
  setupEventListeners() {
    // Update simulation factor value display
    this.simulationFactor.addEventListener('input', () => {
      this.simulationFactorValue.textContent = this.simulationFactor.value;
    });
    
    // Run simulation button
    this.runButton.addEventListener('click', () => {
      this.runSimulation();
    });
    
    // Reset button
    this.resetButton.addEventListener('click', () => {
      this.resetSimulation();
    });
    
    // Socket event listeners
    this.socket.on('simulation-results', (data) => {
      this.handleSimulationResults(data);
    });
  }
  
  initialize3D() {
    const container = document.getElementById('3d-container');
    
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
    
    // Add lighting
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
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.points) {
      // Rotate the points slightly for visual effect
      this.points.rotation.x += 0.005;
      this.points.rotation.y += 0.005;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  initializeChart() {
    const ctx = document.getElementById('simulation-chart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Simulation Probability Over Time',
          data: [],
          borderColor: '#a29bfe',
          backgroundColor: 'rgba(162, 155, 254, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Simulation Probability Trend'
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
              text: 'Time'
            }
          }
        }
      }
    });
  }
  
  loadInitialData() {
    // Load initial patterns and artifacts
    fetch('/api/patterns')
      .then(response => response.json())
      .then(data => {
        this.displayPatterns(data.patterns);
      })
      .catch(error => console.error('Error loading patterns:', error));
      
    fetch('/api/artifacts')
      .then(response => response.json())
      .then(data => {
        this.displayArtifacts(data.artifacts);
      })
      .catch(error => console.error('Error loading artifacts:', error));
  }
  
  runSimulation() {
    const params = {
      dimensions: parseInt(this.dimensionSelect.value),
      projection: this.projectionType.value,
      simulationFactor: parseFloat(this.simulationFactor.value),
      hiddenUnits: 128,
      sampleSize: 1000
    };
    
    // Show loading state
    this.probabilityDisplay.textContent = '...';
    this.artifactsDisplay.innerHTML = '<p>Analyzing simulation data...</p>';
    this.patternsDisplay.innerHTML = '<p>Detecting patterns...</p>';
    
    // Emit simulation parameters to server
    this.socket.emit('simulation-parameters', params);
  }
  
  handleSimulationResults(data) {
    this.currentData = data;
    
    // Update probability display
    const prob = (data.results.simulationProbability * 100).toFixed(2);
    this.probabilityDisplay.textContent = `${prob}%`;
    this.probabilityBar.style.width = `${data.results.simulationProbability * 100}%`;
    
    // Update visualization
    this.update3DVisualization(data.results.projectedData);
    
    // Update chart
    this.updateChartData(data.results.simulationProbability);
    
    // Display artifacts and patterns
    this.displayArtifacts(data.results.artifacts);
    this.displayPatternsFromResults(data.results);
  }
  
  update3DVisualization(data) {
    // Clear previous points if they exist
    if (this.points) {
      this.scene.remove(this.points);
    }
    
    // Create new points geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(data.length * 3);
    
    // Convert 3D projection data to positions array
    for (let i = 0; i < data.length; i++) {
      positions[i * 3] = data[i][0] * 2; // x
      positions[i * 3 + 1] = data[i][1] * 2; // y
      positions[i * 3 + 2] = data[i][2] * 2; // z
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create points material
    const material = new THREE.PointsMaterial({
      color: 0xa29bfe,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    
    // Create and add points to scene
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }
  
  updateChartData(probability) {
    // Add new data point to chart
    const timestamp = new Date().toLocaleTimeString();
    
    // Add new point
    this.chart.data.labels.push(timestamp);
    this.chart.data.datasets[0].data.push(probability);
    
    // Keep only the last 10 points
    if (this.chart.data.labels.length > 10) {
      this.chart.data.labels.shift();
      this.chart.data.datasets[0].data.shift();
    }
    
    this.chart.update();
  }
  
  displayArtifacts(artifacts) {
    if (!artifacts || artifacts.length === 0) {
      this.artifactsDisplay.innerHTML = '<p>No artifacts detected in current simulation</p>';
      return;
    }
    
    let html = '';
    for (const artifact of artifacts) {
      const significanceClass = artifact.significance || 'low';
      html += `
        <div class="artifact-item ${significanceClass}">
          <strong>${artifact.type.replace('_', ' ').toUpperCase()}</strong>
          <p>Measurement: ${(artifact.measurement * 100).toFixed(1)}%</p>
          <p>Significance: ${artifact.significance.toUpperCase()}</p>
        </div>
      `;
    }
    
    this.artifactsDisplay.innerHTML = html;
  }
  
  displayPatterns(patterns) {
    if (!patterns || patterns.length === 0) {
      this.patternsDisplay.innerHTML = '<p>No patterns detected in current simulation</p>';
      return;
    }
    
    let html = '';
    for (const pattern of patterns) {
      html += `
        <div class="pattern-item">
          <strong>${pattern.name}</strong>
          <p>${pattern.description}</p>
          <p>Confidence: ${(pattern.confidence * 100).toFixed(1)}%</p>
        </div>
      `;
    }
    
    this.patternsDisplay.innerHTML = html;
  }
  
  displayPatternsFromResults(results) {
    // Display patterns based on simulation results
    let html = '';
    
    if (results.artifacts && results.artifacts.length > 0) {
      for (const artifact of results.artifacts) {
        html += `
          <div class="pattern-item ${artifact.significance}">
            <strong>${artifact.type.replace('_', ' ').toUpperCase()}</strong>
            <p>Detected in simulation with ${(artifact.measurement * 100).toFixed(1)}% certainty</p>
          </div>
        `;
      }
    } else {
      html = '<p>No significant patterns detected in this simulation</p>';
    }
    
    this.patternsDisplay.innerHTML = html;
  }
  
  resetSimulation() {
    // Reset to initial state
    this.dimensionSelect.value = '3';
    this.simulationFactor.value = '0.5';
    this.simulationFactorValue.textContent = '0.5';
    this.projectionType.value = 'orthographic';
    
    // Reset displays
    this.probabilityDisplay.textContent = 'Initializing...';
    this.probabilityBar.style.width = '0%';
    this.artifactsDisplay.innerHTML = '<p>Analyzing for simulation artifacts...</p>';
    this.patternsDisplay.innerHTML = '<p>Scanning for unusual patterns...</p>';
    
    // Clear chart
    this.chart.data.labels = [];
    this.chart.data.datasets[0].data = [];
    this.chart.update();
    
    // Clear 3D scene
    if (this.points) {
      this.scene.remove(this.points);
      this.points = null;
    }
    
    // Add initial points for visual interest
    this.createInitialVisualization();
  }
  
  createInitialVisualization() {
    // Create an interesting initial visualization
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x6c5ce7,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    this.scene.add(sphere);
    
    // Add some random points
    const pointsGeometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4;
    }
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xfd79a8,
      size: 0.03,
      transparent: true,
      opacity: 0.7
    });
    
    this.points = new THREE.Points(pointsGeometry, pointsMaterial);
    this.scene.add(this.points);
  }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new SimulationApp();
});