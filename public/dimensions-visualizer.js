// public/dimensions-visualizer.js
class DimensionsVisualizer {
  constructor() {
    this.currentDimension = 3;
    this.isAnimating = false;
    this.animationId = null;
    
    this.initializeElements();
    this.setupEventListeners();
    this.initialize3D();
    this.updateDimensionInfo();
  }
  
  initializeElements() {
    this.dimensionNumber = document.getElementById('dimension-number');
    this.projectionMethod = document.getElementById('projection-method');
    this.animateButton = document.getElementById('animate');
    this.resetButton = document.getElementById('reset-view');
    this.descriptionDiv = document.getElementById('dimension-description');
    this.implicationsDiv = document.getElementById('physical-implications');
    this.possibilitiesDiv = document.getElementById('simulation-possibilities');
    this.container = document.getElementById('visualization-container');
  }
  
  setupEventListeners() {
    this.dimensionNumber.addEventListener('change', () => {
      this.currentDimension = parseInt(this.dimensionNumber.value);
      this.updateVisualization();
      this.updateDimensionInfo();
    });
    
    this.projectionMethod.addEventListener('change', () => {
      this.updateVisualization();
    });
    
    this.animateButton.addEventListener('click', () => {
      this.toggleAnimation();
    });
    
    this.resetButton.addEventListener('click', () => {
      this.resetView();
    });
  }
  
  initialize3D() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f1a2d);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      this.container.clientWidth / this.container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    });
    
    // Initial visualization
    this.updateVisualization();
    
    // Start animation loop
    this.animate();
  }
  
  updateVisualization() {
    // Clear previous visualization
    while(this.scene.children.length > 2) { // Keep lights
      const obj = this.scene.children[2];
      this.scene.remove(obj);
    }
    
    // Create visualization based on selected dimension
    switch(this.currentDimension) {
      case 1:
        this.create1DVisualization();
        break;
      case 2:
        this.create2DVisualization();
        break;
      case 3:
        this.create3DVisualization();
        break;
      case 4:
        this.create4DVisualization();
        break;
      case 5:
      case 10:
      case 11:
        this.createHigherDimensionVisualization();
        break;
      default:
        this.create3DVisualization(); // Default to 3D
    }
  }
  
  create1DVisualization() {
    // 1D visualization: a line
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      -2, 0, 0,
      2, 0, 0
    ]);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.LineBasicMaterial({ color: 0x6c5ce7, linewidth: 3 });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    
    // Add points to indicate "1D beings"
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsPositions = new Float32Array([
      -1, 0, 0,
      0, 0, 0,
      1, 0, 0
    ]);
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));
    const pointsMaterial = new THREE.PointsMaterial({ color: 0xfd79a8, size: 0.2 });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    this.scene.add(points);
  }
  
  create2DVisualization() {
    // 2D visualization: a plane with a grid
    const geometry = new THREE.PlaneGeometry(4, 4, 10, 10);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x6c5ce7, 
      side: THREE.DoubleSide,
      wireframe: true
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    this.scene.add(plane);
    
    // Add points to indicate "2D beings"
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsPositions = new Float32Array([
      -1, 0.1, -1,
      0, 0.1, 0,
      1, 0.1, 1,
      -1, 0.1, 1,
      1, 0.1, -1
    ]);
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));
    const pointsMaterial = new THREE.PointsMaterial({ color: 0xfd79a8, size: 0.15 });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    this.scene.add(points);
  }
  
  create3DVisualization() {
    // 3D visualization: a cube with internal structure
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x6c5ce7,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    
    // Add internal points
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsPositions = new Float32Array([
      -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,
      -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5,
      -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5,
      -0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
      0, 0, 0
    ]);
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));
    const pointsMaterial = new THREE.PointsMaterial({ color: 0xfd79a8, size: 0.15 });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    this.scene.add(points);
  }
  
  create4DVisualization() {
    // 4D visualization: Tesseract (4D cube) projection
    // Project 4D to 3D
    const vertices4D = [
      [-1,-1,-1,-1], [1,-1,-1,-1], [-1,1,-1,-1], [1,1,-1,-1],
      [-1,-1,1,-1], [1,-1,1,-1], [-1,1,1,-1], [1,1,1,-1],
      [-1,-1,-1,1], [1,-1,-1,1], [-1,1,-1,1], [1,1,-1,1],
      [-1,-1,1,1], [1,-1,1,1], [-1,1,1,1], [1,1,1,1]
    ];
    
    // Simple projection: just ignore the 4th dimension
    const vertices3D = vertices4D.map(v => [v[0]*0.8, v[1]*0.8, v[2]*0.8]);
    
    // Define tesseract edges
    const edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        // Count differences in coordinates
        let diffCount = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diffCount++;
        }
        if (diffCount === 1) {
          edges.push(i, j);
        }
      }
    }
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 3);
    
    for (let i = 0; i < edges.length; i++) {
      const vertex = vertices3D[edges[i]];
      positions[i * 3] = vertex[0];
      positions[i * 3 + 1] = vertex[1];
      positions[i * 3 + 2] = vertex[2];
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.LineBasicMaterial({ color: 0x6c5ce7, transparent: true, opacity: 0.8 });
    const tesseract = new THREE.LineSegments(geometry, material);
    this.scene.add(tesseract);
    
    // Add 4D points
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsPositions = new Float32Array(vertices3D.flat());
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({ color: 0xfd79a8, size: 0.15 });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    this.scene.add(points);
  }
  
  createHigherDimensionVisualization() {
    // For higher dimensions, visualize as a complex network or particle system
    const geometry = new THREE.BufferGeometry();
    const count = 100;
    const positions = new Float32Array(count * 3);
    
    // Generate points that appear to have higher-dimensional structure
    for (let i = 0; i < count; i++) {
      // Use spherical distribution with some higher-dimensional patterns
      const radius = 2 * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Add some higher-dimensional "pattern" based on dimension number
      const patternFactor = this.currentDimension > 5 ? 0.5 : 0.2;
      positions[i * 3] += Math.sin(i * patternFactor) * 0.5;
      positions[i * 3 + 1] += Math.cos(i * patternFactor) * 0.5;
      positions[i * 3 + 2] += Math.sin(i * Math.cos(patternFactor)) * 0.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create connecting lines for higher-dimensional structure
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(count * 2 * 3); // Lines between some points
    let lineIdx = 0;
    
    for (let i = 0; i < count - 1; i++) {
      // Connect each point to the next one to form a path structure
      linePositions[lineIdx++] = positions[i * 3];
      linePositions[lineIdx++] = positions[i * 3 + 1];
      linePositions[lineIdx++] = positions[i * 3 + 2];
      
      linePositions[lineIdx++] = positions[i * 3 + 3];
      linePositions[lineIdx++] = positions[i * 3 + 4];
      linePositions[lineIdx++] = positions[i * 3 + 5];
    }
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    // Add the structure to the scene
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6c5ce7, transparent: true, opacity: 0.5 });
    const connections = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(connections);
    
    const pointMaterial = new THREE.PointsMaterial({ color: 0xfd79a8, size: 0.1, transparent: true, opacity: 0.8 });
    const points = new THREE.Points(geometry, pointMaterial);
    this.scene.add(points);
  }
  
  updateDimensionInfo() {
    // Update the information panels based on selected dimension
    const info = this.getDimensionInfo(this.currentDimension);
    
    this.descriptionDiv.innerHTML = `<p>${info.description}</p>`;
    this.implicationsDiv.innerHTML = `<p>${info.implications}</p>`;
    this.possibilitiesDiv.innerHTML = `<p>${info.simulation}</p>`;
  }
  
  getDimensionInfo(dimension) {
    const info = {
      1: {
        description: "One-dimensional space consists of only length. Imagine a universe that is just a straight line. Beings in 1D would only perceive forward and backward, with no concept of left/right or up/down.",
        implications: "Physics in 1D would be extremely limited. Forces could only act along the line, and complex structures would be impossible. Particles would pass by each other without interaction possibilities.",
        simulation: "A 1D universe would be the ultimate simplification, possibly the most computationally efficient to simulate. The limited degrees of freedom could indicate a minimally simulated reality."
      },
      2: {
        description: "Two-dimensional space adds width to length, creating a plane. Inhabitants would perceive only length and width, with no concept of height. This is the world of Flatland.",
        implications: "2D physics would allow more complexity but still be constrained. Fluid dynamics, for example, would behave very differently. Stable orbits might not exist in 2D gravity.",
        simulation: "2D simulations are often used in computing because they require less processing power. Any 2D patterns in our 3D universe could suggest computational shortcuts in our reality."
      },
      3: {
        description: "Three-dimensional space is our familiar reality with length, width, and height. This allows for complex structures, stable orbits, and the rich physics we observe.",
        implications: "3D space allows for complex chemistry, stable planetary orbits, and the possibility for life as we know it. Most physical laws are optimized for 3D space.",
        simulation: "Our 3D universe could be a projected or emergent property of higher-dimensional physics. The question is whether this 3D reality is fundamental or derived."
      },
      4: {
        description: "Four-dimensional space typically includes time as the fourth dimension (spacetime). However, there could be a 4th spatial dimension that we cannot perceive directly.",
        implications: "A 4th spatial dimension would allow for impossible objects from our 3D perspective. A 4D being could theoretically see inside 3D objects without breaking them.",
        simulation: "Time as a dimension could be a computational convenience rather than a fundamental aspect of reality. The way time is discretized could reveal simulation parameters."
      },
      5: {
        description: "Five-dimensional space is proposed in Kaluza-Klein theory, where the 5th dimension is compactified and unobservable, unifying gravity and electromagnetism.",
        implications: "The 5th dimension could explain the relationship between fundamental forces. It's theorized to be 'curled up' at the Planck scale.",
        simulation: "Extra compactified dimensions could represent computational optimization in a simulated universe - extra dimensions that are 'folded' to save processing power."
      },
      10: {
        description: "Ten-dimensional space is required by string theory, where 6 dimensions are compactified and unobservable, leaving 4 extended dimensions (3 space + 1 time).",
        implications: "String theory requires 10 dimensions for mathematical consistency. The extra dimensions may hold the secret to unifying all fundamental forces.",
        simulation: "The mathematical necessity of 10 dimensions in string theory could be evidence of a universe designed according to elegant mathematical principles - possibly by an intelligence."
      },
      11: {
        description: "Eleven-dimensional space is required by M-theory, which unifies different string theories. The 11th dimension may be large, with other dimensions appearing as ripples.",
        implications: "M-theory's 11 dimensions could explain the fundamental nature of reality. The extra dimensions may manifest as quantum effects in our 4D spacetime.",
        simulation: "The elegant mathematics of 11D M-theory could suggest our universe runs on sophisticated but mathematically consistent code, like a complex program."
      }
    };
    
    return info[dimension] || {
      description: "This higher-dimensional space would have properties that are difficult to visualize or conceptualize in our 3D world.",
      implications: "Physics in higher dimensions would allow for complex interactions and structures beyond our intuitive understanding.",
      simulation: "Higher dimensions could represent the 'source code' of reality, with our 4D spacetime being a projection or lower-dimensional manifestation."
    };
  }
  
  toggleAnimation() {
    this.isAnimating = !this.isAnimating;
    
    if (this.isAnimating) {
      this.animateButton.textContent = 'Stop Animation';
      this.startAnimation();
    } else {
      this.animateButton.textContent = 'Animate';
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  }
  
  startAnimation() {
    if (!this.isAnimating) return;
    
    // Rotate the visualization
    if (this.scene.children.length > 2) {
      const obj = this.scene.children[2]; // First object after lights
      if (obj) {
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.005;
      }
    }
    
    this.animationId = requestAnimationFrame(() => this.startAnimation());
  }
  
  resetView() {
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
    
    // Reset object rotations
    for (let i = 2; i < this.scene.children.length; i++) {
      const obj = this.scene.children[i];
      if (obj) {
        obj.rotation.set(0, 0, 0);
      }
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new DimensionsVisualizer();
});