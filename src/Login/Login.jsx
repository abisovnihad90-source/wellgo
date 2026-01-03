import { useEffect, useState } from "react";
import DesktopComponent from "./DesktopAuth";
import MobileComponent from "./MobileAuth";

const Login = ({ onLogin }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileComponent onLogin={onLogin} /> : <DesktopComponent onLogin={onLogin} />;
};

export default Login;
