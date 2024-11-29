const form = document.getElementById('giftForm');

// Xử lý sự kiện gửi form
form.addEventListener('submit', async function (event) {
  event.preventDefault();

  // Lấy dữ liệu từ form
  const data = new FormData(form);
  const name = data.get('name');
  const age = data.get('age');
  const budget = data.get('budget');
  const hobby = data.get('hobby');

  // Gợi ý quà
  const suggestion = "Sách, phụ kiện thể thao, hoặc đồ công nghệ";

  // ID Google Sheet và API Key
  const SHEET_ID = "16bi8IFW5dVh9tc_l4oDYJ3l7y1OspMPQAO9w28BUed0"; // Thay bằng ID của bạn
  const API_KEY = "AIzaSyBnWcpHK6NdCEJYCnFE2v8-seo37-Q5M7Y"; // Thay bằng API Key của bạn
  const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

  // Gửi dữ liệu lên Google Sheets
  // const response = await fetch(SHEET_URL, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     values: [[name, age, budget, hobby, suggestion]]
  //   })
  // });
  const response = await fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      values: [[name, age, budget, hobby, suggestion]]
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error:", errorData);
    alert(`Không thể lưu dữ liệu: ${errorData.error.message}`);
  } else {
    alert("Lưu dữ liệu thành công!");
  }
  
  // Hiển thị kết quả hoặc báo lỗi
  const resultsDiv = document.getElementById('results');
  if (response.ok) {
    alert("Lưu dữ liệu thành công!");
    resultsDiv.innerHTML = `
      <p><strong>Tên:</strong> ${name}</p>
      <p><strong>Tuổi:</strong> ${age}</p>
      <p><strong>Ngân sách:</strong> ${budget} VND</p>
      <p><strong>Sở thích:</strong> ${hobby}</p>
      <p><strong>Gợi ý:</strong> ${suggestion}</p>
    `;
  } else {
    alert("Đã có lỗi xảy ra!");
    resultsDiv.innerHTML = "<p>Không thể lưu dữ liệu. Vui lòng thử lại!</p>";
  }
});
