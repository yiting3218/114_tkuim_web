// lab_score_calculator.js
// 讀入 5 科成績，計算平均與等第；任一科 < 60 顯示不及格警示

function toNumber(str) {
  var n = parseFloat(str);
  return isNaN(n) ? null : n;
}

function gradeFrom(avg) {
  if (avg >= 90) return 'A';
  if (avg >= 80) return 'B';
  if (avg >= 70) return 'C';
  if (avg >= 60) return 'D';
  return 'F';
}

var name = prompt('請輸入姓名：');
if (!name) name = '同學';

// 五科科目（可按需求更改名稱）
var subjects = ['國文', '英文', '數學', '自然', '社會'];
var scores = [];
var valid = true;

// 逐科輸入並驗證
for (var i = 0; i < subjects.length; i++) {
  var s = toNumber(prompt('請輸入 ' + subjects[i] + ' 成績（0–100）：'));
  if (s === null || s < 0 || s > 100) { // 基本合理範圍檢查
    valid = false;
    break;
  }
  scores.push(s);
}

var text = '';
if (!valid) {
  text = '輸入有誤，請重新整理後再試。';
} else {
  // 計算總分與平均
  var sum = 0;
  for (var j = 0; j < scores.length; j++) sum += scores[j];
  var avg = sum / scores.length;

  // 是否有不及格科目
  var hasFail = false;
  for (var k = 0; k < scores.length; k++) {
    if (scores[k] < 60) { hasFail = true; break; }
  }

  // 組出結果文字
  text = '姓名：' + name + '\n';
  for (var t = 0; t < subjects.length; t++) {
    text += subjects[t] + '：' + scores[t] + '\n';
  }
  text += '平均：' + avg.toFixed(2) + '\n';
  text += '等第：' + gradeFrom(avg);
  if (hasFail) {
    text += '\n※ 有不及格科目';
  }
}

console.log(text);
document.getElementById('result').textContent = text;
