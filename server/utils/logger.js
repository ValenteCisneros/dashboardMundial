const format = (level, msg, meta = {}) => {
  const entry = {
    time: new Date().toISOString(),
    level,
    msg,
    ...meta,
  };
  return JSON.stringify(entry);
};

const logger = {
  info(msg, meta) {
    console.log(format('info', msg, meta));
  },
  warn(msg, meta) {
    console.warn(format('warn', msg, meta));
  },
  error(msg, meta) {
    console.error(format('error', msg, meta));
  },
};

module.exports = logger;
