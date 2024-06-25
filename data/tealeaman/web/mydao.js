/* mydao.js
 * Descruption:
 * This program enables excel-like editable web data grid
 * high  perfomance
 * supports textbox, checkbox, select, textarea
 * three modes: view, edit, select
 * Tab navigator
 * for edit mode sends back modified rows to server
 *
 * Author: Zhongyan Lin
 
*/

//global variables
var Mydaomdivt = null;
var Mydaomdivs = null;
var Mydaomdivc = null;
var Mydaomdiva = null;
var Mydaomtxt = null;
var Mydaomsel = null;
var Mydaomcheck = null;
var Mydaomarea = null;
var Mydaovar = null;


var Mydaopassfocus = function()
{
    if (Mydaovar!=null)
        Mydaovar.passfocus();
}
var Mydaokeystroke = function (x,y,whichc)
{
    if (Mydaovar==null) return false;
    if (whichc == 't')
    return  Mydaovar.keystrokeint(x,y);
    if (whichc == 's')
    return  Mydaovar.keystrokeins(x,y);
    if (whichc == 'a')
    return  Mydaovar.keystrokeina(x,y);
    return true;
}
var Mydaolander = function(id)
{
   return "<input class=noborder id=\"" + id +"\" type=button style=\"border:0px!important;margin:0px 0px 0px 0px;width:1px;height:1px;background-color:transparent\" onfocus=\"Mydaopassfocus()\" >";
}

var Mydaotoedit = function()
{
    var p = (' ' + this.id).split(/_/);

    var q = p[0].replace(/ /,'');
    eval("Mydaovar=dao"+q+";");
    var i = parseInt(p[1]);
    var j = parseInt(p[2]);
    Mydaovar.modify(this,i,j);
    
}

function changecolor(obj, cl)
{
   if (obj.tagName=='TD')
   {
       var p = obj.id;
       if (p==null||p=='') return;
       p = (' ' + p).split(/_/);
       var q = p[0].replace(/ /,'');
       eval("Mydaovar=dao"+q+";");
       var i = parseInt(p[1]);
       for (var j=0; j < Mydaovar.numCols; j++)
           Mydaovar.getcellbyij(i,j).style.backgroundColor=cl;
   }
}

var Mydaochangecellcolor = function(cel,cl)
{
    var p = (' ' + cel.id).split(/_/);
    var q = p[0].replace(/ /,'');
    eval("Mydaovar=dao"+q+";");
    var i = parseInt(p[1]);
    for (var j=0; j <= Mydaovar.numCols + Mydaovar.numlinks; j++)
        Mydaovar.thetable.rows[i+1].cells[j].style.backgroundColor = cl;

}

var Mydaomouseover = function()
{
    Mydaochangecellcolor(this,  "#eeeeee");
}
var Mydaomouseout = function()
{
    Mydaochangecellcolor(this,  "#ffffff");
}
var Mydaodeleter = function()
{
    var p = this.parentNode;
    var r = p.id;

    r = r.replace(/f/,'');
    eval("Mydaovar=dao"+r+";");
    Mydaovar.deleter();
}
var  Mydaooutcellclick = function()
{
    var p = this.parentNode;
    var r = p.id;
    r = r.replace(/^f/,'');
    eval("Mydaovar=dao"+r+";");
    Mydaovar.outcellclick();
}
var  Mydaoselectr = function()
{
    var p = this.id;
    var r = p.replace(/^picker/,'');

    eval("Mydaovar=dao"+r+";");
    Mydaovar.selectr();
}
var  Mydaomakemobiles = function()
{
Mydaomdivt = document.createElement("div");
Mydaomdivt.id = "mobilediv";
Mydaomdivt.style.cssText = "position:absolute;border:0px;visibility:hidden";
Mydaomdivt.innerHTML = "<input id=mobiletxt  class=editcontrol  style=\"width:1px;line-height:22px;height:22px;border:1px #b0b0b0 inset;vertical-align:middle;\"    onkeypress=\"return Mydaokeystroke(this,event,'t')\">" +  Mydaolander('land1');
document.body.appendChild(Mydaomdivt);

Mydaomdivs = document.createElement("div");
Mydaomdivs.id = "mobiledivs";
Mydaomdivs.style.cssText = "position:absolute;border:0px;visibility:hidden";
Mydaomdivs.innerHTML = "<select id=mobilesel class=editcontrol style=\"width:1px;height:22px;border:1px #b0b0b0 inset\"    onkeypress=\"return Mydaokeystroke(this,event,'s')\" ></select>" +  Mydaolander('land2');
document.body.appendChild(Mydaomdivs);

Mydaomdivc = document.createElement("div");
Mydaomdivc.id = "mobiledivc";
Mydaomdivc.style.cssText = "position:absolute;border:0px;visibility:hidden";
Mydaomdivc.innerHTML = "<input id=mobilecheck style=\"width:1px;height:22px;border:0px;background-color:transparent\"   >" +  Mydaolander('land3');
document.body.appendChild(Mydaomdivc);

Mydaomdiva = document.createElement("div");
Mydaomdiva.id = "mobilediva";
Mydaomdiva.style.cssText = "position:absolute;border:0px;visibility:hidden";
Mydaomdiva.innerHTML = "<textarea id=mobilearea  class=editcontrol style=\"width:1px;height:22px;border:1px #b0b0b0 inset;\" onkeypress=\"return Mydaokeystroke(this,event,'a')\"></textarea>" +  Mydaolander('land4');
document.body.appendChild(Mydaomdiva);
}

document.write("<div id=mobilediv style=\"position:absolute;border:0px;visibility:hidden\"><input id=mobiletxt  class=editcontrol  style=\"width:1px;height:1px;border:1px #b0b0b0 inset;vertical-align:middle;\"    onkeypress=\"return Mydaokeystroke(this,event,'t')\">" +  Mydaolander('land1') +"</div>");
document.write("<div id=mobiledivs style=\"position:absolute;border:0px;visibility:hidden\"><select id=mobilesel class=editcontrol style=\"width:1px;height:2px;border:1px #b0b0b0 inset\"    onkeypress=\"return Mydaokeystroke(this,event,'s')\" ></select>" +  Mydaolander('land2') +"</div>");
document.write("<div id=mobiledivc style=\"position:absolute;border:0px;visibility:hidden\"><input id=mobilecheck style=\"width:1px;height:2px;border:0px;background-color:transparent\"   >" +  Mydaolander('land3') +"</div>");
document.write("<div id=mobilediva style=\"position:absolute;border:0px;visibility:hidden\"><textarea id=mobilearea  class=editcontrol style=\"width:1px;height:2px;border:1px #b0b0b0 inset;\" onkeypress=\"return Mydaokeystroke(this,event,'a')\"></textarea>" +  Mydaolander('land4') +"</div>");

function Mydao(daovar,NUMROWS,NUMCOLS,numeric,keyfieldorder,ctype,hiddens,linkstr,options,  captions)
{
this.daovar = daovar;
this.mode = 'view';
this.theformat = "table";
this.numRows = NUMROWS;
this.numCols = 0;
this.linkstr = linkstr;
this.hiddens = hiddens;
this.NUMCOLS = NUMCOLS;
this.numlinks = 0;
this.numeric = numeric;
this.keyfieldorder = keyfieldorder;
this.ctype = ctype.replace(/^[ ]+/,'');
this.options = options;
this.captions =  captions;
this.landingcell = null;
this.leavingcell = null;
this.landingrn=0;
this.landingcn=-1;
this.leavingrn=0;
this.leavingcn=-1;
this.thetables = null;
this.thetable =  null;
this.oldkeyvalue = null;
this.modifiedrows = null;
this.keyfieldordernum = null;
this.pointer = null;
this.currentcolumn = null;
this.inorder = null;
this.separator = "#";
this.oldseparator = "#";
this.links = null;
this.layout = new Array();
this.windowopenlink = "_blank";
this.submitform = null;
this.picker = null;



this.init =  function()
{
    
    this.submitform = document.getElementById('f'+this.daovar);
    if(this.submitform != null &&  (typeof(this.submitform.save)!='undefined' || typeof(this.submitform.deleteb)!='undefined'))
    {
        this.mode = 'edit';
    }
    else if( (this.picker = document.getElementById("picker" + this.daovar)) != null)
       this.mode = 'select';
    else
       this.mode = 'view';
    
    if (linkstr!='')
    {
        this.links = this.linkstr.split(/;/);
        this.numlinks = this.links.length;
    }


    this.thetable =  document.getElementById("daotable_" + this.daovar);
    if (this.thetable == null)
    {

       this.theformat = "form";
       this.thetables = new Array();
       this.numRows = 0;
       while ( (this.thetable = document.getElementById("daotable_" + this.daovar + "_"+ this.numRows))!=null)
           this.thetables[this.numRows++] = this.thetable;
       this.thetable= null;
       if (this.numRows>0)
       {
           this.numCols = 0;
           var rws = this.thetables[0].rows;
           for (var j=0; j < rws.length; j++)
               this.numCols += Math.round(rws[j].cells.length/2);
       }

    }
    else
    {

        this.numRows = this.thetable.rows.length - 1;
        this.numCols = this.thetable.rows[0].cells.length - 1;
        
        if (this.links!=null)
            this.numCols -= this.numlinks;
        
    }
    if (Mydaomdivt == null)
    {
    Mydaomdivt = document.getElementById("mobilediv");
    Mydaomdivs = document.getElementById("mobiledivs");
    Mydaomdivc = document.getElementById("mobiledivc");
    Mydaomdiva = document.getElementById("mobilediva");

    Mydaomtxt = document.getElementById("mobiletxt");
    Mydaomsel = document.getElementById("mobilesel");
    Mydaomcheck = document.getElementById("mobilecheck");
    Mydaomarea = document.getElementById("mobilearea");
    }
    this.oldkeyvalue = new Array(this.numRows);
    this.modifiedrows = new Array(this.numRows);
    if (keyfieldorder!=null && keyfieldorder!='')
    {
    var x = this.keyfieldorder.replace(/,$/,'').split(/[ ]*,[ ]*/);
    this.keyfieldordernum = new Array(x.length);
    for (var i=0; i < x.length; i++)
    {
        this.keyfieldordernum[i] = parseInt(x[i]);
    }
    }
    this.pointer = new Array(  this.numRows  );
   
    this.inorder = new Array( this.numCols  );
    for (var ii = 0; ii <  this.numCols  ; ii++)
        this.inorder[ii] = 1;
    
     
    if (this.theformat=='form')
    {
        var rows = this.thetables[0].rows;

        for (i=0; i < rows.length; i++)
        {
            this.layout[i] = Math.round(rows[i].cells.length/2);

        }
    }
    if (this.mode=='edit')
    {
       if ( typeof(this.submitform.deleteb) != 'undefined')
          this.submitform.deleteb.onclick = Mydaodeleter;
       if ( typeof(this.submitform.save) != 'undefined')
       this.submitform.save.onclick = Mydaooutcellclick;
    }
    else if (this.mode =='select')
    {
       this.picker.onclick = Mydaoselectr;
    }
    //Mydaomakemobiles();
    this.initsetting();
}

this.setWindowOpenLink = function(x)
{
    this.windowopenlink = x;
}
this.coordinate = function(l)
{
   var i = 0;

   while (i < this.layout.length)
   {

       l -= this.layout[i];
      
       if (l<0)
       {
           return [i, this.layout[i]+l];
       }
       i++;
   }

   return null;
}



this.getchecker = function(i)
{
    if (this.theformat =='table')
    {   
       return this.thetable.rows[i+1].cells[0].childNodes[0];

    }

    else
        return document.getElementById("check_"+ this.daovar +"_" + i);
}

this.mobdiv = function(j)
{
    if (j < 0) return null;
    if (this.ctype.charAt(j) == 't')
        return Mydaomdivt;
    if (this.ctype.charAt(j) == 'c')
        return Mydaomdivc;
    if (this.ctype.charAt(j) == 'a')
        return Mydaomdiva;
    if (this.ctype.charAt(j) == 's')
        return Mydaomdivs;
    return null;
}

this.mobj = function(j)
{
    if (j < 0) return null;
    if (this.ctype.charAt(j) == 't')
        return Mydaomtxt;
    if (this.ctype.charAt(j) == 'c')
        return Mydaomcheck;
    if (this.ctype.charAt(j) == 'a')
        return Mydaomarea;
    if (this.ctype.charAt(j) == 's')
        return Mydaomsel;
    return null;
}
this.getlinkcell = function(i,j)
{
   if (this.theformat == 'form' || i <-1 || i >=this.numRows || j <0 || j >=this.links.length)
       return null;
   return this.thetable.rows[i+1].cells[j+1+this.numCols];

}

this.getcellbyij = function(i,j)
{
   if (i <0 || i >=this.numRows || j <0 || j >=this.numCols)
       return null;
   
   if (this.theformat == 'table')
   {
       return this.thetable.rows[i+1].cells[j+1];
   }
   else
   {
       var z = this.coordinate(j);
      
       return this.thetables[i].rows[z[0]].cells[1 + 2*z[1]];
   }
}

this.plain2html = function(str)
{
   if (this.theformat=='table')
   return "<nobr>" + str.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\n/g,'<br>') + "</nobr>";
   return  str.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\n/g,'<br>');

}

this.html2plain = function(str)
{
   if (this.theformat=='table')
   return str.substring(6,str.length-7).replace(/<br>/ig,'\n').replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&amp;/ig, '&');
   return str.replace(/\n/g,'').replace(/<br>/ig,'\n').replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&amp;/ig, '&');

}



this.comefit = function(cell, div, obj)
{
   var s = 0;
   if (this.theformat=='form')
       s = 4;
   else
       s = 1;

   div.style.width =  (cell.offsetWidth-s) + "px";
   div.style.height = (cell.offsetHeight-s) + "px";
   div.style.visibility = "visible";
   obj.style.width =  (cell.offsetWidth-s) + "px";
   obj.style.height = (cell.offsetHeight-s) + "px";
   obj.style.visibility = "visible";
   var loc =  this.findPositionnoScrolling(cell,window);
   div.style.left =   (loc[0]+1) + "px";
   div.style.top =    loc[1] + "px";
   obj.focus();
   
}

this.moveHeret = function(cell)
{

   this.comefit(cell,Mydaomdivt,Mydaomtxt);
   
   Mydaomtxt.value = this.html2plain(cell.innerHTML);

   if (Mydaomtxt.value!='' && typeof (Mydaomtxt.createTextRange) != 'undefined')
   {
      var text = Mydaomtxt.createTextRange();

      text.findText(Mydaomtxt.value);
      text.select();
   }
   if (this.theformat=='table')
       Mydaomtxt.style.textAlign = (this.numeric.charAt(j)=='1')?'right':'left';
}

this.moveHerea = function(cell)
{
   this.comefit(cell,Mydaomdiva,Mydaomarea);

   Mydaomarea.value = this.html2plain(cell.innerHTML);
}
this.findPositionnoScrolling = function( oElement, win)
{
  if (win==null) win = window;
  if (oElement==null) return [0,0];
  if( typeof( oElement.offsetParent ) != 'undefined' )
  {
    var originalElement = oElement;
    for( var  posY = 0,posX=0; oElement; oElement = oElement.offsetParent )
    {
      posY += oElement.offsetTop;
      posX += oElement.offsetLeft;
      if( oElement != originalElement && oElement != win.document.body && oElement != win.document.documentElement )
      {
          posY -= oElement.scrollTop;
          posX -= oElement.scrollLeft;
      }
    }
    return  [posX, posY];
  }
  else
  {
    return  [oElement.x, oElement.y];
  }
}

this.moveHerec = function(cell)
{
   var loc = this.findPositionnoScrolling(cell,window);
   Mydaomdivc.style.left = loc[0] + "px";
   Mydaomdivc.style.top =  loc[1] + "px";
   //Mydaomdivc.style.width =  cell.offsetWidth + "px";
   //Mydaomdivc.style.height = cell.offsetHeight + "px";
   Mydaomdivc.style.visibility = "visible";
   Mydaomcheck.checked = (this.html2plain(cell.innerHTML)!='');
   Mydaomcheck.style.visibility = 'visible';
   Mydaomcheck.focus();
}
this.getface = function(j, k)
{
     if ( this.captions != null && this.captions[j]!= null && this.captions[j][k]!=null)
     return this.captions[j][k];
     if ( this.options != null && this.options[j]!= null && this.options[j][k]!=null)
     return this.options[j][k];
     return "";
}
this.moveHeres = function(cell)
{
   this.comefit(cell, Mydaomdivs, Mydaomsel);

   var k =0;
   for (  k=Mydaomsel.options.length-1; k>=0; k--)
       Mydaomsel.options[k] = null;
   var cvalue = this.html2plain(cell.innerHTML);
   
   var corder = -1;
   for ( k = 0; k < this.options[this.landingcn].length; k++)
   {
       var facevalue =  this.getface(this.landingcn,k);
       if (facevalue == cvalue) corder = k;
       Mydaomsel.options[k] = new Option(facevalue,this.options[this.landingcn][k]);
   }

   if (corder == -1)
   {
       this.options[this.landingcn][k] = cvalue;
       this.captions[this.landingcn][k] = cvalue;
       Mydaomsel.options[k] = new Option(cvalue, cvalue);
       corder = k;
   }
   k = corder;
   Mydaomsel.selectedIndex = k;
   Mydaomsel.style.visibility = 'visible';
   Mydaomsel.focus();
}

this.modify0 = function(j)
{
  
    if (this.ctype.charAt(j)=='t')
    {
        this.moveHeret(this.landingcell);
    }
    else if (this.ctype.charAt(j)=='s')
        this.moveHeres(this.landingcell);
    else if (this.ctype.charAt(j)=='c')
        this.moveHerec(this.landingcell);
    else if (this.ctype.charAt(j)=='a')
        this.moveHerea(this.landingcell);
}

this.copyValueh = function( ele)
{
  var tag = ele.tagName.toLowerCase();
  var x = null;
  if (tag =='select')
      x = ele.options[ele.selectedIndex].value;
  else
      x = ele.checked?'x':'';

  if (x != null && this.landingcell!= null)
  {
      this.landingcell.innerHTML = this.plain2html(x);
      this.modifiedrows[this.landingrn] = true;
  }
}
this.appendRow = function(n)
{
           var i = n.rows.length;
           var rs = n.insertRow(i);

           for (var k=0; k < n.rows[i-1].cells.length; k++)
           {
               var tdele =  rs.insertCell(k);
               var st = n.rows[i-1].cells[k].style;
               for (var x in st)
               {
                  if (x.indexOf("-")<0 && (x.indexOf("font")==0 ||x.indexOf("margin")==0
                   ||x.indexOf("border")>=0 || x.indexOf("color")>=0
                   ||x.indexOf("background")==0 || x.indexOf("padding")>=0
                  ))
                  if (st[x]!='')
                  {
                     eval("tdele.style." + x +" = '" + st[x] +"';");
                  }
               }
               if (k==0)
                   tdele.innerHTML = n.rows[i-1].cells[0].innerHTML;
               else
                   tdele.onclick = Mydaotoedit;
           }
           this.oldkeyvalue[this.numRows] = '';
           for (var j=1; j < this.keyfieldordernum.length; j++)
           {
               this.oldkeyvalue[this.numRows] =  this.separator;
           }
           this.modifiedrows[this.numRows] = false;
           if (this.NUMCOLS > this.numCols)
           {
               this.hiddens[this.numRows] = new Array(this.NUMCOLS - this.numCols);
               for (j=0; j < this.NUMCOLS - this.numCols; j++)
                   this.hiddens[this.numRows][j] = this.hiddens[this.numRows-1][j];
           }
           if (this.links!=null && this.theformat=='table')
           {
              for ( j=0; j < this.links.length; j++)
              {
                 var x  = this.getlinkcell(-1,j).innerHTML.replace(/<[^>]*>/g,'');
                 var div = this.thetable.rows[this.numRows+1].cells[j+1+this.numCols];
                 div.innerHTML = "<a href=\"javascript:dao"+this.daovar+".openlink("+this.numRows+","+j +")\">" + x + "</a>";
              }
          }
           this.numRows++;

}
this.copyValuei = function(j)
{
  if (j < 0) return;
  var x = null;
  if (this.ctype.charAt(j)=='t')
      x = Mydaomtxt.value;
  else if (this.ctype.charAt(j)=='s')
      x = Mydaomsel.options[Mydaomsel.selectedIndex].text;
  else if (this.ctype.charAt(j)=='c')
      x = Mydaomcheck.checked?'x':'';
  else if (this.ctype.charAt(j)=='a')
      x = Mydaomarea.value;
  if (x != null && this.leavingcell!= null)
  {
      this.leavingcell.innerHTML = this.plain2html(x);
      this.modifiedrows[this.leavingrn] = true;
      if (this.leavingrn == this.numRows - 1 && this.theformat =='table')
          this.appendRow(this.thetable);
      window.onbeforeunload = warnlossing;
  }
  this.leavingcell.onclick = Mydaotoedit;
}

this.modify = function(td, i,j)
{
    this.leavingcell = this.landingcell;
    this.leavingrn = this.landingrn;
    this.leavingcn = this.landingcn;
    this.landingrn = i;
    this.landingcn = j;
    this.landingcell = td;
    if (this.leavingcell!=null && this.leavingcn>=0)
        this.copyValuei(this.leavingcn);
    if (this.landingcn<0 || this.leavingcn >=0 && this.leavingcn!=null && this.ctype.charAt(this.leavingcn)!=this.ctype.charAt(this.landingcn))
    {
        var mm = this.mobj(this.leavingcn);
        if (mm!=null)
        {
           mm.style.width="1px";
           this.mobdiv(this.leavingcn).style.width = "1px";
           mm.style.visibility = "hidden";
            this.leavingcell.onclick = Mydaotoedit;
        }
    }
    this.modify0(j);
}

this.outcellclick = function()
{
    this.leavingcell = this.landingcell;
    this.leavingrn = this.landingrn;
    this.leavingcn = this.landingcn;
    this.landingrn = 0;
    this.landingcn = -1;
    this.landingcell = null;
    this.copyValuei(this.leavingcn);
    var mm = this.mobj(this.leavingcn);
    if (mm!=null)
    {
       mm.style.width="1px";
       this.mobdiv(this.leavingcn).style.width = "1px";
       mm.style.visibility = "hidden";
       this.leavingcell.onclick = Mydaotoedit;
    }
}

this.nextcell = function()
{
    this.leavingcn = this.landingcn;

    this.leavingrn = this.landingrn;
    this.landingcn = this.landingcn + 1;
    if (this.landingcn == this.numCols)
    {
        this.landingcn = 0;
        this.landingrn++;
        if (this.landingrn==this.numRows)
        {
            this.landingrn=0;
            this.landingcn = -1;
            this.leavingcell = this.landingcell;
            this.landingcell = null;
            if (this.submitform!=null && typeof(this.submitform.save)!='undefined')
            this.submitform.save.focus();

        }
        else
        {
            this.leavingcell = this.landingcell;

            this.landingcell = this.getcellbyij(this.landingrn, this.landingcn);
        }

    }
    else
    {
        this.leavingcell = this.landingcell;
        this.landingcell = this.getcellbyij(this.landingrn, this.landingcn);
        
    }
}
this.passfocus = function()
{
    this.nextcell();
    this.copyValuei(this.leavingcn);
    if (this.landingcn>=0 && this.ctype.charAt(this.leavingcn)!=this.ctype.charAt(this.landingcn))
    {
            var mm = this.mobj(this.leavingcn);
            if (mm!=null)
            {
               mm.style.width="1px";
               this.mobdiv(this.leavingcn).style.width = "1px";
               mm.style.visibility = "hidden";
               this.leavingcell.onclick = Mydaotoedit;
            }
             
    }
    
    this.modify0(this.landingcn);
    
}

this.keycode = function(evt)
{
  var e = evt? evt : window.event;
  if(!e) return true;
  var key = 0;
  if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
  else if (typeof(e.which)!= 'undefined') { key = e.which; }
  return key;
}

this.keystrokeint = function(txt,evt)
{
  var key = this.keycode(evt);
  if (key==26)//undo editing
  {
      Mydaomtxt.value = this.retrv(this.landingrn,this.landingcn);
  }
  else if (key==13  )
  {
      this.passfocus();
  }
  return true;

}
this.keystrokeins = function(area,evt)
{
    return true;
}
this.keystrokeina = function(area,evt)
{
  var key = this.keycode(evt);

  if (key==26)//undo editing
  {
      area.value = this.retrv(this.landingrn,this.landingcn);
  }
  else
  if (key==13)
  {
     area.style.height = (16 + area.offsetHeight) + "px";
     this.landingcell.style.height = area.style.height;
  }
  return true;

}


this.nextsepartor = function()
{
    if (this.separator.charAt(0) == '#')
        this.separator = '@' + this.separator;
    else
        this.separator = '#' + this.separator;
}

this.buildkeyfieldvalue = function()
{
    
    if (this.keyfieldordernum==null)
    {
       return;
    }

    while (true)
    {
    var hit = false;
    for (var i=0; i < this.numRows; i++)
    {
        for (var j=0; j < this.keyfieldordernum.length; j++)
            if (this.retrv(i, this.keyfieldordernum[j]).indexOf(this.separator) >= 0)
            {
                hit = true;
                break;
            }
        if (hit) break;
    }
    if (hit) this.nextsepartor();
    else break;

    }

    this.oldseparator = this.separator;
    for (i=0; i < this.numRows; i++)
    {
        this.calculateoldkey(i);
    }
}
this.calculateoldkey = function(i)
{
    if (this.keyfieldordernum==null) return;
    this.oldkeyvalue[i] = this.retrv(i, this.keyfieldordernum[0],1 );
    for (j=1; j < this.keyfieldordernum.length; j++)
    {
        this.oldkeyvalue[i] = this.oldkeyvalue[i] + this.separator + this.retrv(i, this.keyfieldordernum[j],1);
    }
}
this.blank = function()
{

    var ans = "";
    if (this.keyfieldordernum!=null)
    for (j=1; j < this.keyfieldordernum.length; j++)
        ans += this.separator;
    return ans;
}
// if inner is null, face value returns
this.retrv = function(i, j, inner)
{
   if (isNaN(j))
   {
       return '';
   }
   if (j >= this.numCols)
   {
       if (j < this.NUMCOLS && i < this.hiddens.length)
           return this.hiddens[i][j - this.numCols];
       return '';
   }
   var cl =   this.getcellbyij(i,j);
   if (cl==null)
   {
       return '';
   }
   var x = this.html2plain(cl.innerHTML);
   if (inner == null) return x;

   if (this.ctype.charAt(j)=='s')
   {
       return this.mapface2option(j,x);
   }
   else if (this.ctype.charAt(j)=='c')
   {
       return (x=='')?'0':"1";
   }
   return x;
}

this.makedata = function()
{

   var str = "";
    while (true)
    {
    var hit = false;
    for (var i=0; i < this.numRows; i++)
    {
        for (var j=0; j < this.NUMCOLS; j++)
            if (this.retrv(i, j, 1).indexOf(this.separator) >= 0)
            {
                hit = true;
                break;
            }
        if (hit) break;
    }
    if (hit) this.nextsepartor();
    else break;
    }
    
    if (this.oldseparator!=this.separator)
    {
    var re = new RegExp (this.oldseparator, "g");
    for (i=0; i < this.numRows; i++)
    {
        this.oldkeyvalue[i] = this.oldkeyvalue[i].replace(re, this.separator);
    }
    }

    this.oldseparator = this.separator;
    this.submitform.separator.value = this.separator;
   for (  i=0; i < this.numRows; i++)
   {
       if (this.modifiedrows[i]==true)
       {

          for (  j=0; j < this.NUMCOLS; j++)
          {
              str += this.retrv(i,j, 1) + this.separator;
               
          }
       
          str += this.oldkeyvalue[i] + this.separator;
          
       }
   } 

   this.submitform.databack.value= str;
   if (str=='') return false;
   
   i = 0;
   if (document.getElementById("w"+tstmp) == null)
   {
       var fr = document.createElement("iframe");
       fr.setAttribute("width", "1");
       fr.setAttribute("id", "w"+tstmp);
       fr.setAttribute("name", "w"+tstmp);
       fr.setAttribute("height", "1");
       document.body.appendChild(fr);
   }

   this.submitform.target = "w"+tstmp;
   formnewaction(this.submitform);
   //this.submitform.action = "http://web2.cis.desu.edu/tealeaman/Echo";
   return true;
}
this.syn = function(nm,err)
{
   
    var nmarr = nm.split(/#/);
    var errarr = err.split(/#/);
    var rows = new Array();
    for (var i=0; i < this.numRows; i++)
    {
        if(  this.modifiedrows[i])
            rows[rows.length] = i;
    }
    var haserr = false;
    for ( i = 0; i < nmarr.length; i++)
    {
        if (nmarr[i] == '-1')
        {
            this.getchecker(rows[i]).checked = true;
            haserr = true;
        }
        else
        {
            if (errarr[i]=='d')
            {
                for (var j=0; j < this.NUMCOLS-this.numCols; j++)
                this.hiddens[rows[i]][j] = '';
                this.oldkeyvalue[rows[i]] = this.blank();
            }
            else if (errarr[i]=='i')
            {
                for (j=0; j < this.NUMCOLS-this.numCols; j++)
                this.hiddens[rows[i]][j] = '';
                this.calculateoldkey(rows[i]);
            }
            else if (errarr[i]=='u')
            {
                this.calculateoldkey(rows[i]);
            }
            this.modifiedrows[rows[i]] = false;
        }
    }
    if (haserr)
      
    window.onbeforeunload = null;
}

/*this.showmessage = function(x)
{
    var y = document.createElement("div");
    y.setAttribute("className", "messageshow");
    y.innerHTML = x + "<br><a href=";
    y.style.top = "200px";
    y.style.left = "200px";
}*/

this.mapoption2face = function(j,v)
{
   var k=0;
   for (; k < this.options[j].length && v!=this.options[j][k]; k++);

   if (k == this.options[j].length) return v;
   return this.captions[j][k];
}
this.mapface2option = function(j,v)
{
   var k=0;
   for (; k < this.captions[j].length && v!=this.captions[j][k]; k++);
   if (k == this.captions[j].length) return v;
   return this.options[j][k];
}
// for checkbox and select, change internal value to faces
this.change2face = function()
{
   for (var j=0; j < this.numCols; j++)
   {
       if (this.ctype.charAt(j) == 's')
       {
           for (var i=0; i < this.numRows; i++)
           {
               var m = this.getcellbyij(i,j);
               var v = m.innerHTML;

               v = this.html2plain(v);

               v = this.mapoption2face(j,v);

               v = this.plain2html(v);
                
               m.innerHTML = v;
           }
       }
       else if (this.ctype.charAt(j) == 'c')
       {
           for (i=0; i < this.numRows; i++)
           {
               m = this.getcellbyij(i,j);
               v = m.innerHTML;
               v = (v!='')? 'x':'';
               m.innerHTML = this.plain2html(v);
           }
       }
   }
}

this.mod = function(i){this.modifiedrows[i]=true;}
this.checkall = function()
{
    var x = this.thetable.rows[0].cells[0].childNodes[0].checked;
 
    for (var i=0; i < this.numRows;   i++)
    {
        this.getchecker(i).checked = x;
    }
}
this.initsetting = function()
{
  
   for (var i=0; i < this.numRows; i++)
   {
       for (var j=0; j < this.numCols; j++)
       {
           var div = this.getcellbyij(i,j);
           div.id = this.daovar + "_" + i + "_" + j;
           if (this.mode == 'edit')
               div.onclick = Mydaotoedit;
           if (this.theformat=='table')
           {
               div.innerHTML = "<nobr>" + div.innerHTML + "</nobr>";
               div.onmouseover = Mydaomouseover;
               div.onmouseout = Mydaomouseout;
               if ( this.ctype.charAt(j)=='c')
                   div.align='center';
               else if (this.numeric.charAt(j)=='1' && (this.ctype.charAt(j)=='t' || this.ctype.charAt(j)=='s'))
                   div.align='right';
               else
                   div.align = 'left';
           }
           if (this.theformat=='form'  && this.ctype.charAt(j)=='a' && div.offsetHeight < 100)
               div.style.height = '100px';

       }

   }
   this.buildkeyfieldvalue();
   if (this.theformat=='table' && this.links!=null)
   for ( j=0; j < this.links.length; j++)
   {
       var x  = this.getlinkcell(-1,j).innerHTML.replace(/<[^>]*>/g,'');
       for ( i=0; i < this.numRows; i++)
       {
           div = this.getlinkcell(i,j);
           div.innerHTML = "<a href=\"javascript:dao"+this.daovar+".openlink("+i+","+j +")\">" + x + "</a>";
       }
   }
   this.change2face();

   if (this.mode=='select')
   {
      var names = '';
      if (onmydomain(opener) && typeof(opener.passName) != 'undefined')
         names = opener.passName();
     
      this.initsel(names,3);
   }
   
}


this.openlink = function(i,j)
{
   var xx = window.onbeforeunload;
   this.outcellclick();
   window.onbeforeunload = null;
   var f = document.sendform;
   if (f==null) 
   {
    
       return;
   }
   var c = f.childNodes;
   if (c!=null)
   for (var k=c.length-1; k>=0; k--)
       f.removeChild(f.lastChild);

   var para = this.links[j].replace(/\?/,'&').split(/&/);

   for (  k=1; k < para.length; k++)
   {
      var x = para[k].split(/=/);
      
      var p = document.createElement("input");
      p.setAttribute("type", "hidden");
      p.setAttribute("name", x[0]);
      if (x[1].match(/@[0-9]+@/))
      {
      var n = parseInt(x[1].replace(/@/g,''));
      var y = this.retrv(i,n);
      }
      else
          y = x[1];
      p.setAttribute("value", y);
      f.appendChild(p);
   }
    formnewaction(f, para[0]);
    f.target = this.windowopenlink;
  
 f.submit();
    window.onbeforeunload = xx;

}

this.swap1 = function(a)
{
           var b = new Array(this.numRows);
           for (var i = 0; i < this.numRows; i++)
              b[i] = a[i];
           for ( i = 0; i < this.numRows; i++)
             a[i] = b[this.pointer[i]];
}

this.swap2 = function()
{
           var b = new Array(  this.numRows );
           for (var c = 0; c <  this.numCols ; c++)
           {
               for (var i = 0; i <  this.numRows ; i++)
                  b[i] = this.retrv(i,c);
               for ( i = 0; i <  this.numRows ; i++)
                  this.getcellbyij(i,c).innerHTML = this.plain2html(b[this.pointer[i]]);
           }
}

this.swap3 = function(a )
{
    if (a==null) return;
           var b = new Array(  this.numRows );
           for (var c = 0; c <  a[0].length ; c++)
           {
               for (var i = 0; i <  this.numRows ; i++)
                  b[i]    =  a[i][c];
               for (  i = 0; i <  this.numRows ; i++)
                  a[ i][c] = b[this.pointer[i]];
           }
}

this.parseDouble = function(s)
{
            var ar = s.split('.');
            var t = parseInt(ar[0]);
            if (ar.length==1) return t;
            var l = ar[1].length;
            return t + parseInt(ar[1])* Math.pow(10,-l);
}
this.swaptwoarrayele = function(arry, i,j)
{
           var T = arry[i];
           arry[i] = arry[j];
           arry[j] = T;
}
this.swapp = function(i,j)
{
    this.swaptwoarrayele(this.pointer, i,j)
}
this.compare = function(u,v )
{
          var an = 0;
          if (this.retrv(v,this.currentcolumn) == '' && this.retrv(u,this.currentcolumn) ==  '')
              return u - v;

         else  if (this.retrv(u,this.currentcolumn) ==  '' && this.retrv(v,this.currentcolumn) != null)
              an = -1;

          else if (this.retrv(v,this.currentcolumn) ==  '' && this.retrv(u,this.currentcolumn) != null)
              an = 1;

          else  if ( this.numeric.charAt(this.currentcolumn) == '1')
          {
             if ( parseFloat(this.retrv(u,this.currentcolumn)) < parseFloat(this.retrv(v,this.currentcolumn)) )
                an = -1 ;

             else if ( parseFloat(this.retrv(u,this.currentcolumn)) > parseFloat(this.retrv(v,this.currentcolumn)) )
                an = 1 ;
             else
                 return u - v;
          }
         else
         {
          if ( this.retrv(u,this.currentcolumn) < this.retrv(v,this.currentcolumn) )
               an = -1;

          else if ( this.retrv(u,this.currentcolumn) > this.retrv(v,this.currentcolumn) )
               an = 1;

          else
                return u - v;
          }
          return ( (this.inorder[this.currentcolumn] == 0)?an:(-an));
       }


this.mergesort = function(list)
{
          var k;
          k = Math.floor(list.length/2);
          if (k < 1) { return; }
          var left = new Array();
          var right = new Array();
          while (list.length>k) { left.push(list.shift()); }
          while (list.length>0) { right.push(list.shift()); }
          this.mergesort(left);
          this.mergesort(right);
          while ((left.length > 0) && (right.length > 0))
          {
              if (this.compare(left[0],right[0]) < 0)
              { list.push(left.shift());  }
              else
              { list.push(right.shift()); }
          }
          while (left.length > 0)
          {
             list.push(left.shift());
          }
          while (right.length > 0)
          {
             list.push(right.shift());
          }
          return;
 }

 
this.sort = function(j)
{
           this.outcellclick();
           this.currentcolumn = j; this.inorder[j] = 1 - this.inorder[j];
           var sel = new Array( this.numRows);
           for (var i = 0; i <  this.numRows ; i++)
           {
              this.pointer[i] = i;
              if (this.mode=='select' || this.mode=='edit')
              sel[i] = this.getchecker(i).checked;
           }
           this.mergesort(this.pointer);

           if (this.mode=='select' || this.mode=='edit')
           {
              this.swap1(sel);
              for (i = 0; i <  this.numRows ; i++)
                  this.getchecker(i).checked = sel[i];
           }
           this.swap1(this.oldkeyvalue);
           this.swap1(this.modifiedrows);
           this.swap2();
           this.swap3(this.hiddens);
            
}

this.deleter = function()
{
    this.outcellclick();
    var x = confirm(textmsg[0]);
    if (x == true)
    {
        for (var i=0; i < this.numRows; i++)
        {
            var t = this.getchecker(i).checked;

            if (t)
            {
                this.modifiedrows[i]=true;
                for (var j=0; j < this.numCols; j++)
                {
                    this.getcellbyij(i,j).innerHTML = this.plain2html('');
                    if (this.landingrn == i && this.landingcn == j)
                        this.mobj(j).style.visibility = 'hidden';
                }
                for (; j < this.NUMCOLS; j++)
                {
                    this.hiddens[i][j-this.numCols] = '';
                }
            }
            this.getchecker(i).checked = false;
        }
    }
}

this.selectr = function()
{
   var i=0;
   var zz = new Array(this.numRows);
   for (; i<this.numRows; i++)
       zz[i] = (this.getchecker(i).checked);
   if (onmydomain(opener) && typeof(opener.onlinetoolgetselected) != 'undefined')
   opener.onlinetoolgetselected(zz, this);
   var win=window.open('','_top','',true);win.opener=true;win.close();
}

this.initsel = function(names,k)
{
   names = "," + names;

   for (var i=0; i<this.numRows; i++)
   {
      this.getchecker(i).checked = (names.indexOf(","+this.retrv(i,k) +",") >=0);
   }
}

}

function warnlossing()
{
   return textmsg[3];
}


 