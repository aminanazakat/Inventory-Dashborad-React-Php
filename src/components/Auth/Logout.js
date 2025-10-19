// src/components/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove user info from localStorage
    localStorage.removeItem("user");

    // Optional: Call backend logout endpoint (not required, but clean)
    fetch("http://localhost/ims/endpoints/auth/logout.php")
      .then(() => {
        // Redirect to login after logout
        navigate("/login", { replace: true });
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return null; // No UI needed
}
