const LoginPage = () => {
  return (
    <div className="min-h-screen grid place-items-center">
      <form className="max-w-[500px] w-full p-2 md:p-8 rounded-xl shadow-lg bg-background-muted">
        <h1 className="form__title">Login to Your Account</h1>
        <div className="form__field">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div className="form__field">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <button className="btn btn-primary text-background-muted dark:text-white w-full mt-8">
          Login
        </button>
        <p className="text-center mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:text-primary-800">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
