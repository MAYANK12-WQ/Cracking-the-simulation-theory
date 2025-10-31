// utils/DimensionProjector.js
class DimensionProjector {
  constructor() {
    this.projectionMethods = {
      'orthographic': this.orthographicProjection.bind(this),
      'perspective': this.perspectiveProjection.bind(this),
      'stereographic': this.stereographicProjection.bind(this),
      'pca': this.pcaProjection.bind(this)
    };
  }

  project(data, targetDimensions, method = 'perspective') {
    if (!this.projectionMethods[method]) {
      throw new Error(`Unknown projection method: ${method}`);
    }
    
    return this.projectionMethods[method](data, targetDimensions);
  }

  orthographicProjection(data, targetDims) {
    // Simple orthographic projection - just take first N dimensions
    if (targetDims >= data[0].length) return data;
    
    return data.map(point => point.slice(0, targetDims));
  }

  perspectiveProjection(data, targetDims) {
    // Apply perspective division to simulate depth
    return data.map(point => {
      // For 4D+ to 3D projection, use the last dimension as w-coordinate
      if (point.length > targetDims) {
        const divisor = Math.abs(point[point.length - 1]) + 0.1; // Avoid division by zero
        return point.slice(0, targetDims).map(coord => coord / divisor);
      }
      return point.slice(0, targetDims);
    });
  }

  stereographicProjection(data, targetDims) {
    // Stereographic projection from higher dimensions
    // Project onto a hypersphere then to lower dimensions
    return data.map(point => {
      // Normalize point to unit hypersphere
      const magnitude = Math.sqrt(point.reduce((sum, val) => sum + val * val, 0));
      if (magnitude === 0) return point.slice(0, targetDims);
      
      const normalized = point.map(coord => coord / magnitude);
      
      // Apply stereographic projection formula
      // For n-sphere to (n-1)-space
      const lastCoord = normalized[normalized.length - 1];
      const factor = 1 / (1 - lastCoord);
      
      return normalized
        .slice(0, normalized.length - 1)
        .map(coord => coord * factor)
        .slice(0, targetDims);
    });
  }

  pcaProjection(data, targetDims) {
    // Simplified PCA-like projection for demonstration
    // In a real implementation, this would compute actual PCA
    return data.map(point => {
      // Create a weighted combination of dimensions
      const weights = this.generateWeights(point.length, targetDims);
      const result = [];
      
      for (let i = 0; i < targetDims; i++) {
        let value = 0;
        for (let j = 0; j < point.length; j++) {
          value += point[j] * weights[i][j];
        }
        result.push(value);
      }
      
      return result;
    });
  }

  generateWeights(nDims, targetDims) {
    // Generate random weights for PCA-like projection
    const weights = [];
    for (let i = 0; i < targetDims; i++) {
      weights[i] = [];
      for (let j = 0; j < nDims; j++) {
        weights[i][j] = (Math.random() - 0.5) * 2;
      }
      // Normalize the weight vector
      const norm = Math.sqrt(weights[i].reduce((sum, w) => sum + w*w, 0));
      weights[i] = weights[i].map(w => w / norm);
    }
    return weights;
  }
}

module.exports = DimensionProjector;