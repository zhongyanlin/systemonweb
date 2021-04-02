var bs='';
var saved=true;
var edithtml = document.f1.destination.value.indexOf("<!--created by wyswyg tool-->") > 0;
if (edithtml)
{
    saveorupdatelabel = textmsg[67];
}
function chnfontsize(sel)
{
    document.f1.destination.style.fontSize=sel.options[sel.selectedIndex].text;
    document.f1.destination.style.lineHeight=Math.round(1.4*parseInt(''+sel.options[sel.selectedIndex].value)) + 'px';
}
function renull(fn,len,str,ltime)
{
    if ( onmydomain( opener) == false) return;
    opener.addedItem(fn,str,len,ltime);
    window.onbeforeunload=null;
    saved=true;
    if (edithtml == false)
    {
        myprompt(textmsg[1655]);
        focus();
        setTimeout( closeprompt ,1500);
    }
    else
    {
        myprompt(textmsg[1655], null,null,null,'messageid');
        document.getElementById('messageid').style.zIndex = 31;
        setTimeout(removemid,1500);
    }
}
function removemid()
{
    document.body.removeChild(document.getElementById('messageid'));
}
function msg()
{
    if (bs!=document.f1.destination.value)
    {  
        return textmsg[791];
    }
}
function s(x)
{
    resizeCont();
    if (saved)
        bs=x.value;window.onbeforeunload=msg;
}
function t(x)
{
    resizeCont(); 
    if(x.value!=bs)saved=false;
}

function setaction(op)
{
    openwin();
    document.f1.target='tinyerr0';
    document.f1.action=op; 
    if (edithtml == false)
        myprompt(textmsg[86]);
}
function openwin() 
{
    var nav1 = window.open('', 'tinyerr0');
    nav1.document.body.innerHTML = '';
    return true;
}


function syn(x){return 1;};
function whenwyewygchange(ta)
{
    document.f1.submit.click();
}
function onstart1()
{
    opener.syn1();
    wyewyg(document.f1.destination);
}

  
for (var i=0; i <= 30; i++)
{
    document.f1.fontsize.options[i]=new Option((12+i*2) + 'px',(12+2*i));
    if( Math.abs(font_size - 10-i*2) <=1 ) 
        document.f1.fontsize.selectedIndex=i;
}
resizeCont();
document.write(unifontstyle(font_size));
if (typeof(document.f1.htmledit)!='undeifned' && document.f1.htmledit!=null)
{ 
    document.f1.htmledit.value=textmsg[1378];
}
textareatobesearch=document.f1.destination;
resizebut(document.f1);
var oldonload3=window.onload;
window.onload=function()
{
    document.title = document.f1.filedir.value;
    if (oldonload3!=null)oldonload3(); 
    if (edithtml) onstart1();
}


