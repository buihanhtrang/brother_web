// const form = document.getElementById('giftForm');

// Xử lý sự kiện gửi form
// form.addEventListener('submit', async function (event) {
//   event.preventDefault();

  // // Lấy dữ liệu từ form
  // const data = new FormData(form);
  // const name = data.get('name');
  // const age = data.get('age');
  // const budget = data.get('budget');
  // const hobby = data.get('hobby');

  // // Gợi ý quà
  // const suggestion = "Sách, phụ kiện thể thao, hoặc đồ công nghệ";

//   // ID Google Sheet và API Key
//   const SHEET_ID = "16bi8IFW5dVh9tc_l4oDYJ3l7y1OspMPQAO9w28BUed0"; // Thay bằng ID của bạn
//   const API_KEY = "AIzaSyBnWcpHK6NdCEJYCnFE2v8-seo37-Q5M7Y"; // Thay bằng API Key của bạn
//   const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

//   // Gửi dữ liệu lên Google Sheets
//   // const response = await fetch(SHEET_URL, {
//   //   method: "POST",
//   //   headers: { "Content-Type": "application/json" },
//   //   body: JSON.stringify({
//   //     values: [[name, age, budget, hobby, suggestion]]
//   //   })
//   // });

//   const response = await fetch(SHEET_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       values: [[name, age, budget, hobby, suggestion]]
//     })
//   });
  
//   if (!response.ok) {
//     const errorData = await response.json();
//     console.error("Error:", errorData);
//     alert(`Không thể lưu dữ liệu: ${errorData.error.message}`);
//   } else {
//     alert("Lưu dữ liệu thành công!");
//   }
  
//   // Hiển thị kết quả hoặc báo lỗi
//   const resultsDiv = document.getElementById('results');
//   if (response.ok) {
//     alert("Lưu dữ liệu thành công!");
//     resultsDiv.innerHTML = `
//       <p><strong>Tên:</strong> ${name}</p>
//       <p><strong>Tuổi:</strong> ${age}</p>
//       <p><strong>Ngân sách:</strong> ${budget} VND</p>
//       <p><strong>Sở thích:</strong> ${hobby}</p>
//       <p><strong>Gợi ý:</strong> ${suggestion}</p>
//     `;
//   } else {
//     alert("Đã có lỗi xảy ra!");
//     resultsDiv.innerHTML = "<p>Không thể lưu dữ liệu. Vui lòng thử lại!</p>";
//   }
// });

// Cấu hình OAuth2 Client ID và Scopes
const CLIENT_ID = '77620120608-m510ihhikvqag0e61598g7c2asjrdrse.apps.googleusercontent.com'; // Thay bằng Client ID từ Google Cloud
const API_KEY = 'AIzaSyAAvdPrQLTNNHDE_jgVwH0GrWoApFXtoTc'; // Thay bằng API Key từ Google Cloud
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const SHEET_ID = '16bi8IFW5dVh9tc_l4oDYJ3l7y1OspMPQAO9w28BUed0'; // Thay bằng ID của Google Sheets

// Tải thư viện API
function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4')
    .then(function() {
      console.log('Google Sheets API loaded');
    }, function(error) {
      console.log('Error loading Google Sheets API', error);
    });
}

// Xác thực và ghi dữ liệu
function authenticate() {
  return gapi.auth2.getAuthInstance().signIn()
    .then(function() {
      console.log('Successfully signed in');
      loadClient();
    }, function(error) {
      console.log('Error signing in', error);
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
    console.log('Data appended successfully', response);
    alert('Lưu dữ liệu thành công!');
  }, function(error) {
    console.log('Error appending data', error);
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

  authenticate().then(function() {
    appendData(name, age, budget, hobby, suggestion);
  });
});

