// example2_script.js
// 變數宣告與基本型態操作

var text = '123';              // 字串
var num = 45;                  // 數字
var isPass = true;             // 布林
var emptyValue = null;         // 空值
var notAssigned;               // undefined（尚未指定）

// 型態檢查
var lines = '';
lines += 'text = ' + text + '，typeof: ' + (typeof text) + '\n';
lines += 'num = ' + num + '，typeof: ' + (typeof num) + '\n';
lines += 'isPass = ' + isPass + '，typeof: ' + (typeof isPass) + '\n';
lines += 'emptyValue = ' + emptyValue + '，typeof: ' + (typeof emptyValue) + '\n';
lines += 'notAssigned = ' + notAssigned + '，typeof: ' + (typeof notAssigned) + '\n\n';

// 轉型
var textToNumber = parseInt(text, 10);
lines += 'parseInt(\'123\') = ' + textToNumber + '\n';
lines += 'String(45) = ' + String(num) + '\n\n';

// 使用 prompt() 讀入兩個數字字串，轉成數字後相加並輸出結果
var input1 = prompt('請輸入第一個數字：');
var input2 = prompt('請輸入第二個數字：');

// 轉型
var n1 = parseFloat(input1);
var n2 = parseFloat(input2);
var sum = n1 + n2;

lines += '你輸入的第一個數字：' + n1 + '\n';
lines += '你輸入的第二個數字：' + n2 + '\n';
lines += '兩數相加結果：' + sum + '\n';

document.getElementById('result').textContent = lines;
