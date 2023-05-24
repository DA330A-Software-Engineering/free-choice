import { FC, useState } from "react";
import { IAPIResponse, useAuth } from "../../contexts/AuthContext";
import Input from "../interactable/Input.cmpt";
import OnScreenKeyboard from "../utils/OnScreenKeyBoard.util";

/** Login View */
const LoginView: FC = () => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleEmailInputChange = (input: string) => {
    setEmail(input);
  };

  const handlePasswordInputChange = (input: string) => {
    setPassword(input);
  };

  const handleEmailInputFocus = () => {
    setEmailFocused(true);
    setPasswordFocused(false);
  };

  const handlePasswordInputFocus = () => {
    setEmailFocused(false);
    setPasswordFocused(true);
  };

  const handleInputBlur = () => {
    setEmailFocused(false);
    setPasswordFocused(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth.login(email, password, (res: IAPIResponse) => {
      if (res.msg !== undefined) {
        alert(res.msg);
      }
    });
  };

  return (
    <>
      <div className="authWrapper">
        <h1>Login View</h1>
        <form onSubmit={handleSubmit}>
          <Input
            inputStyle="authInput"
            placeholder="email.."
            value={email}
            onFocus={handleEmailInputFocus}
            onChange={handleEmailInputChange}
          />
          <Input
            type="password"
            inputStyle="authInput"
            placeholder="password.."
            value={password}
            onFocus={handlePasswordInputFocus}
            onChange={handlePasswordInputChange}
          />
          <button>Login</button>
        </form>
      </div>
      {(emailFocused || passwordFocused) && (
        <div className="keyboardContainer">
          <OnScreenKeyboard
            onInput={
              emailFocused ? handleEmailInputChange : handlePasswordInputChange
            }
            onBlur={handleInputBlur}
            inputValue={emailFocused ? email : password}
          />
        </div>
      )}
    </>
  );
};

export default LoginView;
