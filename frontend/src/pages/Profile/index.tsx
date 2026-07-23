import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  return (
    <>
      <h3 className="mb-3">Profile</h3>
      <div className="card p-4" style={{ maxWidth: 480 }}>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </>
  );
}