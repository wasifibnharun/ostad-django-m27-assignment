// [REQ-22] a logger exporting logInfo, logWarn, logError. Every entry includes a timestamp and context label.
export const logInfo = (context, message) => {
  console.log(`[INFO] [${new Date().toISOString()}] [${context}]`, message);
};

export const logWarn = (context, message) => {
  console.warn(`[WARN] [${new Date().toISOString()}] [${context}]`, message);
};

export const logError = (context, error) => {
  console.error(`[ERROR] [${new Date().toISOString()}] [${context}]`, error);
};