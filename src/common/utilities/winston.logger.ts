import { Logger, createLogger, format, transports } from 'winston';

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const { json, simple, combine, timestamp, label, printf } = format;

const myFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} || [${label}] || ${level}: ${message}`,
);

export let winstonLogger: Logger | undefined = undefined;

export const initWinston = (apiTitle: string, data: string) => {
  const logger = createLogger({
    level: 'debug',
    levels: logLevels,
    format: combine(
      label({ label: `tracking action: ${data}` }),
      timestamp(),
      json(),
      myFormat,
    ),
    defaultMeta: { service: apiTitle },
    transports: [
      new transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new transports.File({ filename: 'logs/combined.log' }),
    ],
    exceptionHandlers: [
      new transports.Console({
        format: simple(),
      }),
      new transports.File({ filename: 'logs/exceptions.log' }),
    ],
    rejectionHandlers: [
      new transports.Console({
        format: simple(),
      }),
      new transports.File({ filename: 'logs/rejections.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        format: simple(),
      }),
    );
  }
  winstonLogger = logger;
};
