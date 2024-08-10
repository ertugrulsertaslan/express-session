import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get("http://localhost:5000/", {
          withCredentials: true,
        });
        setMessage(response.data.message);
        setLogin(true);
      } catch (error) {
        navigate("/login");
        console.error(
          "Fetch message error:",
          error.response ? error.response.data : error.message
        );
        setMessage("Please log in");
      }
    };

    fetchMessage();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/logout", {
        withCredentials: true,
      });
      navigate("/login");
      setLogin(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <h1>{message}</h1>
      {login && <button onClick={handleLogout}>Logout</button>}
    </>
  );
}

export default App;
