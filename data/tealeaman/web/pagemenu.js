
Tomenu.objects = [];
Tomenu.keepshowing = function(smdiv)
{
   var id = smdiv.id.substring(2).replace(/_.*/,'');
   var gaptimer = Tomenu.objects[id].gaptimer;
   if (gaptimer!=null) 
      clearTimeout(gaptimer);
   smdiv.style.visibility = "visible";
   smdiv.style.display = "block";
}
Tomenu.hidesubmenu = function(smdiv)
{
   smdiv.style.visibility = "hidden";
   smdiv.style.display = "none";
}
Tomenu.showmenu = function(lk)
{
   var tb = lk.parentNode.parentNode;
   if (tb.tagName.toLowerCase() != 'table')
       tb = tb.parentNode;
   var mu = Tomenu.objects[tb.id];
   var label = lk.innerHTML.toLowerCase();
   mu.showmenu0(label);
} 


Tomenu.hidethisone =function(i,tbid) 
{
   var mu = Tomenu.objects[tbid];
   mu.hidethisone0(i);
}

Tomenu.hidemenu = function(lk)
{
   var tb = lk.parentNode.parentNode;
   if (tb.tagName.toLowerCase() != 'table')
       tb = tb.parentNode;
   var label = lk.innerHTML.toLowerCase();
   var mu = Tomenu.objects[tb.id];
   mu.hidemenu0(label);
}

Tomenu.extend = function(dv,k)
{
    var tr = dv.parentNode.parentNode;
    var tb = tr.parentNode;
    if (tb.tagName.toLowerCase() != 'table')
       tb = tb.parentNode;
    var b = (dv.innerHTML.replace(/\s/g,'')=='+');
    var mu = Tomenu.objects[tb.id];
    mu.expand0(k,tr,b);
    dv.innerHTML = b?'-':'+';
}
function Tomenu(tb)
{
    
    this.table = tb;
    this.menulabels = [];
    this.menuitem = [];
    
    this.N = tb.rows[0].cells.length;
    this.way = this.N==1?'left':'top';
    this.submdivs = new Array(this.N); 
    this.gaptimer = null;
    
    this.init = function() 
    { 
    
    if (this.way == 'top')
    { 
    for (var i=0; i < this.N; i++)
    {
         this.menulabels[i] = tb.rows[0].cells[i].innerHTML;
         this.menuitem[i] = [];
         var j=1, k=0;
         while (true)
         {     
             if (j+1>=tb.rows.length || tb.rows[j+1].cells[i]==null 
                 || tb.rows[j+1].cells[i].innerHTML==''
                 || tb.rows[j+1].cells[i].innerHTML=='&nbsp;') break;
              
             this.menuitem[i][k++] = [tb.rows[j+1].cells[i].innerHTML, tb.rows[j].cells[i].innerHTML,tb.rows[j].cells[i].style.cssTex];
             j+=2;
         }
    }
    for ( i=tb.rows.length-1; i>=1; i--)
    {
         tb.deleteRow(i);
    }
    
    for ( i=0; i < this.N; i++)
    {
          var alink = tb.rows[0].cells[i];
          var xy = this.findPos(alink);
          xy[1] += alink.offsetHeight;
          this.createmenu(i, alink, tb.id, xy);
          alink.onmouseover = function(){Tomenu.showmenu(this);}
          alink.onmouseout =  function(){Tomenu.hidemenu(this);}
    }
    }
    else //left
    {
        j=1;
       
        for ( i=0; i < tb.rows.length; i++)
        {
            if (i==0 || tb.rows[i-1].cells[0].innerHTML.replace(/ /g,'')=='' || tb.rows[i-1].cells[0].innerHTML.replace(/ /g,'')=='&nbsp;')
            {
                k =0;
                this.menulabels[this.menulabels.length] = tb.rows[i].cells[0].innerHTML;
                this.menuitem[this.menulabels.length-1] = [];
                
            }
            else if (tb.rows[i].cells[0].innerHTML.replace(/ /g,'')!='' && tb.rows[i].cells[0].innerHTML.replace(/ /g,'')!='&nbsp;')
            { 
                if(tb.rows[i+1].cells[0].innerHTML.replace(/ /g,'')=='' || tb.rows[i+1].cells[0].innerHTML.replace(/ /g,'')=='&nbsp;')
                {
                    alert("The left menu items should be organized in this way:\nGroup1\ncaption11\nurl11\ncaption12\nurl12\ncaption13\nurl13\n\nGroup2\n...");
                }
                if (tb.rows[i].cells[0].style.width == null || tb.rows[i].cells[0].style.width == '') 
                    tb.rows[i].cells[0].style.cssText += ";width:" + tb.rows[i].cells[0].offsetWidth + 'px';
                this.menuitem[this.menulabels.length-1][k++] = [tb.rows[i+1].cells[0].innerHTML, tb.rows[i].cells[0].innerHTML,tb.rows[i].cells[0].style.cssText];
                i++;
            }
            
        }
        k = this.menulabels.length-1;
        for (  i=tb.rows.length-1; i>=0; i--)
        {
            if (i>0 && tb.rows[i-1].cells[0].innerHTML.replace(/ /g,'')!='' && tb.rows[i-1].cells[0].innerHTML.replace(/ /g,'')!='&nbsp;')
            {
                tb.deleteRow(i);
            }
            else
            {
                var c = tb.rows[i].insertCell(0);
                c.width=24;
                c.innerHTML = "<div style=\"border:1px black solid;width:14px;height:14px;line-height:14px;font-size:12px;color:black;text-align:center;vertical-align:middle;cursor:pointer\" onclick=\"Tomenu.extend(this," + k +")\">+</div>";
                c.align="center";
                c.vAlign="middle";
                k--;
            }
        }
        
      }
      Tomenu.objects[tb.id] = this; 
    }
    
    
    this.createmenu = function(i, lk, tbid, xy)
    {
     this.submdivs[i] = document.createElement("div");
     this.submdivs[i].setAttribute("id","sm" + tbid + "_" + i);
     this.submdivs[i].style.cssText = this.table.rows[0].cells[i].style.cssText;
     if (this.submdivs[i].style.border == null || this.submdivs[i].style.border == '' || this.submdivs[i].style.border =='none')
         this.submdivs[i].style.border = "1px #b0b0b0 outset";
     if (this.submdivs[i].style.backgroundColor == null || this.submdivs[i].style.backgroundColor == '' || this.submdivs[i].style.backgroundColor =='none')
         this.submdivs[i].style.backgroundColor = "white";
     this.submdivs[i].style.position="absolute";
     this.submdivs[i].style.left =  xy[0]  + "px";
     this.submdivs[i].style.top =   xy[1]  + "px";
     this.submdivs[i].style.zIndex = 20;
     document.body.appendChild(this.submdivs[i]);
     for (var j = 0; j < this.menuitem[i].length; j++)
     {
      var linkj = document.createElement("a");
      linkj.setAttribute("href", this.menuitem[i][j][0]);
      linkj.innerHTML = this.menuitem[i][j][1];
      linkj.style.cssText =  this.menuitem[i][j][2];
      if(linkj.style.width==null || linkj.style.width=='')
          linkj.style.width = this.table.rows[0].cells[i].offsetWidth + 'px';
      if(linkj.style.textDecoration==null || linkj.style.textDecoration=='' || linkj.style.textDecoration.toLowerCase()=='undeline')
          linkj.style.textDecoration = 'none';
      
      linkj.onmouseover = function(){Tomenu.keepshowing(this.parentNode);}
      this.submdivs[i].appendChild(linkj);
      this.submdivs[i].appendChild(document.createElement('br'));
     }
     this.submdivs[i].style.visibility = "hidden";
     this.submdivs[i].style.display = "none";
     if (this.menuitem[i].length>0)
     { 
        this.submdivs[i].onmouseover = function(){Tomenu.keepshowing(this);}
        this.submdivs[i].onmouseout =  function(){Tomenu.hidesubmenu(this);}
     }
   }
    
   this.gobackleft = function()
   {
       var tb = this.table;
       var ss = [];
       for (var i=0; i < this.table.rows.length; i++)
       {
           if (this.table.rows[i].cells[0].innerHTML.toLowerCase().indexOf("<div ") == 0)
               ss[ss.length] = this.table.rows[i].cells[1].style.cssText;
            
       }
       var nn = this.table.rows.length;
       for (i=0; i < nn; i++)
       {
           this.table.deleteRow(0);
       }
       for ( i=0; i < this.menulabels.length; i++)
       {
           var r = this.table.insertRow(-1);
           var c = r.insertCell(-1);
           c.style.cssText = ss[i];  
           c.innerHTML = this.menulabels[i];
           c.onclick  = function(){userclick(this);};
           for (var j=0; j < this.menuitem[i].length; j++)
           {
               r = this.table.insertRow(-1);
               c = r.insertCell(-1);
               c.style.cssText = this.menuitem[i][j][2];
               c.innerHTML = this.menuitem[i][j][1];
               r = this.table.insertRow(-1);
               c = r.insertCell(-1);
               c.style.cssText = this.menuitem[i][j][2];
               c.innerHTML = this.menuitem[i][j][0];
               c.onclick = function(){userclick(this);};
           }
           if (i < this.menulabels.length-1)
           {
                r = this.table.insertRow(-1);
                c = r.insertCell(-1);
                c.style.cssText = ss[i];
                c.innerHTML ='&nbsp;';
                c.onclick  = function(){userclick(this);};
           }
       }
       Tomenu.objects[this.table.id] = null;
   }
     
   this.goback = function()
   {
       if (this.way == 'left')
       {
           this.gobackleft();
           return;
       }
       var tb = this.table;
       var k=0;
       while (true)
       { 
         for (var i=0; i < this.N; i++)
         {
            
            if (tb.rows[2*k+1] == null )
            {
                if (this.menuitem[i][k]!=null)
                {
                var r1 = tb.insertRow(-1);
                for (var l=0; l < i; l++)
                {var c = r1.insertCell(-1);
                    c.insertHTML ='&nbsp;';
                }
                var r2 = tb.insertRow(-1);
                for ( l=0; l < i; l++)
                {   
                    c = r2.insertCell(-1);
                    c.insertHTML ='&nbsp;';
                }
                }
                else
                {
                    r1 = null;
                    r2 = null;
                }
            }
            if (r1!=null)
            {
                var c1 = r1.insertCell(-1);
                c1.style.cssText = this.menuitem[i][k][2];
                c1.innerHTML = this.menuitem[i][k][1];
                
                var c2 = r2.insertCell(-1);
                c2.style.cssText = this.menuitem[i][k][2];
                c2.innerHTML = this.menuitem[i][k][0];
                if (typeof(userclick)!= 'undefined'){ 
                c1.onclick = function(){userclick(this);};
                c2.onclick = function(){userclick(this);};
                }
            }
         }
         if (r1 == null) 
             break;
         else
             k++;
       }
       for ( i=0; i < this.N; i++)
       {
            var alink = tb.rows[0].cells[i];
            alink.onmouseover = null;
            alink.onmouseout =  null;
            for (var j =  this.menuitem[i].length-1; j>=0; j--)
            {
                this.submdivs[i].appendChild(this.submdivs[i].childNodes[j]);
            }
            document.body.removeChild(this.submdivs[i]);
       }
       Tomenu.objects[this.table.id] = null;
   }
   
   this.findPos = function(oElement, win)
   {
      if (win==null) win = self;
      if (oElement==null) return [0,0];
      if( typeof( oElement.offsetParent ) != 'undefined')
      {
         var ii = 0;
         var originalElement = oElement;
         for( var  posY = 0,posX=0; ii++<10 && oElement!=null; oElement = oElement.offsetParent )
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
   
   this.showmenu0 = function(label)
   {
       var i=0; 
       while (i < this.menulabels.length && this.menulabels[i].toLowerCase()!=label) i++;
       for (var j = 0; j < this.submdivs.length; j++)
       {
	  this.submdivs[j].style.visibility = (j==i)?"visible":"hidden"; 
	  this.submdivs[j].style.display = (j==i)?"block":"none"; 
       }
   }
   this.hidethisone0 =function(i) 
   {
      if (this.submdivs[i]!=null)
      {
         this.submdivs[i].style.visibility = "hidden";
         this.submdivs[i].style.display = "none";
      }
   }
   this.hidemenu0 = function(label)
   {
       var i=0; 
       while (i < this.menulabels.length && this.menulabels[i]!=label) i++;
       this.gaptimer = setTimeout("Tomenu.hidethisone(" + i +",'" + tb.id +"')", 250);
   }
   this.expand0 = function(k,tr,expand)
   {
       for (var i=0; i < this.table.rows.length; i++)
       {
        if (this.table.rows[i] == tr) break;
       }
       if (expand)
       {   
        var l=0;
        for(i++; l < this.menuitem[k].length; l++,i++ )
        { 
        var r = this.table.insertRow(i);
        var c = r.insertCell(-1);
        c.style.cssText = this.menuitem[k][l][2];
        c.width=24;
        c.innerHTML = '&nbsp;';
        c = r.insertCell(-1);
        c.style.cssText = this.menuitem[k][l][2];
        if (this.menuitem[k][l][1].indexOf(")")>0 || this.menuitem[k][l][1].indexOf("(") > 0)
           c.innerHTML = "<a href=\"javscript:eval('" + this.menuitem[k][l][1].replace(/'/g, "\\'") + "')\">" + this.menuitem[k][l][0] + "</a>"; 
        else
           c.innerHTML = "<a href=\"" + this.menuitem[k][l][0] + "\">" + this.menuitem[k][l][1] + "</a>";
        }
      }
      else
      {
        l=0;i++;
        for( ; l < this.menuitem[k].length; l++ )
        { 
            this.table.deleteRow(i);
        }
      }
   }
   this.init();
}

 
