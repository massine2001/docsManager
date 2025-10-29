import { useState } from "react";

export function useMutation<TData = unknown, TVariables = unknown>(
  mutateFn: (variables: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = async (variables: TVariables) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await mutateFn(variables);
      setData(result);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return { 
    execute, 
    data, 
    loading, 
    error, 
    success, 
    reset 
  };
}
