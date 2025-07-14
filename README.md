# GroupSession Docker Container

Docker container for [GroupSession](https://groupsession.jp/), a comprehensive Japanese groupware solution.

[日本語版はこちら](README_JP.md)

## Overview

This project provides a Docker container for GroupSession with:
- **Java**: Temurin JDK 11 (Eclipse Adoptium)
- **Application Server**: Apache Tomcat 9
- **Localization**: Pre-configured for Japanese environment

## Prerequisites

- Docker and Docker Compose installed
- GroupSession WAR file (download from [official website](https://groupsession.jp/))

## Quick Start

1. **Download GroupSession WAR file**
   - Visit [GroupSession official website](https://groupsession.jp/)
   - Download the latest version
   - Place the downloaded file as `gsession.war` in this directory

2. **Build the Docker image**
   ```bash
   docker-compose build
   ```

3. **Start the container**
   ```bash
   docker-compose up -d
   ```

4. **Access GroupSession**
   - URL: http://localhost:8080/gsession/
   - Default login:
     - User ID: `admin`
     - Password: `admin`

## Configuration

### Environment Settings
- **Timezone**: Asia/Tokyo
- **Locale**: ja_JP.UTF-8
- **Character Encoding**: UTF-8

### Memory Configuration
Default JVM heap settings (adjustable in `docker-compose.yml`):
- Maximum heap size: 2048MB
- Initial heap size: 1024MB

### Data Persistence
- GroupSession data is stored in `./gsession_data` directory
- This directory is mounted as `/home/gsession` in the container

## Container Management

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f groupsession

# Stop the container
docker-compose down

# Restart the container
docker-compose restart
```

## Directory Structure

```
.
├── Dockerfile          # Container image definition
├── docker-compose.yml  # Container orchestration
├── gsession.war       # GroupSession WAR file (user provided)
├── gsdata.conf        # GroupSession data directory configuration
├── startup.sh         # Container startup script
└── gsession_data/     # Persistent data directory (auto-created)
```

## Troubleshooting

### Common Issues

- **Container startup**: GroupSession takes approximately 20 seconds to fully initialize
- **Container restart loops**: Check logs with `docker-compose logs groupsession` - usually indicates startup script issues
- **Memory issues**: Adjust `JAVA_OPTS` in `docker-compose.yml` if you encounter OutOfMemory errors
- **Connection refused**: Ensure port 8080 is not already in use on your host
- **Locale warnings**: Warning messages about locale settings in logs are harmless and don't affect functionality

### Debugging Commands

```bash
# Check container status and health
docker-compose ps

# View real-time logs
docker-compose logs -f groupsession

# Access container shell for debugging
docker-compose exec groupsession bash

# Check if GroupSession is responding
curl -I http://localhost:8080/gsession/
```

## Git Flow

This project uses git-flow.
Please use `git flow init -d` to initialize.

## License

This Docker configuration is provided under the MIT License. GroupSession itself has its own licensing terms - please refer to the [official website](https://groupsession.jp/).