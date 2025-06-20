import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import type { IdTokenResult } from "firebase/auth";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const tokenResult: IdTokenResult = await user.getIdTokenResult(true);

        const customClaims = tokenResult.claims as {
          role?: string;
          [key: string]: unknown;
        };

        setRole(customClaims.role ?? null);
      } else {
        setRole(null);
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
}
