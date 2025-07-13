import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authenticated = localStorage.getItem("admin_authenticated");
    const session = localStorage.getItem("admin_session");
    
    if (authenticated === "true" && session) {
      const sessionTime = parseInt(session);
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      
      if (currentTime - sessionTime < sessionDuration) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        logout();
      }
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_session");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
    checkAuth,
  };
};