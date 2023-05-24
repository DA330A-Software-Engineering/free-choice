import { FC, useState } from "react";
import { IAPIResponse, useAuth } from "../../contexts/AuthContext";
import Input from "../interactable/Input.cmpt";
import OnScreenKeyboard from "../utils/OnScreenKeyBoard.util";

/** Signup View */
const SignupView: FC = () => {
  const auth = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (input: string) => {
      setter(input);
    };

  const handleInputFocus =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setNameFocused(false);
      setEmailFocused(false);
      setPasswordFocused(false);
      setter(true);
    };

  const handleInputBlur = () => {
    setNameFocused(false);
    setEmailFocused(false);
    setPasswordFocused(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth.signup(name, email, password, (res: IAPIResponse) => {
      if (res.msg !== undefined) {
        alert(res.msg);
      }
    });
  };

  return (
    <>
      <div className="authWrapper">
        <h1>Signup</h1>
        <form onSubmit={handleSubmit}>
          <Input
            inputStyle="authInput"
            placeholder="name.."
            value={name}
            onFocus={handleInputFocus(setNameFocused)}
            onChange={handleInputChange(setName)}
          />
          <Input
            inputStyle="authInput"
            placeholder="email.."
            value={email}
            onFocus={handleInputFocus(setEmailFocused)}
            onChange={handleInputChange(setEmail)}
          />
          <Input
            type="password"
            inputStyle="authInput"
            placeholder="password.."
            value={password}
            onFocus={handleInputFocus(setPasswordFocused)}
            onChange={handleInputChange(setPassword)}
          />
          <button>Signup</button>
        </form>
      </div>
      {(nameFocused || emailFocused || passwordFocused) && (
        <div className="keyboardContainer">
          <OnScreenKeyboard
            onInput={
              nameFocused
                ? handleInputChange(setName)
                : emailFocused
                ? handleInputChange(setEmail)
                : handleInputChange(setPassword)
            }
            onBlur={handleInputBlur}
            inputValue={nameFocused ? name : emailFocused ? email : password}
          />
        </div>
      )}
    </>
  );
};

// Export the component
export default SignupView;
