
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6 py-16 bg-white rounded-lg shadow-sm max-w-md">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-inventory-blue hover:bg-inventory-blue-700"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
