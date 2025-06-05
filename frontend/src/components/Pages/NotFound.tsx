import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

    const navigate = useNavigate();

  const [page, setPage] = useState("Dashboard");

  const getrole = localStorage.getItem('role');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    if (getrole === null) {
      setPage("Home")
    }else{
      setPage("Dashboard")
    }

  }, [location.pathname]);

  const goToDashboard = () =>{
     
    if (getrole === "student") {
         navigate('/student');
      }else if (getrole === "teacher"){
        navigate('/teacher');
      }else if (getrole === "admin"){
        navigate('/admin');
      }else {
        navigate('/')
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <Button asChild onClick={goToDashboard}>
          <a>Return to {page}</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
