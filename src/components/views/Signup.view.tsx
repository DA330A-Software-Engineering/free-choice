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

    });
  };

  return (
    <>
    <div>
      <h1>Signup View</h1>
      <form onSubmit={handleSubmit}>
        <Input placeholder='name..' onChange={(name: string) => SetName(name)}  />
        <Input placeholder='email..' onChange={(email: string) => SetEmail(email)}  />
        <Input placeholder='password..' onChange={(password: string) => SetPassword(password)}  />
        <button>Signup</button>
      </form>
    </div>
  </>
  )
}

// Export the component
export default SignupView