 


function foldaline(p, m, ccc)
{
   var words = p.split(/[ |\n]/);
   var processed = "";
   var j = 0, k;
   for (var i = 0; i < words.length; i++)
   {
      k = words[i].length;
      if (j+k < m)
      {
        processed += words[i] + " ";
        j += (k+1);
      }
      else
      {
        if (processed.length != 0)
        {
           if (words[i].indexOf("type=")!=0)
           processed +=  ccc;
        }
        processed +=  words[i] + " ";
        j = k;
      }
   }
  return processed;
}

function writenote(s)
{
   if (s.replace(/ /g,'')!='')
   {
      s = "<div style=\"float:left\"><img src=image/guide1.gif height=60></div>" + s;
      myprompt(s,true,null,textmsg[191]);
     /* var w = parent.offsetWidth - promptwin.offsetWidth ;
      var h = parent.offsetHeight - promptwin.offsetHeight;
      promptwin.style.left= (   w - 20) + 'px';
      promptwin.style.top = (   h - 6) + 'px';
      setTimeout("walk(" +  (   h - 6 - promptwin.offsetHeight) + ")",100);
     */
   }
}
function walk(z)
{
   if (promptwin==null)return;
   var t = parseInt(promptwin.style.top.replace(/px/,''));

   if (t - z > 2 )
   {
      promptwin.style.top = (t - 2) + 'px';
      setTimeout('walk(' + z +')',100);
   }
}

var jj = 0;
if (typeof (z) !='undefined')
{

      for (jj=0; jj < z.length; jj++)
      {
      if (z[jj]==null) continue;
       
      if (z[jj]!=null&& z[jj][0]==document.f.rdap.value && ''+z[jj][5]==document.f.df.value)
      {
         
         document.f.title.value=z[jj][1];
         document.f.uid.value  =z[jj][3];
         document.f.roles.value=z[jj][4];
         break;
      }
      }
}

var j = 0;
if (typeof (cats) !='undefined')
{
   for (j=0;  j < cats.length;  j++)
   {
      document.f.cat.options[j+1]=new Option(cats[j],cats[j]);
      if (jj < z.length  && z[jj][2] == cats[j])
         document.f.cat.selectedIndex = j+1;
   }
}

document.f.cat.options[j+1] = new Option(textmsg[114] + " " + msg816,"");


if(typeof(document.f)!='undefined')
{
   
   resizebut(document.f);
   document.f.extra.disabled = true;
}

 
function openit1(tt)
{
   myprompt(msg231,"","goopenit1('" + tt +"',v)");
}

function goopenit1(tt,i)
{
   if ( ''+parseInt(i) !='NaN')
      open(tt+ i, '_blank');
}
function savecat()
{
   if (f.title.value =='')
      myprompt(msg1289,null,"if(v)goopenit();");
   else
      goopenit();
}

function goopenit()
{
   if (  document.f.title.value !=''
      && document.f.cat.options[document.f.cat.selectedIndex] == '')
   {
      myprompt(msg206 + " " + msg816);
      document.f.cat.focus();
      return;
   }
   var tb = document.getElementById("urllink");
   if (tb!=null && document.f.extra.disabled == false)
   {
      var k=1;
      while (k < tb.rows.length)
      {
         var x0 = tb.rows[k].cells[0].innerHTML;
         var x1 = tb.rows[k].cells[1].innerHTML.replace(/^[\W]+/,'').replace(/[\W]+$/,'');
         if (x0.replace(/&nbsp;/g,'')!='' &&  x1.replace(/&nbsp;/g,'')!='')
            document.f.extra.value += '["' + document.f.rdap.value + '","' + x0 + '","' +x1 + '"],\n';
         k++;
      }
      myprompt(document.f.extra.value);
   }
    document.f.target =   'w' + tstmp;
   // open("","tt",dim(300,250));
    formnewaction(document.f);
   // document.f.action = "Echo";
   visual(document.f);
document.f.submit();
}

 
function addone()
{
   if (document.f.cat.options.length -1 ==document.f.cat.selectedIndex)  
   myprompt(msg34 + " " + msg816,"", "goaddone(v)");
}

function goaddone(x)
{
   document.f.cat.options[document.f.cat.options.length -1] = new Option(x,x);
   document.f.cat.options[document.f.cat.options.length] = new Option(msg34 + " " + msg816,"");
   document.f.cat.selectedIndex = document.f.cat.options.length - 2;
}
function insertmore()
{
   var tb = document.getElementById("urllink");
   if (tb==null){
      myprompt("urllink not exist"); return;
   }
   
   var rw, cl,an;
   var kk = 1;
   if (typeof (formassociated) != 'undefined')
   {
      for (var k=0; k < formassociated.length; k++)
      {
         if (formassociated[k][0]==document.f.rdap.value)
         {
            rw = tb.insertRow(kk);
            cl = rw.insertCell(0);
            cl.setAttribute("width", "150px");
            cl.setAttribute("style", "background-color:white");
            cl.className = "fieldlbl";
            cl.onclick =  function(){
               editcell(this,1)
               };
            cl.innerHTML = formassociated[k][1];
            cl = rw.insertCell(1);
            cl.className = "fieldlbl";
            cl.setAttribute("style", "background-color:white");
            cl.onclick =  function(){
               editcell(this,2)
               };
            cl.innerHTML =  formassociated[k][2];
            cl = rw.insertCell(2);
            cl.setAttribute("width", "50px");
            cl.className = "fieldlbl";
            an = document.createElement("a");
            an.appendChild(document.createTextNode(textmsg[1200]));
            an.setAttribute("href","javascript:openb(" + (kk++) +")");
            cl.appendChild(an);

         }
      }
   }
   rw = tb.insertRow(kk);
   cl = rw.insertCell(0);
   cl.className = "fieldlbl";
   cl.setAttribute("style", "background-color:white");
   cl.setAttribute("width", "150px");
   cl.onclick =  function(){
      editcell(this,1)
      };
   
   cl.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
   cl = rw.insertCell(1);
   cl.className = "fieldlbl";
   cl.setAttribute("style", "background-color:white");
   cl.onclick =  function(){
      editcell(this,2)
      };
   
   cl.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
   cl = rw.insertCell(2);
   cl.setAttribute("width", "50px");
   cl.className = "fieldlbl";
   an = document.createElement("a");
   an.appendChild(document.createTextNode(textmsg[1200]));
   an.setAttribute("href","javascript:openb(" + (kk++) +")");
   cl.appendChild(an);
   
}
 
function editcell(th,j)
{
   if (th.getElementsByTagName("input").length > 0)
      return;
   var existing = th.innerHTML.replace(/&nbsp;/g,'');
   var thenewtextbox = thenewtextbox = document.createElement('input');
   thenewtextbox.setAttribute('type', "text");
   thenewtextbox.style.zIndex = 20;
   thenewtextbox.style.margin = "0px";
   thenewtextbox.style.color  = "black";

   thenewtextbox.style.border = "0px";
   thenewtextbox.style.padding = "0px";
   thenewtextbox.style.width = (th.offsetWidth-0) + "px";
   thenewtextbox.style.height = (th.offsetHeight-0) + "px";
   th.innerHTML = "";
   thenewtextbox.value = existing;
   //thenewtextbox.setAttribute("onkeypress", "return dotabenter(this,event)");
   if (j==1)
      thenewtextbox.onblur = function(){
         setv1(this);
      };
   else
      thenewtextbox.onblur = function(){
         setv2(this);
      };
   th.appendChild(thenewtextbox);
   thenewtextbox.focus();
}
function setv1(inpt)
{
   inpt.parentNode.innerHTML = inpt.value.replace(/^[ ]+/,'').replace(/[ ]+$/,"").replace(/\W+$/,'');
   document.f.extra.disabled = false;
}
function setv2(inpt)
{
   var str  = inpt.value.replace(/ /g,"").replace(/^[\W]+/,'').replace(/[\W]+$/,'');
   inpt.parentNode.innerHTML = str;
   document.f.extra.disabled = false;
}
function openb(kk)
{
   var tb = document.getElementById("urllink");
   var xx = tb.rows[kk].cells[1].innerHTML;
   if (xx.length.replace(/ /g, '').length>5)
   {
       myprompt(xx);
       window.open(xx,"_blank");
   }
}

insertmore();
if (document.f.title.value=='' && parent.closeprompt)
{
   parent.closeprompt();
   writenote(msg1282);
}

var elem = document.f.elements;
for (var i=0; i < elem.length; i++)
{
    if(elem[i].type.toLowerCase() == 'button' || elem[i].type.toLowerCase() == 'submit')
    elem[i].style.height = (font_size+4) + 'px';
}
