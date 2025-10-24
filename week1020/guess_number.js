// guess_number.js
// 穩定版：持續提示，直到猜中或取消
// 避免與 window.history 撞名，使用 guesses 作為紀錄陣列
function rand1to100() {
  return Math.floor(Math.random() * 100) + 1;
}
function toInt(str) {
  var n = parseInt(str, 10);
  return Number.isInteger(n) ? n : null;
}

var target = rand1to100();
var tries = 0;
var guesses = []; 
var msg = '';

while (true) {
  var input = prompt('請輸入 1–100 的整數（取消結束）：');
  if (input === null) {
    msg = '已取消遊戲。\n答案是：' + target + '\n共嘗試：' + tries + ' 次';
    break;
  }

  var n = toInt(input);
  if (n === null || n < 1 || n > 100) {
    alert('請輸入 1–100 的有效整數！');
    continue;
  }

  tries++;
  guesses.push(n); 

  if (n === target) {
    alert('恭喜答對！答案是 ' + target + '。共嘗試 ' + tries + ' 次。');
    msg = '恭喜答對！\n答案：' + target + '\n共嘗試：' + tries + ' 次\n你的輸入：' + guesses.join(', ');
    break;
  }

  alert(n < target ? '再大一點' : '再小一點');
}

document.getElementById('result').textContent = msg;
console.log(msg);
