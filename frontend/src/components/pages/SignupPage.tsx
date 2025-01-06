import { Link } from "react-router-dom";
import React, { useState } from "react";
import useSignup from "@/hooks/useSignup";

const SignupPage = () => {
  return (
    <div className="min-h-screen grid place-items-center">
      <SignupForm />
    </div>
  );
};

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const { mutate, isPending, error } = useSignup();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ username, email, password, confirmPassword: confirm });
  };
  return (
    <form
      className="max-w-[500px] w-full p-4 md:p-8 rounded-xl shadow-lg bg-background-muted"
      onSubmit={handleSubmit}
    >
      <h1 className="form__title">Create Your Account</h1>
      <div className="form__field">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form__field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form__field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form__field">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirm-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      <button className="btn btn-primary w-full mt-8" disabled={isPending}>
        Signup
      </button>
      {error && <p>{error.message}</p>}
      <p className="text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-600 hover:text-primary-800">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupPage;
