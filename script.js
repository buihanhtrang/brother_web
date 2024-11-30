// Cấu hình OAuth2 Client ID và Scopes
const CLIENT_ID = '77620120608-m510ihhikvqag0e61598g7c2asjrdrse.apps.googleusercontent.com'; // Thay bằng Client ID từ Google Cloud
const API_KEY = 'AIzaSyAAvdPrQLTNNHDE_jgVwH0GrWoApFXtoTc'; // Thay bằng API Key từ Google Cloud
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const SHEET_ID = '16bi8IFW5dVh9tc_l4oDYJ3l7y1OspMPQAO9w28BUed0'; // Thay bằng ID của Google Sheets

let accessToken = null;

// Khởi tạo Google Identity Services
function initGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse, // Callback khi người dùng nhấn nút đăng nhập
  });

  // Hiển thị nút đăng nhập
  google.accounts.id.renderButton(
    document.getElementById('googleSignInButton'),
    { theme: 'outline', size: 'large' } // Cấu hình nút
  );

  // Hiển thị nhắc nhở đăng nhập nếu cần
  google.accounts.id.prompt();
}

// Xử lý phản hồi đăng nhập
function handleCredentialResponse(response) {
  console.log('ID Token:', response.credential);
  alert('Đăng nhập thành công!');
}

// Khởi tạo Google Sign-In khi trang được tải
window.onload = initGoogleSignIn;

// Lấy Access Token
async function fetchAccessToken(idToken) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: 'YOUR_CLIENT_SECRET', // Thay bằng Client Secret từ Google Cloud
        grant_type: 'authorization_code',
        redirect_uri: 'postmessage',
        code: idToken,
      }),
    });
    const data = await response.json();
    accessToken = data.access_token;
    console.log('Access Token:', accessToken);
  } catch (error) {
    console.error('Error fetching access token:', error);
    alert('Không thể xác thực. Vui lòng thử lại!');
  }
}

// Gửi dữ liệu lên Google Sheets
async function appendData(name, age, budget, hobby, suggestion) {
  if (!accessToken) {
    alert('Bạn cần đăng nhập để tiếp tục.');
    return;
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`;
  const body = {
    values: [[name, age, budget, hobby, suggestion]],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      console.log('Data appended successfully');
      alert('Lưu dữ liệu thành công!');
    } else {
      const errorData = await response.json();
      console.error('Error appending data:', errorData);
      alert('Không thể lưu dữ liệu: ' + errorData.error.message);
    }
  } catch (error) {
    console.error('Error appending data:', error);
    alert('Đã xảy ra lỗi khi lưu dữ liệu.');
  }
}

// Khi submit form
document.getElementById('giftForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const name = data.get('name');
  const age = data.get('age');
  const budget = data.get('budget');
  const hobby = data.get('hobby');
  const suggestion = "Sách, phụ kiện thể thao, hoặc đồ công nghệ";

  appendData(name, age, budget, hobby, suggestion);
});

// Khởi chạy khi tải trang
window.onload = initGoogleSignIn;