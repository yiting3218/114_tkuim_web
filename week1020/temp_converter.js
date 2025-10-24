// temp_converter.js
// 使用 prompt 讀入溫度與單位（C/F），轉換並以 alert 與 <pre> 顯示

function toNumber(str) {
  var n = parseFloat(str);
  return isNaN(n) ? null : n;
}

var unit = prompt('請輸入單位（C 或 F）：');
var text = '';

if (!unit) {
  text = '未輸入單位。';
} else {
  unit = unit.trim().toUpperCase();
  var tempStr = prompt('請輸入溫度數值：');
  var t = toNumber(tempStr);

  if (t === null) {
    text = '溫度數值輸入錯誤。';
  } else if (unit === 'C') {
    var f = t * 9 / 5 + 32;
    text = '輸入：' + t + ' °C\n轉換：' + f.toFixed(2) + ' °F';
    alert(text);
  } else if (unit === 'F') {
    var c = (t - 32) * 5 / 9;
    text = '輸入：' + t + ' °F\n轉換：' + c.toFixed(2) + ' °C';
    alert(text);
  } else {
    text = '單位需為 C 或 F。';
  }
}

document.getElementById('result').textContent = text;
console.log(text);
