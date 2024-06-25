 
//Name,Type,Start,Due,Format,Sessions,Grader,Status,Question,Answer,course,Semester,Scale,Weight,Options,coursetitle,timeformat, assess, attach
// 0   1    2     3     4      5       6      7     8         9      10     11      1 21   13    14       15          16          17     18
document.write("<style>.blanklook{border:1px #b0b0b0 solid;}</style>");

function freeformat(x, Z)
{ 
    if (mat[Z][4] != '0')
    {
         x = checkh(x, true);
         needtranslator = true;
    }
    x = addbreak(x, 1);
    x = formatstr(x, mat[Z][4]);
    
    if (mat[Z][1] == '0' || mat[Z][1] == '2')
    {
         x = x.replace(/\/\/\/\/([^<]+)/g, "<font color=red>//$1</font>");
    }
    if (mat[Z][1] == '0' || mat[Z][1] == '2')
    {
          x = x.replace(/<script/ig, "&lt;script").replace(/<\/script/ig, "&lt;/script");
    }
    
    var hw;
     
    var attstr = ResizeUploaded.unzip(mat[Z][18]);
    hw = new Hwtake('rev', '', '', attstr, '', '', Z);
    addcss2head(Z, hw.divs ); 
    var z = hw.merge(addbreak1(x));
     
    return  z;
}

 
function assformat()
{
    
    for (var i= 0; i < numRows; i++)
    {
        var tbl = document.getElementById('tbl' + i);
        if (mat[i][1] == '1' || mat[i][1] == '3')
        {
            var attstr = ResizeUploaded.unzip(mat[i][18]);
            var detailass = new Hwtake('prev', mat[i][8], mat[i][9], attstr,  mat[i][17],  mat[i][4], i, true ); 
            addcss2head(i, detailass.divs);   
            
            var str =  ("<center>" + detailass.header + detailass.attachheader +"</center>");
            detailass.assemble(false); 
             
            tbl.rows[4].cells[1].innerHTML = str +  detailass.str;
            var an = '';
            for (var j=0; j <= detailass.answqrr.length; j++)
            {
                 
                var ii = detailass.mapor2nm[j];    
                if (ii == null) continue;
                if (detailass.answqrr[ii]!=null && detailass.answqrr[ii]!='')
                an += j + "." + formatstr(detailass.answqrr[ii], detailass.fmt) + "<br>";
            }
         
            if (tbl.rows.length>5)
                tbl.rows[5].cells[1].innerHTML = an;
        }
        else
        {
            
            tbl.rows[4].cells[1].innerHTML =  freeformat(mat[i][8],i);
            if (tbl.rows.length>5)
                tbl.rows[5].cells[1].innerHTML = freeformat(mat[i][9],i);;
        }
    }
}
onbegin += "assformat();";
 
var resz = function(){};
var larger = function(a,b){};
var doonblur = function(a,b){};
var showemtable = function(a,b){};
var displaytxt = function(a,b,c){};
var doonfocus = function(a,b,c){};
var doonblurb = function(a,b,c,c){};
var onradioclick = function(a,b,c){};
var ponf = function(){}