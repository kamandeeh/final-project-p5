import { useUser } from "../context/usercontext";

const Login = () => {
  return (
    <section className="login">
      <h2>Sign In</h2>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button className="button">Continue</button>
    </section>
  );
};
export default Login;
