#!/bin/bash
# File: /clouddojo/backup/run_backup_cron.sh
# This script is called by cron to run the database backup

# Set the PATH to ensure all commands are available
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Email settings
EMAIL_TO="bonyuglen@gmail.com"
EMAIL_SUBJECT="Database Backup - $(date +\%Y-\%m-\%d)"
TEMP_LOG="/tmp/db_backup_$(date +\%Y\%m\%d\%H\%M\%S).log"

# create the temp_log dir if it doesn't exist
mkdir -p "$(dirname "$TEMP_LOG")"

# Go to the directory containing the backup script
cd "$(dirname "$0")" || {
    echo "Failed to change to script directory" | tee -a "$TEMP_LOG"
    exit 1
}

log "found backup script"
log "running backup script..."


# Run the backup script and capture all output
./backup_script.sh > "$TEMP_LOG" 2>&1

# Check if backup was successful
if grep -q "Backup process completed successfully" "$TEMP_LOG"; then
    log "backup completed successfully"
    STATUS="SUCCESS"
else
    STATUS="FAILED"
    EMAIL_SUBJECT="URGENT: $EMAIL_SUBJECT - FAILED"
    log "backup failed"
fi

# Send email with the log file
if command -v mail > /dev/null; then
    cat "$TEMP_LOG" | mail -s "$EMAIL_SUBJECT" "$EMAIL_TO"
fi

# Clean up the temporary log file
rm -f "$TEMP_LOG"
