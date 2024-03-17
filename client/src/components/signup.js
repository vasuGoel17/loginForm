import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormData from "form-data";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const defaultTheme = createTheme();

export default function Signup() {
  let navigate = useNavigate();

  const [validAll, setValidAll] = useState(true);
  const [valid, setValid] = useState({
    length: 0,
    specialChar: false,
    capLetter: false,
    num: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setValues((values) => ({ ...values, password: newPassword }));

    // Update validAll state based on password validation
    setValidAll(
      newPassword.length >= 8 &&
        /[A-Z]/.test(newPassword) &&
        /[0-9]/.test(newPassword) &&
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword)
    );

    // Update valid object for individual validations
    setValid({
      length: newPassword.length,
      capLetter: /[A-Z]/.test(newPassword),
      num: /[0-9]/.test(newPassword),
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        convertToJPEGAndUpload(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToJPEGAndUpload = (imageDataUrl) => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = imageDataUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const jpegImageDataUrl = canvas.toDataURL("image/jpeg");

      setSelectedImage(dataURItoBlob(jpegImageDataUrl));
    };
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("values: ", values);
    if (
      values.username !== "" &&
      values.email !== "" &&
      valid.length >= 8 &&
      valid.specialChar &&
      valid.capLetter &&
      valid.num
    ) {
      const { username, email, password } = values;

      const formData = new FormData();
      formData.append("profilePhoto", selectedImage, `${username}.jpg`);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch("/api/signup", {
        method: "post",
        body: formData,
      });

      const data = await res.json();
      //   console.log("status: ", res.status);

      if (res.status === 200) {
        // console.log(data);
        alert("Sign up is successful");
        let path = "../";
        navigate(path);
      } else {
        // console.log(data);
        alert(data);
      }
    } else {
      alert(
        "Please fill in all required fields and ensure password meets criteria."
      );
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Box sx={{ mt: 0 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                onChange={handleChange}
                sx={{ bgcolor: "white" }}
                autoComplete="username"
                autoFocus
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="profilePhoto"
                type="file"
                sx={{ bgcolor: "white" }}
                inputProps={{ accept: "image/*" }}
                onChange={handleImageChange}
                id={selectedImage === "" ? "transparent" : "color"}
                label=""
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                onChange={handleChange}
                sx={{ bgcolor: "white" }}
                name="email"
                autoComplete="email"
              />

              <div className="">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChangePassword}
                  sx={{ bgcolor: "white" }}
                  id="password"
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {validAll ? (
                  <></>
                ) : (
                  <div className="">
                    <div className="validate">
                      {valid.capLetter ? (
                        <CheckCircleIcon />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )}
                      <p>must include atleast one capital letter character</p>
                    </div>
                    <div className="validate">
                      {valid.specialChar ? (
                        <CheckCircleIcon />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )}
                      <p>must include atleast one special character</p>
                    </div>
                    <div className="validate">
                      {valid.num ? (
                        <CheckCircleIcon />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )}
                      <p>must include atleast one number</p>
                    </div>
                    <div className="validate">
                      {valid.length > 8 ? (
                        <CheckCircleIcon />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )}
                      <p>password must be strong (greater than eight)</p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid className="middle">
                <Grid item>
                  <Link href="/" variant="body2">
                    {"Already have an account? Log In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
