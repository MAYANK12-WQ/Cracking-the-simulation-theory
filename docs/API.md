# API Documentation

## Base URL

All API endpoints are relative to: `http://localhost:3000/api`

## Available Endpoints

### GET /dimensions

Returns a list of available dimensions to explore

**Response:**
```json
{
  "dimensions": [
    {
      "id": 3,
      "name": "3D (Observable Universe)",
      "description": "Standard three-dimensional space"
    },
    {
      "id": 4,
      "name": "4D (Time as Dimension)",
      "description": "Adding time as the fourth dimension"
    },
    {
      "id": 5,
      "name": "5D (Kaluza-Klein Theory)",
      "description": "Higher dimension for electromagnetic force"
    },
    {
      "id": 10,
      "name": "10D (String Theory)",
      "description": "Dimensions required for string theory"
    },
    {
      "id": 11,
      "name": "11D (M-Theory)",
      "description": "Dimensions required for M-theory"
    },
    {
      "id": "n",
      "name": "N-Dimensional",
      "description": "Arbitrary number of dimensions"
    }
  ]
}
```

### POST /simulate

Run a simulation with the specified parameters

**Request Body:**
```json
{
  "dimensions": 4,
  "parameters": {
    "hiddenUnits": 128,
    "sampleSize": 1000,
    "projectionType": "perspective"
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "inputDimensions": 4,
    "sampleSize": 1000,
    "projectedData": [[x1, y1, z1], [x2, y2, z2], ...],
    "artifacts": [
      {
        "type": "grid_pattern",
        "measurement": 0.65,
        "significance": "medium"
      }
    ],
    "simulationProbability": 0.72,
    "parameters": {
      "hiddenUnits": 128,
      "sampleSize": 1000,
      "projectionType": "perspective"
    }
  },
  "parameters": {
    "dimensions": 4,
    "hiddenUnits": 128,
    "sampleSize": 1000,
    "projectionType": "perspective"
  }
}
```

### GET /patterns

Returns potential patterns that could indicate a simulated reality

**Response:**
```json
{
  "patterns": [
    {
      "name": "Grid-like Structures",
      "description": "Regular patterns at quantum scale",
      "confidence": 0.72,
      "visualization": "grid"
    },
    {
      "name": "Rounded Decimal Values",
      "description": "Physical constants having computationally convenient values",
      "confidence": 0.45,
      "visualization": "decimal"
    },
    {
      "name": "Pixelation Effect",
      "description": "Quantum foam as \"resolution limit\" of simulation",
      "confidence": 0.65,
      "visualization": "pixel"
    }
  ]
}
```

### GET /artifacts

Returns potential simulation artifacts

**Response:**
```json
{
  "artifacts": [
    {
      "name": "Fine-tuned Constants",
      "description": "Physical constants finely tuned for complexity",
      "relevance": "high",
      "model_support": 0.85
    },
    {
      "name": "Mathematical Elegance",
      "description": "Fundamental physics described by elegant mathematics",
      "relevance": "high",
      "model_support": 0.78
    },
    {
      "name": "Computational Efficiency",
      "description": "Nature following computable laws",
      "relevance": "medium",
      "model_support": 0.62
    }
  ]
}
```

## Common Headers

- `Content-Type: application/json`
- `Accept: application/json`

## Error Responses

All error responses follow this structure:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Authentication

This API does not require authentication for any endpoints.