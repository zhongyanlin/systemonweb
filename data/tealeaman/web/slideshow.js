var fm4 = document.f4;
for (var j=0; j < 10; j++)
   fm4.staytime.options[j] = new Option(''+ (2*(j+1)) + "s", ''+ (2*(j+1)) );
fm4.staytime.selectedIndex = 1;
var paus = 1;
var picount = 0;
var piclist = pics.split(/[ ]+/);
var nav = null;
var hasnav = false;
function showpic(i)
{
    if (paus==0)
    {
        var piclistlength = piclist.length;
        if (ismobile() && piclistlength > 4)
            piclistlength = 4;
        if (i==0)
            document.images["slide"].src = "image/slide/" + piclist[picount];
        else if (hasnav&&nav!=null&&nav.document!=null&&nav.document.images!=null)
            nav.document.images["slide"].src = "image/slide/" + piclist[picount];
        if (i==0)picount = (picount + 1)% piclistlength;
        if (fm4.staytime.selectedIndex >= 0)
        {
           var tl = parseInt(fm4.staytime.options[fm4.staytime.selectedIndex].value);
           setTimeout("showpic(" + i +")", tl*1000);
        }
    }
}
function switch1()
{
    paus = 1 - paus;
    fm4.pause.value = textmsg[820+paus];
    showpic(0);
}
function has()
{
   hasnav = false;
}
function openwhole()
{
   nav = open("", //image/slide/" + piclist[  (piclist.length + picount - 1)% piclist.length],
       "wholepic",
       "toolbar=0,menubar=1,resizable=1,top=0,left=0,width=" + screen.width +",height=" + screen.height);
   hasnav = true;
   nav.document.write("<html>" + metaencode + "<body><img name=slide src=\"image/slide/announce.jpg\" /><scrip" +  "t>if (onmydomain(opener)onunload=opener.has;</scrip" + "t></body></html>");
   showpic(1);
}
 
fm4.detail.value=textmsg[822];
