var replywin = null;
function dim(x,y)
{
            return "toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=0,scrollbars=1,resizable=1,width=" + x +",height=" + y +",top=" + ((screen.height - y)/2) + ",left=" + ((screen.width-x)/2);
}
function op(str,x,y)
{
    window.open(str, "op", dim(400, 500) ); 
}
function openit(str)
{ 
           refresh = str.charAt(str.length-1);
           if (replywin != null) replywin.close();
           replywin  = window.open(str, "w" + tstmp);
          
}  
 function makeann(btn)
{
   var height = thispageheight()-130;
   if (height > width-300) height = width-300;
   if (height <300) height = 300;
   var bar = document.getElementById('titlediv').parentNode.parentNode.parentNode;
   if (bar.tagName.toLowerCase()!='table') bar = bar.parentNode;
   var width = bar.offsetWidth-10;
   myprompt('<iframe name=openlinl width=' + width + ' height=' + height + " />",null,null,btn.value);
   promptwin.style.top = ( bar.offsetHeight) + 'px';
   promptwin.style.left =   '5px';
   promptwin.style.width = (bar.offsetWidth ) + 'px';
   postopen("DataForm",
   "rdap,numrows,postdate,onsaved,onsave,cellonblur,subdb,title,courseTitle,course".split(/,/),
   ["announcenew","1","","114","","75", subdb,'', courseTitle, courseid],
   'openlinl');
} 
function compose(subject, iid, nm, dbgoto)
{ 
  var v = allopts;
  if (iid!=null && iid!='')
  {
    var sname=getSname(iid);
    if (sname==iid && nm!=null) 
        sname=nm;
    v = sname + ";" + iid;
  }

   if (v.indexOf(",")==-1)
   iid = v.replace(/[^;]+;/,'');
    
   if (dbgoto==null) dbgoto= subdb;
   document.form3.from.value=subdb;
   document.form3.subdb.value = dbgoto;
   document.form3.subject.value = subject;
   document.form3.idn.value=iid;
   document.form3.onsaved.value = "114";
   document.form3.onbegin.value = "47";
   document.form3.cellonblur.value="48";
   formnewaction(document.form3,'DataForm');
   
   var height = thispageheight()-130;
   if (height > width-300) height = width-300;
   if (height <300) height = 300;
   var bar = document.getElementById('titlediv').parentNode.parentNode.parentNode;
   if (bar.tagName.toLowerCase()!='table') bar = bar.parentNode;
   var width = bar.offsetWidth-10;
   var xy = findPositionnoScrolling(bar);
   myprompt('<iframe name=openlinl width=' + width + ' height=' + height + " />",null,null,msg610);
   promptwin.style.top = ( bar.offsetHeight) + 'px';
   promptwin.style.left =   '5px';
   promptwin.style.width = (bar.offsetWidth ) + 'px';
   document.form3.target='openlinl';
   document.form3.rdap.value='messageTo';
   visual(document.form3);
document.form3.submit();
}

justopened = function(win)
{
   justopenedwindowhandle = win; 
   if (win.name == 'openlinl')
   {
       promptwin.style.height = (60+win.thispageheight())+ 'px';
   }
}

function openit3(subdb,dt, sid)
{
   document.form3.postdate.value = dt; 
   document.form3.subdb.value = subdb;
   document.form3.sid.value = sid; 
   formnewaction(document.form3,'DataUpdate');
   document.form3.rdap.value='messageunsup';
   document.form3.target=  "w" + tstmp;
   visual(document.form3);
document.form3.submit();
}    
//3('DataUpdate?rdap=messageunsup&subdb=<%=subdb%>&postdate=<%=datetime%>&sid=<%=Toolbox.urlencode(senderid)%>&suppress=1')")

function fill(replywin)
{
    
    var sel = replywin.ele(0,0);
    if (thisrole == 'i' && document.form2.sid.value == sel.options[0].value )
    {
        return;
    }
    if (sel.selectedIndex < 0) return;
    var cur = sel.options[sel.selectedIndex].value; 
    for (let j = sel.options.length-1; j >=0; j--)
        sel.options[j] = null;
    var valuecapt = optionslist.split(";");
    var theoptions = valuecapt[0].split(",");
    var thecaptions =  valuecapt[1].split(",");
    
    if (thisrole == 't')
    {
        let k = 0;
        for (; k < theoptions.length; k++)
        sel.options[k] = new Option(thecaptions[k],theoptions[k]);
        let tas = ta.split(/,/);
        let kk = 1;
        for (let t in id2name)
            if (t!=uid)
            {  
                sel.options[k] = new Option(id2name[t],t);
                k++; kk++;
            }
        replywin.setv(0,0,cur);
        replywin.defaultRecord[1] = "DataPicker?rdap=messageReceiverStudent&subdb=" + subdb +'&CourseId=' + courseid;
    }
    else if (thisrole == 's')
    {
        let k = 0;
        for (; k < theoptions.length; k++)
        sel.options[k] = new Option(thecaptions[k],theoptions[k]);
        let tas = ta.split(/,/);
        let kk = 1;
        for (let t in id2name)
        {  
                sel.options[k] = new Option(id2name[t],t);
                k++; kk++;
        }
        //replywin.ctype[1] = 'h';
        //replywin.defaultRecord[1] = "";
        replywin.ele(0,1).disabled = true;
        replywin.ele(0,1).style.visibility = 'hidden';
        
        replywin.setv(0,0,cur);
    }
    else if (thisrole == 'i')
    {
        let tas = ta.split(/,/);
        let k = 0;
        let kk = 1;
        for (let t in id2name)
        {  
             sel.options[k] = new Option(id2name[t],t);
             k++; kk++;
        }
        //sel.options[k] = new Option(document.form2.fullname.value,document.form2.sid.value);
        replywin.defaultRecord[1] = "DataPicker?rdap=messageReceiverStudent&subdb=" + subdb+'&CourseId=' + courseid;
        if (cur!=uid)
        {
            replywin.setv(0,0,cur);
            let fullname = document.form2.fullname.value;
            if (fullname == 'null')
            try{
                fullname = parent.frames[0].document.form1.fullname.value;
            }catch(e){}
            if (cur == document.form2.sid.value && fullname!='null')
                sel.options[sel.selectedIndex].text = fullname;
        }
    }
        
}

function fill0(replywin)
{
   var sel = replywin.ele(0,0);
   if (sel.selectedIndex < 0) return;
   var cur = sel.options[sel.selectedIndex].value; 
   var valuecapt = optionslist.split(";");
   var theoptions = valuecapt[0].split(",");

   var thecaptions =  valuecapt[1].split(",");

   replywin.setOptions(0,theoptions);
   replywin.setCaptions(0,thecaptions);
   sel.options[sel.options.length-1] = null;
   replywin.fillopts(sel,0,0,null);
   replywin.setv(0,0,cur);
}
function syn(x)
{
   if (x=='1')
   { 
       var tt = "" + document.location;
       if (subdb=="") 
        
          parent.frames[0].openit("studentannounce.jsp");
       else 
          parent.frames[0].openit1("studentannounce.jsp");
       return 1;
   }
   else return 2;
}
        
function nameto(id)
{
   var strname = allopts.split(";");
   if (strname.length<2) return id;
  var j=0;
  var tt = strname[1].split(",");
  for(; j < tt.length && tt[j]!=id;j++);
  if (j==tt.length) return id;
  tt = strname[0].split(",");
  return tt[j];
}

function search(i)
{
  
   if (i==1) 
   {
       document.form2.rdap.value  = "messagesS0";
   }
   else 
   {
       document.form2.rdap.value  = "announcementS0";
   }
   if (document.form2.coursetitle.value == '')
   {
       document.form2.coursetitle.value = msg1407;
   } 
   var msgtitle = msg1135; 
   if (i==2) msgtitle = msg1136;
   
   myprompt("<iframe id=searchif name=searchwn width=280 height=400 scrolling=no ></iframe>",null,null,msgtitle);
   formnewaction(document.form2 );
   visual(document.form2);
   document.form2.submit();
   document.getElementById('searchif').style.width = '280px';
}
function loadediframe(fw)
{
    var btn = fw.document.thisform.savebtn;
    var newbtn = null;
    if (typeof(fw.document.thisform) != 'undefined' && typeof(fw.document.thisform.savebtn1) != 'undefined')
    {
        newbtn = fw.document.thisform.savebtn1;
        newbtn.parentNode.removeChild(newbtn);
    }
    btn.parentNode.align = 'center';
    var xy = fw.findPositionnoScrolling(btn);
    var w = btn.offsetWidth + 2*xy[0] + 6;
    var h = btn.offsetHeight + xy[1] + 10;
    var f = document.getElementById('searchif');
    f.style.width  = w + 'px';
    f.style.height = h + 'px';
    shortent(w,h);
}
function shortent(w,h)
{
    promptsetwidth(w); 
    setRoundedHeight(promptwin, h); 
}
function resizeinputs()
{
   var inputs = document.getElementsByTagName("input");
   for (var i=0; i < inputs.length; i++)
   {
      if (browserstr.indexOf('MSIE') >= 0
         && (inputs[i].type=='button' || inputs[i].type=='submit'))
         inputs[i].style.height = (font_size + 6) + 'px';
   }
}
resizeinputs();

var C = [1,1,1,1];
var D = [1,1,1,1];
var order = 1;
sort = function(td, j)
{
   var tr = td.parentNode;
   var tbl = tr.parentNode; 
   if (tbl.tagName.toLowerCase()!='table') tbl = tbl.parentNode;
   var x = [];
   if (tbl.id.indexOf("ann") == 0)
   {
       order = D[j]; D[j] *= -1;
       for (var i=0; i < an; i++)
       {
           x[i] = document.getElementById('ann'+i).rows[0].cells[j].innerHTML.replace(/<[^>]+>/g,'');;
       }
   }
   else    
   {
       order = C[j]; C[j] *= -1;
       for (var i=0; i < mn; i++)
       {
           x[i] = document.getElementById('msg'+i).rows[0].cells[j].innerHTML.replace(/<[^>]+>/g,'');;
           if (j==0) x[i] = x[i].replace(/(msg1504):(.*)/,"$2:$1").replace(/(msg151):(.*)/,"$2:$1")
       }
   }
   var y = []; for (var i=0; i<x.length; i++) y[i] = i;
   y.sort(function(p,q){ if (j==0) if (x[p] > x[q]) return order; if (x[p] < x[q]) return -order; return order*(p - q);});



   if (tbl.id.indexOf("ann") == 0)
   {
       for (var k=0; k < 6; k++)
       {
           var m =0, n = k; if (k>4) {m=1; n = 0;}
           for (var i=0; i < an; i++)
           {
               x[i] = document.getElementById('ann'+i).rows[m].cells[n].innerHTML;
           }
           for (var i=0; i < an; i++)
           {
               document.getElementById('ann'+i).rows[m].cells[n].innerHTML = x[y[i]];
           }
       }
   }
   else   
   {
       var tt = '';
       for (var k=0; k < 6; k++)
       {
           var m =0, n = k; if (k>4) {m=1; n = 0;}
           for (var i=0; i < mn; i++)
           {
               x[i] = document.getElementById('msg'+i).rows[m].cells[n].innerHTML;
           }
           for (var i=0; i < mn; i++)
           {
               document.getElementById('msg'+i).rows[m].cells[n].innerHTML = x[y[i]];
               if (j==k) tt += x[y[i]]+ "\n"
           }
       }
      
   }

}