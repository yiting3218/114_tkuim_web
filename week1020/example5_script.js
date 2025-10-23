// example5_script.js
// 延伸練習：讓使用者輸入要顯示的乘法範圍（例如 2 到 5）

// 取得使用者輸入範圍
var start = prompt('請輸入起始數（1～9）：');
var end = prompt('請輸入結束數（1～9）：');

// 轉為數字
var startNum = parseInt(start, 10);
var endNum = parseInt(end, 10);
var output = '';

// 檢查輸入是否有效
if (isNaN(startNum) || isNaN(endNum) || startNum < 1 || endNum > 9 || startNum > endNum) {
  output = '輸入範圍錯誤！請輸入 1～9 之間，且起始 ≤ 結束。';
} else {
  // 以巢狀 for 產生指定範圍的乘法表
  for (var i = startNum; i <= endNum; i++) {
    for (var j = 1; j <= 9; j++) {
      output += i + 'x' + j + '=' + (i * j) + '\t';
    }
    output += '\n';
  }
}

document.getElementById('result').textContent = output;
