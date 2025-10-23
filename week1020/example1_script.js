// example1_script.js
// 傳統語法：var + function + alert()

// 顯示提示窗
alert('歡迎來到 JavaScript！');

// 在 Console 顯示訊息
console.log('Hello JavaScript from console');

// 在頁面指定區域輸出文字
var el = document.getElementById('result');
el.textContent = '這行文字是由外部 JS 檔案寫入的。\n412637786 蔡依廷';

// 綁定按鈕點擊事件
var btn = document.getElementById('showMsgBtn');
btn.addEventListener('click', function() {
  alert('嘻嘻。');
});
