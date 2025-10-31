// example3_script.js
// 使用 prompt 取得輸入，並做基本運算

var name = prompt('請輸入你的名字：');
if (!name) {
  name = '同學';
}

var a = prompt('請輸入數字 A：');
var b = prompt('請輸入數字 B：');

var numA = parseFloat(a);
var numB = parseFloat(b);

var output = '';
output += '哈囉，' + name + '！\n\n';
output += 'A = ' + numA + ', B = ' + numB + '\n';
output += 'A + B = ' + (numA + numB) + '\n';
output += 'A - B = ' + (numA - numB) + '\n';
output += 'A * B = ' + (numA * numB) + '\n';
output += 'A / B = ' + (numA / numB) + '\n';

// ===== 餘數運算 =====
output += 'A % B = ' + (numA % numB) + '\n\n';

// 比較運算
output += 'A > B ? ' + (numA > numB) + '\n';
output += 'A == B ? ' + (numA == numB) + '\n';
output += 'A === B ? ' + (numA === numB) + '\n';

alert('計算完成，請看頁面結果與 Console');
console.log(output);
document.getElementById('result').textContent = output;
