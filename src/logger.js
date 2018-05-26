import winston, { format, createLogger, transports } from 'winston';
const { combine, timestamp, label, printf } = format;

const formatConsoleMessage = printf(info => {
  const { timestamp, label, level, message } = info;
  return `${timestamp} ${level}: [${label}] ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:MM:SS'
    }),
    winston.format.json(),
  ),
  exitOnError: false,
  transports: [
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';

  logger.add(new transports.Console({
    format: combine(
      format.colorize(),
      timestamp({
        format: 'YYYY-MM-DD HH:MM:SS' // Optional for choosing your own timestamp format.
      }),
      formatConsoleMessage,
    ),
  }));
}


// Amend the logger with additional options for development mode (inspired by https://github.com/visionmedia/debug):
// Ability to filter by
// 1. Severity levels: e.g. LOG_LEVEL=warn
// LOG=* – Log everyting
// LOG=*,-not_this – log everything but messages labeled with 'not_this'
// LOG=app:fetch – log only messages labeled with 'app:fetch'
// LOG=app:* – Log anything that starts with 'app:'; 'app:fetch', 'app:cache', etc.
//
// 2. Namespaces: e.g. LOG=*, LOG=app:cache
// LOG_LEVEL=warn, LOG_LEVEL=error

/**
 * Check if the given severity level is enabled through an environment variable
 *
 * @param {String} level – severity level (one of 'info', 'warn', 'error')
 * @return {Boolean}
 *
 * */

const levelEnabled = (level) => {
  const setting = process.env.LOG_LEVEL;
  const levelNames = Object.keys(logger.levels);

  // Allow logging if no ENV variable specified
  if (typeof setting !== 'string') {
    return true;
  }

  return levelNames.includes(level) &&
    (logger.levels[level] <= logger.levels[setting]);
};


/**
 * Check if the given label (namespace) is enabled through an environment variable.
 * Examples:
 *
 * @oaram {String} label – label of the message
 * @return {Boolean}
 *
 * */
const labelEnabled = (label) => {
  const setting = process.env.LOG;

  // Don't allow logging when no namespaces are specified
  if (typeof setting !== 'string') {
    return false;
  }

  // Split labels string into an array and convert '*' wildcards into valid JS regex
  const labels = setting.split(',').map(label => label.replace(/\*/g, '.*?'));

  const included = labels.filter(label => label[0] !== '-');
  const skipped = labels
    .filter(label => label[0] === '-')
    .map(label => label.substring(1));

  const includedMatch = included.find(lbl => (
    new RegExp('^' + lbl + '$').test(label)
  ));

  const skippedMatch = skipped.find(lbl => (
    new RegExp('^' + lbl + '$').test(label)
  ));

  if (skippedMatch) return false;
  if (includedMatch) return true;
};


export default (label) => {
  const log = (message, label, level) => {
    if (process.env.NODE_ENV !== 'production' && (!levelEnabled(level) || !labelEnabled(label))) {
      return;
    }

    logger.log({
      level,
      message,
      label,
    });
  };

  return Object.keys(logger.levels).reduce((acc, level) => {
    acc[level] = (message) => log(message, label, level);
    return acc;
  }, {});
};

