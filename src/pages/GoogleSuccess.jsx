import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleSuccess() {

  const navigate = useNavigate();

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const id = params.get("id");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {

      // Save token
      localStorage.setItem("token", token);

      // Save user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          id,
          name,
          email
        })
      );

      navigate("/dashboard", { replace: true });

    } 
    else if (localStorage.getItem("token")) {

      navigate("/dashboard", { replace: true });

    } 
    else {

      navigate("/", { replace: true });

    }

  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      Logging you in with Google...
    </div>
  );
}

export default GoogleSuccess;