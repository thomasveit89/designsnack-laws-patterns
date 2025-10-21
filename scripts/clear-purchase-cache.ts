import { storage } from '../src/lib/storage';

console.log('🧹 Clearing purchase and banner cache...\n');

// Keys to clear
const PURCHASE_KEY = 'premium_purchased';
const DEV_MODE_KEY = 'dev_mode_premium';
const BANNER_DISMISSED_KEY = 'premium_banner_dismissed';

// Check current values
console.log('Current values:');
console.log(`  ${PURCHASE_KEY}: ${storage.getBoolean(PURCHASE_KEY)}`);
console.log(`  ${DEV_MODE_KEY}: ${storage.getBoolean(DEV_MODE_KEY)}`);
console.log(`  ${BANNER_DISMISSED_KEY}: ${storage.getBoolean(BANNER_DISMISSED_KEY)}`);

// Clear them
storage.delete(PURCHASE_KEY);
storage.delete(DEV_MODE_KEY);
storage.delete(BANNER_DISMISSED_KEY);

console.log('\n✅ Cache cleared!');
console.log('\nNew values:');
console.log(`  ${PURCHASE_KEY}: ${storage.getBoolean(PURCHASE_KEY)}`);
console.log(`  ${DEV_MODE_KEY}: ${storage.getBoolean(DEV_MODE_KEY)}`);
console.log(`  ${BANNER_DISMISSED_KEY}: ${storage.getBoolean(BANNER_DISMISSED_KEY)}`);
console.log('\n🔄 Restart the app to see changes.');
