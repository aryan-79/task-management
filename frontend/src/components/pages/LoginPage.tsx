import { useLogin } from "@/hooks/useLogin";
import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen grid place-items-center">
      <LoginForm />
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ email, password });
  };
  return (
    <form
      className="max-w-[500px] w-full p-4 md:p-8 rounded-xl shadow-lg bg-background-muted"
      onSubmit={handleSubmit}
    >
      <h1 className="form__title">Login to Your Account</h1>
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
      <button
        className="btn btn-primary text-background-muted dark:text-white w-full mt-8"
        disabled={isPending}
      >
        Login
      </button>
      <p className="text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:text-blue-300">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginPage;
