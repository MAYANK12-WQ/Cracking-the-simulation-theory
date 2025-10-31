# Deployment Guide

## Deploying to Production

The Simulation Hypothesis Explorer can be deployed to various platforms. Here are instructions for common deployment options:

## Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Log in to Heroku from the command line:
   ```bash
   heroku login
   ```
3. Navigate to your project directory:
   ```bash
   cd simulation-hypothesis-explorer
   ```
4. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
5. Deploy the application:
   ```bash
   git push heroku main
   ```
6. Open the application:
   ```bash
   heroku open
   ```

## Docker Deployment

1. Create a Dockerfile in the project root:
   ```Dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```
   
2. Build the Docker image:
   ```bash
   docker build -t simulation-hypothesis-explorer .
   ```
   
3. Run the Docker container:
   ```bash
   docker run -p 3000:3000 simulation-hypothesis-explorer
   ```

## AWS Elastic Beanstalk

1. Install the EB CLI:
   ```bash
   pip install awsebcli
   ```
2. Initialize the application:
   ```bash
   eb init
   ```
3. Create an environment and deploy:
   ```bash
   eb create production
   eb deploy
   ```
4. Open the deployed application:
   ```bash
   eb open
   ```

## Environment Variables

For production deployment, you may need to set the following environment variables:

- `PORT`: The port number for the server (default: 3000)

## Production Configuration

In production, consider these optimizations:

- Set `NODE_ENV=production` to optimize for production
- Use a reverse proxy like Nginx in front of the Node.js server
- Implement caching for static assets
- Use a CDN for static files (CSS, JS, images)

## Health Checks

The application includes basic health checks. You can verify the server is running by making a request to the root URL.

## Scaling

The application is designed to be stateless and can be scaled horizontally by running multiple instances behind a load balancer.