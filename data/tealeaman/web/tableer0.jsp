<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.SYSTEMANALYST,application,session,request, response, "tableer.jsp", true)) == null|| !Toolbox.verifytoken(request))
    return;
orgnum=user.orgnum;
long tstmp = System.currentTimeMillis() % 10000000;
 
String subdb = Toolbox.defaultParam(orgnum,request,"subdb", user.id);
user.changedb(subdb);
int maxroleslen = 0;
for (int i = 0; i < Systemroles.numRoles; i++)
{
      if ( maxroleslen < Systemroles.roles[orgnum>>16][i].length())
           maxroleslen = Systemroles.roles[orgnum>>16][i].length();
}

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<meta id=mainmeta http-equiv="Content-Type" content="text/html; charset=<%=Toolbox.encodings[orgnum>>16] %>"> 
<title>ER Diagram</title>
<%=cachedstyle.toString()%><link rel="styleSheet" type="text/css" href="styleb<%=orgnum%>.css">
<script><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("tabler.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script id=ltxscrpt type="text/x-mathjax-config">
  MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
      processEscapes: true
    },
    "HTML-CSS": { availableFonts: ["TeX"] }
  });
</script>
<style type="text/css">
.tlmmsty{border:0px black solid;font-style:normal;font-family:arial;vertical-align:top;text-align:center;padding:0px 0px 0px 0px}
.tlmmline{width:100%}
.tlmvline{height:100%}
.tdbutton{border:1px #bbb solid;font-style:normal;font-family:arial;vertical-align:top;text-align:center;padding:0px 0px 0px 0px;border-radius: 3px}
.samebg{color:black;font-size:20px;font-family:arial}
</style>
 
</head>    
<body style="background-imgae:url() !important;background-color:white;margin:0px 5px 0px 5px"> 
<script> 
//var textmsg=new Array(900);
textmsg[849] = 'No';
textmsg[848] = 'Yes';
var needtranslator = true; 
 
var tstmp = <%=tstmp%>;
var font_size =  <%=cachedstyle.fontsize%>;
var encoding = "<%=Toolbox.encodings[orgnum>>16]%>";
var dbms = parent.frames[0].passdbinfo();
var msg71 = "<%=Toolbox.emsgs(orgnum,71)%>";
 
var tablename = "";
</script>
<script type="text/javascript"  src=stab.js></script>
<script type="text/javascript"  src=tableparse.js></script>
<script type="text/javascript"  src=tablesetup.js></script>
<script type="text/javascript" >
var TLENG =  tables.length;
var pagewidth = screen.width - 300; 
function nametoi(tn)
{
    var i=0;
    for (; i < TLENG; i++)
        if (tables[i].toUpperCase() == tn.toUpperCase())
            return i;
    return -1;
}
var allNodes = [];
var map2;
function Node(i)
{
    this.num = i;
    this.name = tables[i];
    this.visited = false;
    this.def = parent.frames[0].passdef(this.name);
     
    this.tome = [];
    this.fromme = [];
     
    this.mark = function ()
    {
      
       var j=0;
       while (true)
      {
       var m = this.def.indexOf('REFERENCES', j);
       
       if (m < 0) return;
       var l = this.def.indexOf("(",m+10);
       j = this.def.indexOf(")", l);
       var y = this.def.substring(m+10,l).replace(/^[ ]+/,'');
       var i = nametoi(y);
       if (i == -1) continue;
       var n = allNodes[i];
       n.tome[n.tome.length] = this;
       this.fromme[this.fromme.length] = n;
       
      }
   }
   
   this.visit = function(tblarr,relarr)
   { 
       Node.ordernum++;
       map2[this.name.toUpperCase()] = Node.ordernum;
       var NUMROWS = parent.frames[0].passNumfield( this.name)+5;
       var mat  =    new Array( NUMROWS );
       deleted = new Array( NUMROWS );
       for (var i = 0; i< NUMROWS; i++)
       {
          deleted[i]= 0; 
          mat[i]= new Array(numCols);
       }
       checks = '';
       numRows  = parse(this.def, mat, ""); 
       var s = this.name + "\n";
   
       for (i=0; i < numRows; i++)
       {
          if ('' + mat[i][7] == '1')
             s += "\n<b>" + mat[i][1] + "</b>";
          else
             s += "\n" + mat[i][1];
      
          if (mat[i][8] !=null && mat[i][8] !='' && mat[i][9] !=null && mat[i][9]!='' )
          {
           var ss = mat[i][8] +",30,'" + mat[i][9] +"'," + Node.ordernum +",30,'" + mat[i][1] +"',2,1,1,0";
            //ordernum,type,startnum,sx,sy,endnum,ex,ey,thick,direct,tm,cl
           relarr[relarr.length] = ss;
          }
        }
         
        tblarr[tblarr.length] = "'" + s +"'";
        this.visited = true;
        for (var i=0; i < this.fromme.length; i++)
            if (this.fromme[i].visited == false)
                this.fromme[i].visit(tblarr,relarr);
        for (var i=0; i < this.tome.length; i++)
            if (this.tome[i].visited == false)
                this.tome[i].visit(tblarr,relarr);
   }   
}
Node.ordernum = -1; 
var shapearr = [];
var linearr = [];
var curvearr = new Array();
var attacharr = new Array();
function paddfront(n)
{
   if (n < 10) return "   " + n;
   if (n < 100) return "  " + n;
   if (n < 1000) return " " + n;
   return '' + n;
}

function movestep(arr)
{  //  "'asd\nsdfsd\n\nsdfdfsdf\nsdf',roundrect,352,212,,,15,black,white,0"
    var x = 5;
    var y = 36;
    var sm = 0;
    for (var i=0; i < arr.length; i++)
    {
        if (x > pagewidth)
        {
            x = 10;
            y += 260;
        }
        var len = arr[i].length/150.0;
        if (len < 0.1) len = 0.1;
        var lenstr = ('' + len).replace(/(\.[0-9]).*/,'$1');
        var smstr = ('' + sm).replace(/(\.[0-9]).*/,'$1');
        arr[i] = arr[i] + ",'',rightrect," + x + "," + y + ",,,13,0,0,0," + lenstr + "," + i + "," + smstr;
        sm += len;
        x += 90;
        
    }
}


function prepare()
{ 
    var PN = -1;

    for (var k=0; k <  TLENG ; k++)
    {
        allNodes[k] = new Node(k);
    }
    for ( k=0; k < TLENG; k++)
    {
        allNodes[k].mark();
    }
    var SH = [];
    var LN = [];
    var ne = [];

    for (  k=0; k < TLENG; k++)
    {
        if (allNodes[k].visited == false)
        {
            PN++;
            SH[PN] = [];
            LN[PN] = [];
            Node.ordernum = -1; 
            map2 = new Array();
            allNodes[k].visit(SH[PN],LN[PN]);
            for (var m=0; m < LN[PN].length; m++)
            {
               var s = LN[PN][m];
               var n = s.indexOf(",");
               s = "'arrom',"+ map2[s.substring(0,n).toUpperCase()] + s.substring(n);
              
               LN[PN][m] = s;
            }    
            ne[PN] = paddfront(SH[PN].length) + paddfront(PN);

        }
    }
      
    if (confirm("Do you want to put all tables in one page"))
    {
        for (var pg=1; pg <= PN; pg++)
        {
            SH[0] = SH[0].concat(SH[pg]);
            LN[0] = LN[0].concat(LN[pg]);
        }
        PN = 1;
        shapearr[0] = SH[0];
        movestep(shapearr[0]);
        linearr[0]  = LN[0];
         
        return ""; 
    }
    else
    {
        ne.sort();
        var r = [];
        var pl = "<tr><td>Number of Tables</td>";
        var cl = "<tr><td>Page num</td>";
        for (var i=0; i <=PN ;i++)
        {
            r[i] = parseInt(ne[PN-i].substring(4).replace(/^[ ]/,''));
            var v = parseInt(ne[PN-i].substring(0,4).replace(/^[ ]/,''));
            if (v > 1)
            {

                cl += "<td>" + (i+1) + "</td>";
                pl += "<td>" + v + "</td>";
            }
        }


        for (var i = 0; i <= PN; i++)
        { 
            shapearr[i] = SH[r[i]];
            movestep(shapearr[i]);
            linearr[i] = LN[r[i]];
        }
        return  "<table border=1 style=border-collapse:collapse>" + cl +"<td rowspan=2> The rest has<br>only one table</td></tr>" + pl + "</tr></table>" ;
        
    }
     
}

var pagecountstr =  prepare();
var passedencoding = '<%=Toolbox.encodings[orgnum>>16]%>';
var passedfilename = 'erd.html';
var passedsessionid = '-1'; 
var filename = null;// "erd.html";
var originalurl = document.location.toString().replace(/.tableer.jsp.*/,'');
var editable = true;
var onlinetoolmini = function(){}

 
</script>
<script type="text/javascript"  src="attachment.js"></script>
<script type="text/javascript"  src="curve.js?sn=100&dn=60"></script>
<script type="text/javascript"  src="findrep.js"></script>
<script type="text/javascript"  src="installtool.js"></script>
<script type="text/javascript"  src="urltool.js"></script>
<script type="text/javascript">
myprompt(pagecountstr);
if (pagecountstr!='' && promptwin!=null){
promptwin.style.top = "30px";
promptwin.style.left = "40px";
}
</script>
</body>
</html>