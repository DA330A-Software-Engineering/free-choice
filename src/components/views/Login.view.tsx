import { FC, useState } from 'react';
import { IAPIResponse, useAuth } from '../../contexts/AuthContext';
import Input from '../interactable/Input.cmpt';

/** Login View */
const LoginView: FC = () => {

  const auth = useAuth();

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth.login(email, password, (res: IAPIResponse) => {

    });
  };

  return (
      <>
        <div>
          <h1>Login View</h1>
          <form onSubmit={handleSubmit}>
            <Input placeholder='email..' onChange={(email: string) => SetEmail(email)}  />
            <Input placeholder='password..' onChange={(password: string) => SetPassword(password)}  />
            <button>Login</button>
          </form>
        </div>
      </>
  )
}

// Export the component
export default LoginView