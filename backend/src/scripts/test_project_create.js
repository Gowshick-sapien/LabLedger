import jwt from 'jsonwebtoken';

async function run() {
  const tokenRes = await fetch('http://localhost:5000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "lead@ignition.org", password: "password123" })
  });
  const dataLogin = await tokenRes.json();
  const token = dataLogin.token;

  if (!token) {
    console.log("No token:", dataLogin);
    return;
  }

  const decode = jwt.decode(token);
  console.log("Decoded Token:", decode);

  const createRes = await fetch('http://localhost:5000/projects', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: "Test Project",
      description: "testing",
      subteamId: 1, 
      projectLeadId: decode.userId
    })
  });
  const data = await createRes.text();
  console.log("Status:", createRes.status);
  console.log("Body:", data);
}
run();
