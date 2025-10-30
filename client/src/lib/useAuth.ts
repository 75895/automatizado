import { useEffect, useState } from "react";
import { trpc } from "./trpc";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: user } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  return { user, isLoading };
}
