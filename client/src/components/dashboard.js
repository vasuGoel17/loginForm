import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const validuser = async () => {
    let token = localStorage.getItem("userDataToken");
    const res = await fetch("/api/validuser", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();
    if (data.status === 401 || !data) {
      navigate("../*");
      console.log("user not verify");
    } else {
      console.log("user verify with status ", data.status);
    }
  };

  useEffect(() => {
    validuser();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("userDataToken");
    const res = await fetch("/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Accept: "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();
    // console.log(data);

    if (data.status == 200) {
      console.log("user logout");
      localStorage.removeItem("userDataToken");
      alert("user Logout");
      navigate("/");
    } else {
      console.log("error");
    }
  };

  return (
    <div className="dashboard">
      <h1>DashBoard</h1>
      <p>Your are successfully authenticated</p>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
