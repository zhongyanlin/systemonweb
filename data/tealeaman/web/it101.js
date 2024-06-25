function parsequiz(t)
{
var s = t.value;
var q = '';
var a = '';
var r = new RegExp(/[0-9]+\)/);
var k = 0, j =0;
while (true)
{
   var m = r.exec(s.substring(k));
   if (m == null) break;
   var i = m.index;
   var n = m.toString().replace(/\)/,'');
   var l = s.substring(k).indexOf('Answer: ');
   q += s.substring(k, k+l);
   a += n + ' ' + s.substring(k + l + 7, k + l + 10) + '\n';
   k = k + l + 10;
}

t.value = q;
ele(0,9).value = a;
}
