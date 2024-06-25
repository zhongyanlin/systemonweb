 

var f = document.form1;
function byname(n)
{
    var ll = f.elements.length;
    for (var jj = 0; jj < ll; jj++)
    {
       if (f.elements[jj].name == n)
       return f.elements[jj];
    }
    return null;
}
function resizeCont()
{  
      var obj = document.images["rule"];
      var leng = 0;
      var wd = screen.width;
     if (typeof (self.innerWidth) != 'undefined')
     {
       wd = self.innerWidth ;
     }
     else
     {
       wd = document.body.offsetWidth ;
     }

     var het = screen.height;
     if (typeof (self.innerHeight) != 'undefined')
     {
         het= self.innerHeight ;
     }
     else
     {
         het= document.body.offsetHeight ;
     }
      
      wd -= 125;

      if (obj!=null) 
      {
          leng =  obj.width;

      }
      else 
      {
          leng = wd + 145;
          
      }
       
      if (leng > wd + 145)
      { 
          window.resizeBy(leng - wd - 145, 0); 
          wd = leng - 140;
      }
      
      het -= 170 + nb*font_size ;
      het = Math.floor(het);
       
       var ll = f.elements.length;
       for (var jj=0; jj < ll; jj++)
           if (eletype.charAt(jj)=='t')
               f.elements[jj].width = wd - 120;
           else if (eletype.charAt(jj)=='f')
           {
               f.elements[jj].width = wd - 120;
               het -= 5 + font_size;
           }
       for (jj = 0; jj < asn; jj++)
       {  
           var ele = byname(asname[jj]);
           ele.style.width  = wd + "px";
           ele.style.height = het/na + "px";
       }
}
 
function dim(x,y)
{
    return 'toolbar=0,location=0,directories=0,status=0,menubar=1,scrollbars=1,resizable=1,width='+ x +',height=' + y +',top=' + ((screen.height-y)/2)+',left=' + ((screen.width-x)/2);
}
function go()
{
    f.encoding="application/x-www-form-urlencoded";
    formnewaction(f, handler);
    f.example.value='';
    if (nav!=null) nav.close();
    nav = window.open("", "blank", dim(500,600));
    f.target = 'blank';
   visual(f);
 f.submit();
}

//window.onresize=resizeCont;
resizeCont();



ncomp == 0;
for (var jj = 0; jj < kk; jj++)
{
   var dc = byname( allname[jj]);
   if (ncomp <  comp.length )
       dc.value = comp[ncomp++];
   else
       dc.value = '';
}
function assemble()
{
    var examplev = '';
    
    for (var jj = 0; jj < kk; jj++)
    {
       var dc = byname( allname[jj]);
       if (examplev != '') examplev += "_@_&%_#_@_";
       examplev += (dc.value=='')?' ':dc.value;
    }
    return examplev;
}
function send2all()
{
   document.f3.example.value = assemble();
   document.f3.target = "w" + tstmp;
   formnewaction(document.f3);
   visual(document.f3);
document.f3.submit();
}
function saveexample()
{
    f.encoding="application/x-www-form-urlencoded";
    formnewaction(f,'DataUpdate?rdap=wenserviceexmaple&subdb=' + userid);
     
    f.example.value= assemble();
    f.target = "w" + tstmp;
   visual(f);
 f.submit();
}

function genImage(fieldname)
{
    myprompt(textmsg[897], fieldname, "goahead(v,'" + fieldname +"')");
}

function goahead(hint, fieldname)
{
    document.f4.encoding="application/x-www-form-urlencoded";
    formnewaction(document.f4,'WordImage');
    document.f4.FileOut.value= fieldname  + ".gif";
    document.f4.Command.value=
    'convert -background white -size 120x18 -fill grey -font SheerBeauty -pointsize 70 label:"' + hint +'"';
    nav = window.open('','genhint', dim(340,300));
    document.f4.target = 'genhint';
    visual(document.f4);
document.f4.submit();
}
var nav;
function upload()
{
  f.encoding="multipart/form-data";   
  formnewaction(f,"UploadFile");
  f.saveindir.value = "temp";
  
  f.example.value='';
  f.target = 'w' + tstmp;
 visual(f);
 f.submit();
}
  
function openmid(url,x,y)
{
  if (x==null) x= 340;
  if (y == null) y = 300;
  window.open(url,'winname', dim(x,y));   
}
function syn(x, explicit, em)
{
 
 if (x == '1') 
     parent.myprompt("OK");
 else
 { 
 var yy = explicit.replace(/@.*/,''); 
 var j = yy.lastIndexOf("/");
 yy = yy.substring(j+1);
  
 if ( f.FileIn ) 
 {
    f.FileIn.value += yy + " ";
 }
 var ele = document.getElementById("uploaded");
 if (ele!=null && yy=='')
 {
    ele.innerHTML = ele.innerHTML + "<a href=\"FileOperation?operation=open&folder=temp&filedir=" + yy + "\">" + yy + "</a> ";   
 }
 return 1;
 } 
}

function chnfontsize(sel)
{
    var alltxts = document.getElementsByTagName("textarea");
    if (alltxts!=null)
    for (var i=0; i < alltxts.length; i++)
        alltxts[i].className='class'+sel.selectedIndex;
} 