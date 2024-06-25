function good(t, l, s)
{
   
    if (s == null)
        return true;
    var x = 0;
    s = s.toUpperCase().replace(/ /g, '');
    if (s == '')
        return true;
    else if (s.indexOf("CHAR") >= 0)
    {
        x = parseInt(s.replace(/[^0-9]/g, ''));
        s = s.replace(/[^A-Z]/g, '');
    }

    if (s == 'SHORT')
    {
        if (t == 0 && l < 6)
            return true;
    }
    else if (s == 'INTEGER')
    {
        if (t == 0 && l < 9)
            return true;
    }
    else if (s == 'BIGINT')
    {
        if (t == 0 && l < 14)
            return true;
    }
    else if (s == 'CHAR')
    {
        if (l == x)
            return true;
    }
    else if (s == 'VARCHAR')
    {
        if (l <= x)
            return true;
    }
    else if (s == 'TEXT')
    {
        return true;
    }
    return false;
}

function v()
{
    var b = true;

    for (var i = 0; i < M; i++)
        document.f.elements[M + 1 + i].style.backgroundColor = "white";
    
    if (!firstlineishead)
    {
        for (var i = 0; i < datatype0.length; i++)
            if (!good(datatype0[i], datalength0[i], document.f.elements[M + 1 + i].value))
            {
             
                b = false;
                document.f.elements[M + 1 + i].style.backgroundColor = "red";
            }
    }
    else
    {
        for (var i = 0; i < datatype1.length; i++)
            if (!good(datatype1[i], datalength1[i], document.f.elements[M + 1 + i].value))
            {
                
                b = false;
                document.f.elements[M + 1 + i].style.backgroundColor = "red";
            }
    }
    return b;
}
 

function submitform2()
{

    var b = v();
    if (b)
        goahead();
    else
        myprompt("Some records can not be inserted into the table because soem fields are too small to accommdate the data. Continue?", null, "if (v)goahead()", "Warning");
}


function chf0(s)
{
    firstlineishead = s.checked;
    document.form1.firstline.value = "" + s.checked;
    if (firstlineishead)
    {
        for (var i = 0; i < fields.length; i++)
        {
            document.f.elements[i + 1].value = fields[i];
            var j = parseInt(document.f.elements[i + 1].size);
            var k = parseInt(document.f.elements[M + i + 1].size);
            if (j < k)
                document.f.elements[i + 1].size = "" + k;
        }

        for (i = 0; i < datatypes1.length; i++)
            document.f.elements[i + 1 + M].value = datatypes1[i];
    }
    else
    {
        for (var i = 0; i < M; i++)
        {
            document.f.elements[i + 1].value = "t" + i;
            document.f.elements[i + 1].size = "3";
        }
        for (i = 0; i < datatypes0.length; i++)
            document.f.elements[i + 1 + M].value = datatypes0[i];
    }
}

function goaheadn()
{
    
    var orders = ",";
    var sql = "";
    var key = "";
    var quotes = "";
    var fields = "";
    for (var i = 0; i < M; i++)
    {
        var x = document.f.elements[1 + i];
        var y = document.f.elements[M + 1 + i];
        var z = document.f.elements[2 * M + 1 + i];
        
        var v = x.value.replace(/ /g, '');
        
        if (v != '')
        {
            if (v.replace(/\w/g, '') != '')
            {
                myprompt("Invalid name of fields " + v);
                return;
            }
            fields += "," + v;
            orders += i + ",";
            sql += v + " " + y.value + ",";
            if (y.value.indexOf("CHAR") >= 0 || y.value.indexOf("TEXT") >= 0)
                quotes += ",";
            else
                quotes += " ";
        }
        if (z.checked)
            key += "," + v;
    }
     
    if (key != '')
        document.form1.createsql.value = sql + "PRIMARY KEY(" + key.substring(1) + ")";
    else
        document.form1.createsql.value = sql.replace(/,$/, "");

    document.form1.target =  tstmp;
    document.form1.quotes.value = quotes;
    document.form1.orders.value = orders;
    document.form1.fields.value = fields.substring(1);
    formnewaction(document.form1);
    visual(document.form1);
document.form1.submit();

}
function goahead()
{
    if (newtable) {
        goaheadn();
        return;
    }
    var orders = ",";
    var fields = "";
    var quotes = "";
    for (var i = 0; i < M; i++)
    {
        var x = document.f.elements[1 + i];
        if (x.selectedIndex != 0)
        {
            orders += i + ",";
            fields += "," + x.options[x.selectedIndex].value;
            var y = document.f.elements[M + 1 + i];
            if (y.value.indexOf("CHAR") >= 0 || y.value.indexOf("TEXT") >= 0)
                quotes += ",";
            else
                quotes += " ";
        }
    }
    document.form1.fields.value = fields.substring(1);
    document.form1.orders.value = orders;
    document.form1.quotes.value = quotes;
    document.form1.target =   tstmp;
    formnewaction(document.form1);
    visual(document.form1);
    document.form1.submit();
}

function chf(s)
{
    firstlineishead = s.checked;
    document.form1.firstline.value = "" + s.checked;
    if (!newtable)
        v();
    else
        chf0(s);
}
var si = new Array(M);
for (var i = 0; i < fields.length; i++)
    si[i] = i + 1;
for (; i < M; i++)
    si[i] = 0;
var ti = new Array();
for (var i = 0; i < fields.length; i++)
{
    ti[fields[i]] = datatypes[i];
}

function chs(s, j)
{
     
    formselementbyname(document.f, "t" + j).value = map[s.options[s.selectedIndex].value];
    v();
    if (1==1) return;
    var i = s.selectedIndex;
    var x = s.options[i].value;
    var y = s.options[si[j]].value;
    var k = j + 1;
    var l = 0;
    for (; l < M - 1; k = (k + 1) % M, l++)
    {
        var z = document.f.elements[k + 1];
        if (z.options[z.selectedIndex].value == x)
            break;
    }
    if (k < j && x != '')
    {
        s.selectedIndex = si[j];
        return;
    }
    var tj = document.f.elements[M + 1 + j];
    for (var l = 0; l < z.options.length; l++)
        if (z.options[l].value == y)
            break;
    z.selectedIndex = l;
    si[k] = l;
    var tk = document.f.elements[M + 1 + k];
    tk.value = ti[y];
    tj.value = ti[x];
    si[j] = i;
    v();
}





v();


