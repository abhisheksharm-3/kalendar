import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';

interface UseAuthReturnType {
    signInWithGoogle: () => Promise<void>;
    isLoading: boolean;
    error: string;
}

/**
 * Hook for handling OAuth authentication with Google.
 */
export function useAuth(): UseAuthReturnType {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const signInWithGoogle = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            await signIn('google', { callbackUrl: '/kalendar' });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        signInWithGoogle,
        isLoading,
        error,
    };
}
