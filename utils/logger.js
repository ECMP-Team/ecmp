/**
 * Logger utility for consistent logging format
 */
export const Logger = {
  info: (message) => console.log(`\n📝 ${message}`),
  success: (message) => console.log(`\n✅ ${message}`),
  warning: (message) => console.log(`\n⚠️ ${message}`),
  error: (message) => console.error(`\n❌ ${message}`),
  section: (title) => {
    console.log(`\n${title}`);
    console.log("----------------------------------------");
  },
};
