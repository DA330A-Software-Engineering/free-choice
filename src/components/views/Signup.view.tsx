import { FC, useState } from 'react';
import { IAPIResponse, useAuth } from '../../contexts/AuthContext';
import Input from '../interactable/Input.cmpt';

/** Signup View */
const SignupView: FC = () => {

  const auth = useAuth();

  const [name, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

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
    <div className='authWrapper'>
      <h1>Signup View</h1>
      <form onSubmit={handleSubmit}>
        <Input inputStyle='authInput' placeholder='name..' onChange={(name: string) => SetName(name)}  />
        <Input inputStyle='authInput' placeholder='email..' onChange={(email: string) => SetEmail(email)}  />
        <Input type='password'  inputStyle='authInput' placeholder='password..' onChange={(password: string) => SetPassword(password)}  />
        <button>Signup</button>
      </form>
    </div>
  </>
  )
}

// Export the component
export default SignupView