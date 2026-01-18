/**
 * Next.js Instrumentation
 * This file runs once when the Next.js server starts.
 * Used for environment validation and other startup tasks.
 */

export async function register() {
    // Only run on server
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { validateEnv } = await import('./lib/env');
        const result = validateEnv();

        if (!result.valid) {
            console.error('❌ Environment validation failed!');
            console.error(`Missing required variables: ${result.missing.join(', ')}`);

            if (process.env.NODE_ENV === 'production') {
                throw new Error('Cannot start in production with missing environment variables');
            }
        } else {
            console.log('✅ Environment variables validated');
        }
    }
}
