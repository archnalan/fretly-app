import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface LoginFormProps {
  goTo: string;
}
const LoginForm: React.FC<LoginFormProps> = ({ goTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //   const navigate =

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    navigate(goTo);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 ">
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email..."
          className="w-full input input-bordered"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password..."
          className="w-full input input-bordered"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit" className="w-full btn btn-primary">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
