import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardHeader, CardBody } from "../components/ui/Card";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.token);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Your account is waiting for admin approval.");
      } else {
        setError("Incorrect username or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gh-bg px-4">
      <div className="w-full max-w-sm mt-[-10vh]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gh-text tracking-tight h-8">
            <span className="text-[#a2d2ff]">Lab</span>Ledger
          </h1>
          <p className="text-gh-text-muted mt-2">Sign in to your account</p>
        </div>

        <Card className="w-full mb-4 shadow-lg border-gh-border">
          <CardHeader className="text-gh-text font-medium pb-4 border-b border-gh-border text-center">
            Sign in
          </CardHeader>
          <CardBody className="bg-gh-bg p-5 border-none">
            {error && (
              <div className="mb-4 p-3 bg-red-900/40 border border-gh-danger text-[#ff7b72] text-sm rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Username or email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-full mt-2 py-2" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <div className="text-center p-4 border border-gh-border rounded-md text-sm text-gh-text shadow-sm bg-gh-bg">
          New to LabLedger?{" "}
          <Link to="/register" className="text-gh-link hover:underline font-medium">
            Create an account.
          </Link>
        </div>
      </div>
    </div>
  );
}
