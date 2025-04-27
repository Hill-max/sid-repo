const querystring = require('querystring');

const protectedHtml = `
  <h1>Welcome!</h1>
  <p>This is your secret content. 🎉</p>
`;

exports.handler = async (event) => {
  const PASSWORD = process.env.PASSWORD;
  if (!PASSWORD) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Server misconfigured' }) };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
  }

  let pw;
  try {
    const { password } = JSON.parse(event.body);
    pw = password;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Bad Request' }) };
  }

  if (pw === PASSWORD) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, html: protectedHtml })
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: 'Incorrect password.' })
    };
  }
};
