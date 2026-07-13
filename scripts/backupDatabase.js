#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017';
const DATABASE_NAME = process.env.MONGODB_DATABASE || 'atin';
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups');
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10);

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { compress: true, dryRun: false, retention: RETENTION_DAYS };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--no-compress':
        options.compress = false;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--retention':
        options.retention = parseInt(args[++i], 10);
        break;
      case '--output':
        options.outputDir = args[++i];
        break;
      case '--uri':
        options.uri = args[++i];
        break;
      case '--database':
        options.database = args[++i];
        break;
      case '--help':
        console.log(`
Usage: node backupDatabase.js [options]

Options:
  --uri <uri>           MongoDB connection URI
  --database <name>     Database name to backup
  --output <dir>        Output directory for backups
  --retention <days>    Days to keep backups (default: 30)
  --no-compress         Skip gzip compression
  --dry-run             Show what would be done
  --help                Show this help message
        `);
        process.exit(0);
    }
  }
  return options;
}

function createBackup(options) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${DATABASE_NAME}_${timestamp}`;
  const backupPath = options.outputDir || path.join(BACKUP_DIR, backupName);
  const uri = options.uri || MONGODB_URI;
  const db = options.database || DATABASE_NAME;

  console.log(`[${new Date().toISOString()}] Starting backup of database "${db}"...`);

  if (options.dryRun) {
    console.log(`[DRY RUN] Would run: mongodump --uri="${uri}" --db="${db}" --out="${backupPath}"`);
    return backupPath;
  }

  fs.mkdirSync(backupPath, { recursive: true });

  try {
    execSync(`mongodump --uri="${uri}" --db="${db}" --out="${backupPath}"`, {
      stdio: 'inherit',
      timeout: 300000,
    });
    console.log(`[${new Date().toISOString()}] Dump completed successfully.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] mongodump failed:`, err.message);
    throw err;
  }

  if (options.compress) {
    const archivePath = `${backupPath}.tar.gz`;
    try {
      execSync(`tar -czf "${archivePath}" -C "${path.dirname(backupPath)}" "${path.basename(backupPath)}"`, {
        stdio: 'inherit',
      });
      fs.rmSync(backupPath, { recursive: true, force: true });
      console.log(`[${new Date().toISOString()}] Compressed to: ${archivePath}`);
      return archivePath;
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Compression failed, keeping uncompressed:`, err.message);
      return backupPath;
    }
  }

  return backupPath;
}

function cleanupOldBackups(retentionDays, dryRun) {
  const backupRoot = BACKUP_DIR;
  if (!fs.existsSync(backupRoot)) return;

  console.log(`[${new Date().toISOString()}] Cleaning backups older than ${retentionDays} days...`);
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  const entries = fs.readdirSync(backupRoot);
  let removed = 0;

  for (const entry of entries) {
    const fullPath = path.join(backupRoot, entry);
    const stat = fs.statSync(fullPath);
    if (stat.mtimeMs < cutoff) {
      if (dryRun) {
        console.log(`[DRY RUN] Would remove: ${fullPath}`);
      } else {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`  Removed: ${entry}`);
      }
      removed++;
    }
  }

  console.log(`  ${removed} old backup(s) cleaned.`);
}

function main() {
  const options = parseArgs();

  try {
    createBackup(options);
    cleanupOldBackups(options.retention, options.dryRun);
    console.log(`[${new Date().toISOString()}] Backup process completed successfully.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Backup process failed:`, err.message);
    process.exit(1);
  }
}

main();
