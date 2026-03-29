import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerUser(name, email, password);
      setSuccess("Registration complete! Waiting for admin approval.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gh-bg px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gh-text tracking-tight h-8">
            <span className="text-[#a2d2ff]">Lab</span>Ledger
          </h1>
          <p className="text-gh-text-muted mt-2">Sign up for an account</p>
        </div>

        <Card className="shadow-lg mb-4">
          <CardHeader className="text-gh-text font-medium pb-4 border-b border-gh-border text-center">
            Register
          </CardHeader>
          <CardBody className="p-6 bg-gh-bg border-none">
            {error && (
              <div className="mb-4 p-3 bg-red-900/40 border border-gh-danger text-gh-danger rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-900/40 border border-gh-green text-gh-text rounded-md text-sm">
                {success}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@lab.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading || !!success}>
                {loading ? "Registering..." : "Create account"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <div className="text-center p-4 border border-gh-border rounded-md text-sm text-gh-text shadow-sm bg-gh-bg">
          Already have an account?{" "}
          <Link to="/login" className="text-gh-link hover:underline font-medium">
            Sign in.
          </Link>
        </div>
      </div>
    </div>
  );
}
