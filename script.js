// Cấu hình OAuth2 Client ID và Scopes
const CLIENT_ID = '77620120608-m510ihhikvqag0e61598g7c2asjrdrse.apps.googleusercontent.com'; // Thay bằng Client ID từ Google Cloud
const API_KEY = 'AIzaSyAAvdPrQLTNNHDE_jgVwH0GrWoApFXtoTc'; // Thay bằng API Key từ Google Cloud
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const SHEET_ID = '16bi8IFW5dVh9tc_l4oDYJ3l7y1OspMPQAO9w28BUed0'; // Thay bằng ID của Google Sheets

// Biến toàn cục để lưu authInstance
let authInstance;

// Khởi tạo gapi client và auth2
function loadClient() {
  gapi.load('client:auth2', function() {
    gapi.auth2.init({
      client_id: CLIENT_ID,
      cookiepolicy: 'single_host_origin'  // Thêm tham số cookiePolicy
    }).then(function(instance) {
      authInstance = instance;  // Lưu authInstance vào biến toàn cục
      console.log('Google Auth initialized');
    }).catch(function(error) {
      console.error('Error initializing Google Auth:', error);
    });
  });
}

// Xác thực người dùng
function authenticate() {
  if (!authInstance) {
    console.error('Auth instance is not initialized');
    alert("Lỗi: Không thể xác thực, vui lòng thử lại!");
    return;
  }

  // Xác thực nếu authInstance đã sẵn sàng
  authInstance.signIn().then(function() {
    console.log('Successfully signed in');
    appendData();
  }).catch(function(error) {
    console.error('Error signing in:', error);
    alert("Lỗi khi đăng nhập. Vui lòng thử lại.");
  });
}

// Gửi dữ liệu lên Google Sheets
function appendData(name, age, budget, hobby, suggestion) {
  const request = gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A1', // Phạm vi sheet (có thể thay đổi)
    valueInputOption: 'RAW',
    resource: {
      values: [
        [name, age, budget, hobby, suggestion]
      ]
    }
  });

  request.then(function(response) {
    console.log('Data appended successfully:', response);
    alert('Lưu dữ liệu thành công!');
  }, function(error) {
    console.log('Error appending data:', error);
    alert('Không thể lưu dữ liệu: ' + error.result.error.message);
  });
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

  authenticate(); // Gọi hàm authenticate để đăng nhập và gửi dữ liệu lên Google Sheets
});

// Đảm bảo client và auth2 được tải khi trang được tải
window.onload = loadClient;