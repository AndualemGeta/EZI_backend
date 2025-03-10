# Use Node.js for building the Angular project
FROM node:16 AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular project (use production flag for optimization)
RUN npm run build --prod

# Use Nginx to serve the Angular app
FROM nginx:alpine AS production-stage

# Copy custom nginx.conf to the nginx config folder
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from Node.js build stage to Nginx HTML folder
COPY --from=build-stage /app/dist/* /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
