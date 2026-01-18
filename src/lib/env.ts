/**
 * Environment variable validation.
 * Validates required environment variables are present at startup.
 * Import this in your root layout or instrumentation file.
 */

const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GEMINI_API_KEY',
] as const;

const optionalEnvVars = [
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'APPWRITE_DATABASE_ID',
    'APPWRITE_COLLECTION_ID',
    'APPWRITE_KEY',
    'WEBHOOK_CALLBACK',
] as const;

interface ValidationResult {
    valid: boolean;
    missing: string[];
    warnings: string[];
}

/**
 * Validates that all required environment variables are set.
 * Logs warnings for optional variables that might be needed.
 */
export function validateEnv(): ValidationResult {
    const missing: string[] = [];
    const warnings: string[] = [];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    for (const envVar of optionalEnvVars) {
        if (!process.env[envVar]) {
            warnings.push(envVar);
        }
    }

    const valid = missing.length === 0;

    if (!valid && process.env.NODE_ENV === 'production') {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn(`Optional environment variables not set: ${warnings.join(', ')}`);
    }

    return { valid, missing, warnings };
}

/**
 * Throws an error if required environment variables are missing.
 * Call this at application startup.
 */
export function assertEnv(): void {
    const result = validateEnv();
    if (!result.valid) {
        throw new Error(
            `Missing required environment variables: ${result.missing.join(', ')}`
        );
    }
}

// Type-safe environment variable access
type RequiredEnvVar = (typeof requiredEnvVars)[number];
type OptionalEnvVar = (typeof optionalEnvVars)[number];

/**
 * Get a required environment variable with type safety.
 * Throws if the variable is not set.
 */
export function getEnv(key: RequiredEnvVar): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

/**
 * Get an optional environment variable.
 * Returns undefined if not set.
 */
export function getOptionalEnv(key: OptionalEnvVar): string | undefined {
    return process.env[key];
}
