"use client";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { FcGoogle } from "react-icons/fc";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toast, useToast } from "@/utils/toast";
import { resolve } from "url";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { selectIsSignin, selectSession } from "@/lib/features/auth/auth.slice";
import { login } from "@/lib/features/auth/auth.thunk";
import Loading from "../loading/loading";
import LoadingFull from "../loading/loading.full";
import { unwrapResult } from "@reduxjs/toolkit";

const AuthSignIn = (props: any) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Mặc định về trang chủ nếu không có callbackUrl

  const router = useRouter();

  const session = useAppSelector(selectSession);

  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    setIsErrorUsername(false);
    setIsErrorPassword(false);
    setErrorUsername("");
    setErrorPassword("");

    if (!username) {
      setIsErrorUsername(true);
      setErrorUsername("Username is not empty.");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassword("Password is not empty.");
      return;
    }

    try {
      const resultAction = await dispatch(login({ username, password }));
      const sessionData = unwrapResult(resultAction); // sessionData = { access_token, ... }

      // lưu thủ công nếu cần:
      localStorage.setItem("session", JSON.stringify(sessionData));

      router.push(callbackUrl || "/"); // điều hướng ngay lập tức
    } catch (error) {
      console.error("Login failed", error);
      // show toast or error
    }
  };

  return (
    <div>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={4}
          sx={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <div style={{ margin: "30px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {/* <Link href={"/"}>
                {" "}
                <StarBorderIcon
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      color: "yellow",
                      textShadow: "0 0 10px yellow",
                      fontSize: "4rem",
                      transition: "ease",
                    },
                  }}
                  color={"primary"}
                  fontSize={"large"}
                />
              </Link> */}
              <div className="group relative flex justify-center items-center text-zinc-600 text-sm font-bold">
                <div className="absolute opacity-0 0 group-hover:-translate-y-[150%] -translate-y-[300%] duration-500 group-hover:delay-500 skew-y-[20deg] group-hover:skew-y-0 shadow-md">
                  <div className="bg-lime-200 flex items-center gap-1 p-2 rounded-md">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      height="20px"
                      width="20px"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-zinc-600"
                    >
                      <circle
                        strokeLinejoin="round"
                        r="9"
                        cy="12"
                        cx="12"
                      ></circle>
                      <path
                        strokeLinejoin="round"
                        d="M12 3C12 3 8.5 6 8.5 12C8.5 18 12 21 12 21"
                      ></path>
                      <path
                        strokeLinejoin="round"
                        d="M12 3C12 3 15.5 6 15.5 12C15.5 18 12 21 12 21"
                      ></path>
                      <path strokeLinejoin="round" d="M3 12H21"></path>
                      <path strokeLinejoin="round" d="M19.5 7.5H4.5"></path>
                      <g filter="url(#filter0_d_15_556)">
                        <path strokeLinejoin="round" d="M19.5 16.5H4.5"></path>
                      </g>
                      <defs>
                        <filter
                          colorInterpolationFilters="sRGB"
                          filterUnits="userSpaceOnUse"
                          height="3"
                          width="17"
                          y="16"
                          x="3.5"
                          id="filter0_d_15_556"
                        >
                          <feFlood
                            result="BackgroundImageFix"
                            floodOpacity="0"
                          ></feFlood>
                          <feColorMatrix
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            type="matrix"
                            in="SourceAlpha"
                          ></feColorMatrix>
                          <feOffset dy="1"></feOffset>
                          <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                          <feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                            type="matrix"
                          ></feColorMatrix>
                          <feBlend
                            result="effect1_dropShadow_15_556"
                            in2="BackgroundImageFix"
                            mode="normal"
                          ></feBlend>
                          <feBlend
                            result="shape"
                            in2="effect1_dropShadow_15_556"
                            in="SourceGraphic"
                            mode="normal"
                          ></feBlend>
                        </filter>
                      </defs>
                    </svg>
                    <span>http://localhost:3000</span>
                  </div>
                  <div className="shadow-md bg-lime-200 absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"></div>
                  <div className="rounded-md bg-white group-hover:opacity-0 group-hover:scale-[115%] group-hover:delay-700 duration-500 w-full h-full absolute top-0 left-0">
                    <div className="border-b border-r border-white bg-white absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"></div>
                  </div>
                </div>

                <div className="shadow-md flex items-center group-hover:gap-2 bg-gradient-to-br from-lime-200 to-yellow-200 p-3 rounded-full cursor-pointer duration-300">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    height="20px"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-zinc-600"
                  >
                    <path
                      strokeLinejoin="round"
                      d="M15.4306 7.70172C7.55045 7.99826 3.43929 15.232 2.17021 19.3956C2.07701 19.7014 2.31139 20 2.63107 20C2.82491 20 3.0008 19.8828 3.08334 19.7074C6.04179 13.4211 12.7066 12.3152 15.514 12.5639C15.7583 12.5856 15.9333 12.7956 15.9333 13.0409V15.1247C15.9333 15.5667 16.4648 15.7913 16.7818 15.4833L20.6976 11.6784C20.8723 11.5087 20.8993 11.2378 20.7615 11.037L16.8456 5.32965C16.5677 4.92457 15.9333 5.12126 15.9333 5.61253V7.19231C15.9333 7.46845 15.7065 7.69133 15.4306 7.70172Z"
                    ></path>
                  </svg>
                  <a
                    href="http://localhost:3000"
                    className="text-[0px] group-hover:text-sm duration-300"
                  >
                    Back our Website
                  </a>
                </div>
              </div>

              <Typography
                sx={{ margin: "1rem 0", fontSize: "1.5rem" }}
                component="h1"
              >
                Sign In to Render
              </Typography>
            </Box>

            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",

                  //   "&.Mui-focused fieldset": {
                  //     borderColor: "black",
                  //   },
                  // },
                  // "& .MuiInputLabel-root": {
                  //   "&.Mui-focused": {
                  //     color: "black",
                  //   },
                },
              }}
              onFocus={() => {}}
              onChange={(event) => setUsername(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoFocus
              error={isErrorUsername}
              helperText={errorUsername}
            />
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                },
              }}
              onFocus={() => {}}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              onChange={(event) => setPassword(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              error={isErrorPassword}
              helperText={errorPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword === false ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              sx={{
                borderRadius: "25px",
                my: 3,
                color: "black",
                backgroundColor: "white",
                ":hover": {
                  color: "white",
                  backgroundColor: "black",
                },
                padding: "1rem",
              }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Divider>Or </Divider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                mt: 3,
              }}
            >
              {/* <Box
                onClick={() =>
                  signIn("github", {
                    callbackUrl: `http://localhost:3000${callbackUrl}`,
                  })
                }
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid black",
                  padding: "0.5rem 2rem",
                  gap: "0.5rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  ":hover": {
                    background: "black",
                    color: "white",
                    "& .MuiAvatar-root": {
                      bgcolor: "white",
                      color: "black", // Thay đổi màu của icon nếu cần
                    },
                  },
                }}
              >
                <Avatar
                  sx={{
                    cursor: "pointer",
                    bgcolor: "black",
                  }}
                >
                  <GitHubIcon titleAccess="Login with Github" />
                </Avatar>
                <span>Github</span>
              </Box> */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid black",
                  padding: "0.5rem 2rem",
                  gap: "0.5rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  ":hover": {
                    background: "black",
                    color: "white",
                    "& .MuiAvatar-root": {
                      bgcolor: "white",
                      color: "black", // Thay đổi màu của icon nếu cần
                    },
                  },
                }}
              >
                <Avatar
                  sx={{
                    cursor: "pointer",
                    bgcolor: "black",
                  }}
                >
                  <FcGoogle title="Login with Google" />
                </Avatar>
                <span>Google</span>
              </Box>
            </Box>
          </div>
        </Grid>
      </Grid>
      {/* {isSignin && <LoadingFull />}; */}
    </div>
  );
};

export default AuthSignIn;
