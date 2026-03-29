const http = require('http');

const data = JSON.stringify({
  email: 'admin@labledger.com',
  password: 'password123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(loginOptions, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const token = JSON.parse(body).token;
    
    // Now test PATCH /users/1/role
    const patchData = JSON.stringify({ role: 'viewer' });
    const patchOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/users/1/role',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Length': patchData.length
      }
    };
    
    const patchReq = http.request(patchOptions, res2 => {
      let b2 = '';
      res2.on('data', d => b2 += d);
      res2.on('end', () => {
        console.log(`PATCH Status: ${res2.statusCode}\nBody: ${b2}`);
      });
    });
    patchReq.write(patchData);
    patchReq.end();
  });
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
