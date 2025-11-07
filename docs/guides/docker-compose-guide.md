# Docker Compose Basics Guide

## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container Docker applications. Instead of running multiple `docker run` commands, you define everything in a single YAML file.

## Basic Structure

```yaml
version: '3.8'  # Docker Compose file version

services:       # Define your containers here
  service-name:
    # Service configuration

volumes:        # Define named volumes (optional)
  volume-name:

networks:       # Define custom networks (optional)
  network-name:
```

## Core Concepts

### 1. Services

Services are containers that run your applications. Each service can be:
- A database (PostgreSQL, MySQL, MongoDB)
- A web server (nginx, Apache)
- Your application
- A cache (Redis, Memcached)
- Any other containerized service

```yaml
services:
  my-app:
    image: node:18        # Use a pre-built image
    # OR
    build: ./app          # Build from a Dockerfile
```

### 2. Common Service Properties

#### **image**
Specifies which Docker image to use:
```yaml
services:
  postgres:
    image: postgres:16-alpine  # image:tag format
```

#### **container_name**
Custom name for your container (instead of auto-generated):
```yaml
services:
  postgres:
    container_name: my-postgres-db
```

#### **ports**
Maps container ports to host ports (HOST:CONTAINER):
```yaml
services:
  web:
    ports:
      - "3000:3000"      # Access container port 3000 via localhost:3000
      - "8080:80"        # Access container port 80 via localhost:8080
```

#### **environment**
Sets environment variables inside the container:
```yaml
services:
  postgres:
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
      # OR use array syntax
      # - POSTGRES_USER=admin
```

You can also use an environment file:
```yaml
services:
  app:
    env_file:
      - .env
      - .env.local
```

#### **volumes**
Persists data or mounts files/directories:

**Named volumes** (managed by Docker):
```yaml
services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:  # Define the named volume
```

**Bind mounts** (link to host filesystem):
```yaml
services:
  app:
    volumes:
      - ./src:/app/src              # Sync local ./src to /app/src in container
      - ./package.json:/app/package.json
      - node_modules:/app/node_modules  # Named volume for node_modules
```

#### **depends_on**
Defines service startup order:
```yaml
services:
  app:
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:16
  
  redis:
    image: redis:7
```

**Note:** This only waits for the container to start, not for the service to be ready. Use healthchecks for that.

#### **restart**
Controls container restart behavior:
```yaml
services:
  app:
    restart: unless-stopped  # Options: no, always, on-failure, unless-stopped
```

#### **networks**
Connects services to custom networks:
```yaml
services:
  app:
    networks:
      - frontend
      - backend
  
  postgres:
    networks:
      - backend

networks:
  frontend:
  backend:
```

#### **command**
Overrides the default command:
```yaml
services:
  app:
    image: node:18
    command: npm run dev  # Override default CMD
```

#### **working_dir**
Sets the working directory inside the container:
```yaml
services:
  app:
    working_dir: /app
```

#### **healthcheck**
Defines health check for the service:
```yaml
services:
  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s      # Check every 10 seconds
      timeout: 5s        # Timeout after 5 seconds
      retries: 5         # Retry 5 times before marking unhealthy
      start_period: 30s  # Grace period before health checks start
```

## Complete Example: Full Stack Application

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: app-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Run on first start
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: app-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - backend
    command: redis-server --appendonly yes  # Enable persistence

  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: app-nextjs
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/myapp
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - node_modules:/app/node_modules
    depends_on:
      postgres:
        condition: service_healthy  # Wait for postgres to be healthy
      redis:
        condition: service_started
    networks:
      - frontend
      - backend

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: app-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    networks:
      - frontend

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  node_modules:
    driver: local

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

## Building Custom Images

If you need to build from a Dockerfile:

**Simple build:**
```yaml
services:
  app:
    build: ./app  # Path to directory containing Dockerfile
```

**Advanced build:**
```yaml
services:
  app:
    build:
      context: ./app              # Build context directory
      dockerfile: Dockerfile.dev  # Custom Dockerfile name
      args:
        NODE_VERSION: 18          # Build arguments
        APP_ENV: development
      target: development         # Multi-stage build target
```

## Common Docker Compose Commands

```bash
# Start services in detached mode
docker-compose up -d

# Start and rebuild images
docker-compose up -d --build

# View logs
docker-compose logs          # All services
docker-compose logs app      # Specific service
docker-compose logs -f app   # Follow logs

# Stop services (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v

# Stop and remove containers + images
docker-compose down --rmi all

# List running services
docker-compose ps

# Execute command in running container
docker-compose exec app npm install
docker-compose exec postgres psql -U postgres

# View service logs
docker-compose logs -f app

# Restart a service
docker-compose restart app

# Scale a service (run multiple instances)
docker-compose up -d --scale worker=3
```

## Environment Variables

### Using .env file

Create a `.env` file in the same directory as `docker-compose.yml`:

```env
POSTGRES_PASSWORD=secret123
APP_PORT=3000
```

Reference in docker-compose.yml:
```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  
  app:
    ports:
      - "${APP_PORT}:3000"
```

## Best Practices

1. **Use specific image tags** instead of `latest`:
   ```yaml
   image: postgres:16-alpine  # Good
   image: postgres:latest      # Avoid
   ```

2. **Use named volumes** for data persistence:
   ```yaml
   volumes:
     - postgres_data:/var/lib/postgresql/data  # Good
     # Avoid storing DB data in bind mounts
   ```

3. **Use healthchecks** for services that need startup time:
   ```yaml
   healthcheck:
     test: ["CMD-SHELL", "pg_isready"]
     interval: 10s
   ```

4. **Separate development and production configs**:
   - `docker-compose.yml` (base)
   - `docker-compose.dev.yml` (development overrides)
   - `docker-compose.prod.yml` (production overrides)
   
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

5. **Use .dockerignore** to exclude unnecessary files:
   ```
   node_modules
   .git
   .env
   *.log
   ```

6. **Don't store secrets in docker-compose.yml**:
   ```yaml
   # Bad
   environment:
     PASSWORD: mysecretpassword
   
   # Good
   environment:
     PASSWORD: ${DB_PASSWORD}  # From .env file
   ```

7. **Use networks to isolate services**:
   ```yaml
   # Frontend can't directly access database
   services:
     frontend:
       networks: [frontend]
     api:
       networks: [frontend, backend]
     database:
       networks: [backend]
   ```

## Common Use Cases

### Development Database
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
    volumes:
      - ./data:/var/lib/postgresql/data
```

### Full Development Environment
```yaml
services:
  app:
    build: .
    volumes:
      - .:/app          # Hot reload
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
```

### Production-like Setup
```yaml
services:
  app:
    image: myapp:1.0.0
    restart: always
    environment:
      NODE_ENV: production
    # No port exposure (behind nginx)
    depends_on:
      - postgres
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
```

## Troubleshooting

**Service won't start:**
```bash
docker-compose logs service-name
```

**Port already in use:**
```bash
# Change port in docker-compose.yml
ports:
  - "5433:5432"  # Use different host port
```

**Permission issues with volumes:**
```yaml
user: "${UID}:${GID}"  # Run as current user
```

**Clear everything and start fresh:**
```bash
docker-compose down -v --rmi all
docker-compose up -d --build
```

## Additional Resources

- [Official Docker Compose Documentation](https://docs.docker.com/compose/)
- [Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Hub](https://hub.docker.com/) - Find official images

---

**Pro Tip:** Start simple and add complexity as needed. A basic setup with `image`, `ports`, and `volumes` is often enough for local development!
