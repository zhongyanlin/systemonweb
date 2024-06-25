//assignname, Score, at, Notes, Format, Options, Semester, course, sid, timenow,
//         0,    1,  2,  3 ,    4,      5,        6,        7,      8,   9 
//Type,  sessionname, due, Content, attach, dummy, status, subs,question, answer, Assess, Attachat, Scale£¬ aformat
//10,     11,         12,       13,    14,    15,     16,   17,      18,     19,     20,        21,    22,      23


function freeformat(Z)
{ 
    var x = content;
    if (format != '0')
    {
         x = checkh(x, true);
         needtranslator = true;
    }
     
    x = formatstr(addbreak(x, 1), format);
    
    if (type == '0' || type == '2')
    {
         x = x.replace(/\/\/\/\/([^<]+)/g, "<font color=red>//$1</font>");
         x = x.replace(/<scr.pt/ig, "&lt;sc" + "ript").replace(/<\/scr.pt/ig, "&lt;/scr" + "ipt");
    }
    
    var hw;
    var due = (answer != '' && score != '-1');
   
    var attstr = ResizeUploaded.unzip(attachat);
    if (due)
    {
         hw = new Hwtake('rev', '', '', attstr, '', '', Z);
    }
    else
    {   
         hw = new Hwtake('rev', '', '', attstr.replace(/^[^@]+@[^@]@_[^,]+,/, "").replace(/,[^@]+@[^@]@_[^,]+,/, ","), '', '', Z, true);
        
    }
    addcss2head(Z, hw.divs);
    
    //assignname, Score, at, Notes, Format, Options, Semester, course, sid, timenow,
//         0,       1,    2,  3 ,    4,      5,        6,        7,      8,   9   
//Type,  sessionname, due, Content, attach, dummy, status, subs,question, answer, Assess, Attachat, Scale£¬ aformat
//10,     11,         12,       13,    14,    15,     16,   17,      18,     19,     20,        21,    22,      23
    var aa = ResizeUploaded.unzip(attachat).replace(/,([0-9]+)@/g, ',100$1@');
     
    var z = hw.merge(addbreak1(formatstr(addbreak(question,1),aformat)));
    var w = '';
    if (due)
        w = hw.merge(addbreak1(formatstr(addbreak(answer,1),aformat)));
    var y = hw.attachheader;
    hw.divs = hw.attachheader = '';
    hw.parseAttach(ResizeUploaded.unzip(attach).replace(/,([0-9]+)@/g, ',100$1@'));
    addcss2head(Z, hw.divs, '1');
    
    attheader = hw.attachheader;
    var ans = hw.merge(addbreak1(x)).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
    x =  '';
    if (y != '') 
    {
        x =  "<table class=outset1 width=100% style=\"background-color:" + TBGCOLOR +";margin:0px 0px 0px 0px;font-family:inherit\" cellpadding=3 cellspacing=0><tr><td><img src=\"image/clip.png\" width=28 >" + y + "</td></tr></table><div style=width:100%;height:5px;background-color:transparent></div>";
    }  
    
    x += "<table  id=\"t" + Z  + "\" class=outset1 width=100% style=\"background-color:" + TBGCOLOR +";margin:0px 0px 0px 0px;font-family:inherit\" cellpadding=3 cellspacing=0><tr><td valign=top align=left width=5% ><nobr><b>" + textmsg[456] + "</b></nobr></td><td valign=top align=left>" + z + "</td></tr><tr><td valign=top align=left><nobr><b>"
    + textmsg[139] + "</b></nobr></td><td valign=top align=left>" + ans + "</td></tr>";
    if (due)
    {
        x += "<tr><td valign=top align=left><nobr><b>" + textmsg[457] + "</b></nobr></td><td valign=top align=left>" + w + "</td></tr>";
    }
    return x  +"</table>";
}


function previewass()
{
     var format = f1.format.value;    
     var asssignname = f1.assignname.value
     var course = f1.course.value
     var sessionname = f1.sessionname.value
     var semester = f1.semester.value
     var attach = f1.attach.value
     var content = f1.content.value
     var score = ''
     var at = '';
     var notes = '';
     var options = '';
     var sid = '';
     var timenow = (new Date()).getTime();
     var type = 1;
     
}


function format1(assignname,score,at,notes,format,options,semester,course,sid,timenow,type,sessionname,due,content,attach,dummy,status,
subs, question,answer,assess, attachat, scale, aformat)
{    

    var asg = null;
    var due = (answer != '' && score != '-1'); 
    var parse = new CSVParse(x, "'", ",", "\r\n");
    var attstr = ResizeUploaded.unzip(attachat); 
    var hw = new Hwtake('rev',question,'', attstr.replace(/^[^@]+@[^@]@_[^,]+,/,"").replace(/,[^@]+@[^@]@_[^,]+,/,","), assess,aformat,Z,true);
    var txt = "";
    addcss2head(Z, hw.divs);
    var atd = null;
    {
        var sol = parse.nextMatrix();
        var qarr = hw.quesnums;
        var numq = qarr.length;
         
        atd = new Array();
        for (var p=0; p < numq; p++)
        {
            var num = hw.quesnums[p];
            var j = parseInt(num);
            
            var bb = false;
            var j0=0;
            if (asg != null)
            {
               j0=0; 
               for(; j0 < asg.length; j0++) 
               {
                   if (num == asg[j0][0]) 
                       break;
               }
               bb =  (j0 < asg.length && asg[j0].length>2);
            }
            var bs = false;
            var j1=0;
            for (;j1 < sol.length; j1++)
            {
                if (sol[j1][0] == num)
                {
                    bs = true;
                    break;
                }
            }
            var quess = hw.questarr[j];
            if (quess == null) quess = '';
            atd[p]  = 
            [  
               num,
              ( bs?  sol[j1][4] : ''),
              ( hw.ptlist[j] == null? '1': hw.ptlist[j] ),
              ( bb?asg[j0][2]:'0' ).replace(/([0-9])\.[0]+$/,'$1').replace(/^[0]*\.[0]*$/,'0'),
                '', //( hw.outcome[j] == null?'':hw.outcome[j]),
              (bs? sol[j1][2] : '0'),
              (bs? sol[j1][3] : aformat),
               quess,
              (bs?  sol[j1][1]: ''),
              ( hw.answqrr[j] != null? hw.answqrr[j] : ''),
              ( bb? asg[j0][3] : '')
            ];
        }
        
        if (asg != null &&  asg[asg.length-1] != null)
        {
            var N = asg.length-1;
            atd[p]  = 
            [   
                asg[N][0],
                asg[N][1],
                asg[N][2],
                asg[N][3],
                asg[N][4],
                asg[N][5],
                asg[N][6]
            ];
        }
    }
    if (atd.length == 1) return x;
    if (hw.header0.replace(/ /g,'') != '' || hw.attachheader.replace(/ /g,'') != '')
        txt += "<table  class=outset1  style=background-color:" + TBGCOLOR +";font-family:inherit   width=100% cellspacing=1  cellpadding=0><tr><td>"  + hw.header0 +  (hw.attachheader == ""?"":("<br><img src=\"image/clip.png\"  width=28>" + hw.attachheader )) +   "</td></tr></table><div style=width:100%;height:5px;background-color:transparent></div>";
    txt +="<table id=\"t" + Z  + "\" style=background-color:" + TBGCOLOR +";font-family:inherit width=100%  cellspacing=0  cellpadding=4 >";
    var thisfmt = aformat;
    hw.attachheader = hw.divs = '';
    hw.parseAttach(ResizeUploaded.unzip(attach).replace(/,([0-9]+)@/g, ',100$1@' )); 
    addcss2head(Z, hw.divs, '1');
    attheader = hw.attachheader;
    
    var cellw = "200";
    var tablename = "t" + Z;
    var graded = true;
    var N  = atd.length -1; 
    if (!due) N++;
    for (var i = 0; i <   N  ; i++)
    {
        
        if ( atd[i].length == 11)
        {
           if ((atd[i][7]==null||atd[i][7]=='') && (atd[i][8]==null||atd[i][8]=='') && (atd[i][9]==null||atd[i][9]=='')  )  continue;
          if ( (atd[i][6] == '4'||atd[i][8] == '')  )
            {
                atd[i][7] = addbreak(atd[i][7] );//tt.replace(/\n([a-z][ |\\.|\\)|\]|:])/ig, '<br>$1');
            } 
           
            var tt = formatstr( atd[i][7], thisfmt ); 
             
            if (tt.indexOf('____') >= 0)
            {  
                tt = mergeunderscore(tt,atd[i][8].replace(/</g,'&lt;').replace(/>/g,'&gt;')); 
            }
            tt = hw.merge(tt);
            
            if ( (atd[i][6] == '4'||atd[i][8] == '')  )
            {
                tt = addbreak1(tt);
            }
            var rfmt = atd[i][6];
            if ( ''+rfmt == '4')
                rfmt = aformat;
            
            txt += "<tr bgcolor=white><td  width=5% valign=top align=left class=b1001 style=border-top-left-radius:4px; ><nobr><b><div class=circlebg>" + atd[i][0] + "</div>";
            txt += "</b></nobr></td><td  colspan=";
            if (due)
            {
                txt += "3 width=100% class=b1100  style=border-top-right-radius:4px;word-wrap:break-word  align=left >" + tt  + "</td>";
            }
            else
            {
                txt += "1 width=100% class=b1000 style=word-wrap:break-word  align=left >" + tt  + "</td><td class=b1000    width=5%  valign=bottom align=left><b><nobr>" 
                        + textmsg[1268] + "</nobr></b></td><td  class=b1100  style=border-top-right-radius:4px;   width=5%  align=left  valign=bottom >"  + atd[i][2] + "</td>";
            }
            txt += "</tr>";
           
            var ans = formatstr(atd[i][8], rfmt);
          
            ans = hw.merge(ans).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
         
             
            txt += "<tr  bgcolor=white><td  width=5%   valign=top align=left class=b0001 " +  (!due? 'style=border-bottom-left-radius:4px' : '') + "  ><nobr><b>" + textmsg[139] + "</b></nobr></td><td width=85%  align=left   style=\"color:purple;font-size"+font_size +"\">" + ans + "</td>";
            
            if (type == '4')
               txt += "<td   width=5%  valign=top align=left><nobr><b>" + textmsg[1309]  + "</b></nobr></td><td  width=5%  align=left  valign=top   class=b0100  style=\"color:purple" + (!due?';border-bottom-right-radius:4px':'') + "\">"  + atd[i][5]  + "</td></tr>";
            else
               txt += "<td   width=5%  valign=top align=left><nobr><b>" + textmsg[1310]  + "</b></nobr></td><td  align=left  valign=top  width=5%   class=b0100  style=\"color:purple" + (!due?';border-bottom-right-radius:4px':'') + "\">"  + atd[i][5]  + "s</td></tr>"; 
                
            if (due) 
            {   
                txt += "<tr  bgcolor=white><td  width=5%   valign=top align=left  class=b0001   ><nobr><b>" + textmsg[457] + "</b></nobr></td><td   width=85%  align=left >" + formatstr(atd[i][9], thisfmt )+ "</td>";
                txt += "<td  width=5%   valign=top align=left><b><nobr>" + textmsg[1268]  + "</nobr></b></td><td   align=left   valign=top    class=b0100   >"  + atd[i][2] + "</td></tr>";
                var fts =  formatstr( atd[i][10], thisfmt );
                if (fts == '') fts = '&nbsp;';
                fts = hw.merge(fts).replace(/imagelet([0-9]+)/g, 'imagelet100$1');
                txt +=  "<tr  bgcolor=white><td  width=5%   valign=top align=left  class=b0011  style=border-bottom-left-radius:4px; ><nobr><b>" + textmsg[541] + "</b></nobr></td><td  width=85%   valign=top  align=left colspan=1  class=b0010  style=\"color:red\">";
                var answerpic = "answerhalf.gif";
                if (parseFloat(atd[i][2]) == parseFloat(atd[i][3]) )
                    answerpic = "answerright.gif";
                else if (parseFloat(atd[i][3]) == 0.0)
                    answerpic = "answerwrong.gif";
                txt += "<table><tr><td  valign=top ><img src=\"image/" + answerpic   + "\" ></td><td  valign=top >" + fts +  "</td></tr></table></td>";
                txt += "<td  width=5%  valign=top align=left  class=b0010  ><b><nobr>" + textmsg[1311]  + "</nobr></b></td><td  width=5%   valign=top  align=left   class=b0110  style=\"border-bottom-right-radius:4px;color:red\" >"   + atd[i][3] + "</td></tr>";
            }
            txt += "<tr ><td colspan=4 style=\"width:100%;height:1px;background-color:" + BBGCOLOR +"\"></td></tr>";

        }
        else if (atd[i].length == 6)
        {
                if (i == 0)
                txt += "<tr><td width=50 align=right><nobr><b>" + textmsg[542] + "</b></nobr></td><td  align=left><NOBR><b>" + textmsg[139] + "</b></NOBR></td><td width=50 align=right><NOBR><b>" + textmsg[408] + "</b></nobr></td><td width=50 align=right><NOBR><b>" + textmsg[36] + "/" +  textmsg[542] + "</b></nobr></td></tr>";
         if (atd[i][0]!=null&&atd[i][0]!='' || atd[i][1]!=null&&atd[i][1]!='' || atd[i][2]!=null&&atd[i][2]!='' )
         {
                txt += "<tr><td  width=50   align=right>" + atd[i][0] + "</td><td align=left>" + formatstr(atd[i][1], atd[i][3] ) 
                + "</td><td  width=50   align=right>" + ((atd[i][5] != '-1')?atd[i][5]:'') + "</td>"
                + "</td><td  width=50   align=right>" + atd[i][2] + "</td></tr>";
         }
        }
        else  if(atd[i].length == 2)
        {
                if (i == 0)
                    txt += "<tr><td  width=50  align=right><nobr><b>" + textmsg[542] + "</b></nobr></td><td  align=left><NOBR><b>" + textmsg[139] + "</b></NOBR></td></tr>";
                var fmt = (typeof(guessFormat)!='undefined')? guessFormat(atd[i][1]):0;
                txt += "<tr><td align=right>" + atd[i][0] + "</td><td   align=left>" + formatstr(atd[i][1], fmt ) + "</td></tr>";
        }
       else  
        {
             return x;
        }
    } 
     
    txt += "</table>";
    
    return txt;
}