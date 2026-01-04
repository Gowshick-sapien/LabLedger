import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Dashboard</div>;
}
