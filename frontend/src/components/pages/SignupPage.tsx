const SignupPage = () => {
  return (
    <div className="min-h-screen grid place-items-center">
      <form className="max-w-[500px] w-full p-2 md:p-8 rounded-xl shadow-lg bg-background-muted">
        <h1 className="form__title">Create Your Account</h1>
        <div className="form__field">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div className="form__field">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div className="form__field">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div className="form__field">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" name="confirmPassword" id="confirm-password" />
        </div>
        <button className="btn btn-primary w-full mt-8">Signup</button>
        <p className="text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-primary-600 hover:text-primary-800">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
