#!/bin/bash
# This script is used to backup cld database to aws s3 bucket.
#

# Configure log file
LOG_FILE="$HOME/db-backup-logs/backup_$(date +"%Y-%m-%d").log"
mkdir -p "$(dirname "$LOG_FILE")"

# Log function
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Error handling function
handle_error() {
    log "ERROR: $1"
    exit 1
}

# Check required commands
check_command() {
    if ! command -v "$1" &> /dev/null; then
        handle_error "Required command '$1' is not installed. Please install it and try again."
    fi
}

# Check required commands
check_command pg_dump
check_command rclone

# Database credentials
PGHOST='ep-silent-bar-a2tr7kfk-pooler.eu-central-1.aws.neon.tech'
PGDATABASE='clouddojodb'
PGUSER='clouddojodb_owner'
PGPASSWORD='npg_72XuUHOEYFyg'
PGSSLMODE='require'
PGCHANNELBINDING='require'

# timestamp
TIMESTAMP=$(date +"%Y-%m-%d-%H-%M-%S")

# dir
DIR="$HOME/db-backup-$TIMESTAMP"
log "Creating backup directory: $DIR"

# destination
DEST=$DIR/backups

# make sure the directory exists
mkdir -p "$DEST" || handle_error "Failed to create directory $DEST"
log "Created backup destination directory: $DEST"

# Start database backup
log "Starting database backup from $PGHOST/$PGDATABASE"
PGPASSWORD=$PGPASSWORD pg_dump --inserts --column-inserts --username=$PGUSER --host=$PGHOST --dbname=$PGDATABASE > "$DEST/$TIMESTAMP.sql" 2>> "$LOG_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$DEST/$TIMESTAMP.sql" | cut -f1)
    log "Database backup completed successfully. Backup size: $BACKUP_SIZE"
else
    handle_error "Database backup failed"
fi

# Test rclone configuration
log "Testing rclone configuration"
rclone config show || handle_error "Rclone configuration test failed. Please check your rclone setup."

# Upload to S3
log "Starting upload to S3 bucket: neon-db-backup-cldj-root"
rclone copy "$DEST" neon:neon-db-backup-cldj-root --verbose || handle_error "Upload to S3 failed"

# Verify the upload
log "Verifying files in S3 bucket"
if rclone ls neon:neon-db-backup-cldj-root | grep -q "$TIMESTAMP"; then
    log "Upload to S3 verified successfully"
else
    handle_error "Files not found in S3 bucket after upload"
fi

# Cleanup
log "Cleaning up temporary files"
rm -rf "$DIR"
log "Backup process completed successfully"

# Keep only the last 7 days of logs
find "$HOME/db-backup-logs" -name "backup_*.log" -type f -mtime +7 -delete
log "Old logs cleaned up"
