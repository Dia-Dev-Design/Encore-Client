import React, { useState, ChangeEvent, useEffect } from "react";
import { validateEmail, validatePassword } from "utils/userValidations";
import LogoImage from "assets/images/BigLogo.png";
import GoogleLogoImage from "assets/icons/GoogleLogo.png";
import ShowPasswordIcon from "assets/icons/StatusOn.svg";
import HidePasswordIcon from "assets/icons/StatusOff.svg";
import * as S from "./styles";
import { useNavigate } from "react-router-dom";
import { serverURL } from "utils/constants";
import {
  cleanlocalStorage,
  getLocalItem,
  setLocalItemWithExpiry,
} from "helper/localStorage.helper";
import { Company, User } from "utils/interfaces";
import { appRoute } from "consts/routes.const";
import { Connection } from "interfaces/login/connection.interface";
import { UserType } from "interfaces/login/userType.enum";
import { useAuth } from "../../context/auth.context";
import { useParams } from "react-router-dom";
import { useQueryParams } from "helper/query.helper";

const getApiUrl = (path: string) => {
  const base = process.env.REACT_APP_API_BASE_URL || "";
  const formattedBase = base.endsWith("/") ? base : `${base}/`;
  return `${formattedBase}api/${path.replace(/^api\//, "")}`;
};

interface LoginProps {
  adminLogin?: boolean;
}

const Login: React.FC<LoginProps> = ({ adminLogin }) => {
  console.log("This is login isAdmin props", adminLogin);
  const { storeToken, authenticateUser, setIsAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");

  const params = useQueryParams()

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setEmailErrorMessage(emailError);
    setPasswordErrorMessage(passwordError);
    setGeneralErrorMessage("");

    return !emailError && !passwordError;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setGeneralErrorMessage("");

    const url = adminLogin
      ? getApiUrl("auth/admin/login")
      : getApiUrl("auth/login");

    console.log("This is the apiUrl", url)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      // console.log('this is data after .json------->', data.isAdmin)

      if (data.isAdmin) {
        setIsAdmin(true)
      }

      if (response.ok) {
        const token = data.accessToken;
        console.log("This is data on succesful response++++++++>", data);
        // Store the token in localStorage via AuthContext
        storeToken(token);

        // Additional connection info if needed
        let connectionToken: Connection = {
          token: token,
          userType: adminLogin ? UserType.admin : UserType.client,
          // isAdmin
        };

        // console.log("This is the connection Token----->", )

        setLocalItemWithExpiry(
          "connection",
          JSON.stringify(connectionToken),
          rememberMe ? 5 : 2
        );

        setTimeout(() => {
          authenticateUser();
        }, 700);

        if (adminLogin) {
          navigate(appRoute.admin.dashboard);
        }
      }
      if (data.error) {
        handleLoginError(data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setGeneralErrorMessage("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (message: string = "") => {
    switch (message) {
      case "User not found":
        setEmailErrorMessage("User not found");
        break;
      case "Invalid password":
        setPasswordErrorMessage("Invalid password");
        break;
      default:
        setGeneralErrorMessage(message || "Login failed. Please try again.");
        break;
    }
  };

  const handleRedirectToRegister = () => {
    navigate(appRoute.clients.register);
  };

  const handleRedirectToForgotPassword = () => {
    navigate(appRoute.generic.forgotPassword);
  };

  // const handleLoginWithGoogle = () => {
  //   setIsLoading(true);
  //   setGeneralErrorMessage("");

  //   // Configure popup features for better compatibility
  //   const width = 500;
  //   const height = 600;
  //   const left = window.screenX + (window.outerWidth - width) / 2;
  //   const top = window.screenY + (window.outerHeight - height) / 2;
  //   const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

  //   // Open the OAuth popup
  //   const popup = window.open(
  //     getApiUrl("auth/google"),
  //     "googleAuthPopup",
  //     features
  //   );

  //   if (!popup) {
  //     setGeneralErrorMessage(
  //       "Popup was blocked. Please allow popups for this site."
  //     );
  //     setIsLoading(false);
  //     return;
  //   }

  //   // Set timeout to prevent indefinite loading if user abandons the popup
  //   const timeout = setTimeout(() => {
  //     if (popup && !popup.closed) {
  //       popup.close();
  //     }
  //     setGeneralErrorMessage("Authentication timed out. Please try again.");
  //     setIsLoading(false);
  //   }, 120000); // 2 minute timeout

  //   // Check periodically if popup was closed without completing auth
  //   const checkClosed = setInterval(() => {
  //     if (popup && popup.closed) {
  //       clearInterval(checkClosed);
  //       clearTimeout(timeout);
  //       // Only show error if we're still loading (no successful auth)
  //       if (isLoading) {
  //         setGeneralErrorMessage("Authentication was cancelled.");
  //         setIsLoading(false);
  //       }
  //     }
  //   }, 1000);
  // };

  useEffect(() => {
    if (adminLogin) {
      setIsAdmin(adminLogin)
    }
  }, []);

  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      const apiOrigin = new URL(process.env.REACT_APP_API_BASE_URL || "")
        .origin;
      if (event.origin !== apiOrigin) return;

      try {
        if (event.data && event.data.token) {
          const token = event.data.token;

          storeToken(token);

          const connectionToken: Connection = {
            token: token,
            userType: UserType.client,
          };

          // authenticateUser();
        }
      } catch (error) {
        console.error("Error processing auth message:", error);
        setGeneralErrorMessage("Authentication failed. Please try again.");
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleAuthMessage);

    console.log("This is apiUrl ======>", params)

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [MessageEvent]);

  return (
    <S.Container>
      <S.LeftContainer>
        <S.Image src={LogoImage} alt="Logo" />
      </S.LeftContainer>
      <S.RightContainer>
        <S.LoginTitle>Log in</S.LoginTitle>
        <S.Subtitle>Enter your email and password to login</S.Subtitle>
        <S.Form>
          <S.FormGroup>
            <S.Label htmlFor="email">
              Email <span className="required">*</span>
            </S.Label>
            <S.Input
              hasErrors={!!emailErrorMessage}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {emailErrorMessage && (
              <S.ErrorLabel htmlFor="email">{emailErrorMessage}</S.ErrorLabel>
            )}
          </S.FormGroup>
          <S.FormGroup>
            <S.Label htmlFor="password">
              Password <span className="required">*</span>
            </S.Label>
            <S.PasswordContainer>
              <S.Input
                hasErrors={!!passwordErrorMessage}
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <S.ToggleIcon
                src={showPassword ? HidePasswordIcon : ShowPasswordIcon}
                onClick={() => setShowPassword(!showPassword)}
              />
            </S.PasswordContainer>
            {passwordErrorMessage && (
              <S.ErrorLabel htmlFor="password">
                {passwordErrorMessage}
              </S.ErrorLabel>
            )}
            <S.RememberSection>
              <S.RememberMe>
                <S.Checkbox
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  disabled={isLoading}
                />
                <S.ForgotPassword>Remember Me</S.ForgotPassword>
              </S.RememberMe>
              <S.LabelButton
                onClick={handleRedirectToForgotPassword}
                disabled={isLoading}
              >
                Forgot Password?
              </S.LabelButton>
            </S.RememberSection>
          </S.FormGroup>
          <S.Button onClick={() => handleSubmit()} disabled={isLoading}>
            Log In
          </S.Button>
        </S.Form>
        {!adminLogin && (
          <>
            {/* <S.Separator>&nbsp; Or sign up with &nbsp;</S.Separator> */}
            {/* <S.GoogleButton
              onClick={handleLoginWithGoogle}
              disabled={isLoading}
            >
              <S.GoogleIcon src={GoogleLogoImage} alt="Google" />
              <span>Google</span>
            </S.GoogleButton> */}
            <S.RegisterContainer>
              <S.Label>Don't have an account?</S.Label>
              <S.LabelButton
                onClick={handleRedirectToRegister}
                disabled={isLoading}
              >
                Sign Up
              </S.LabelButton>
            </S.RegisterContainer>
          </>
        )}
      </S.RightContainer>
    </S.Container>
  );
};

export default Login;
