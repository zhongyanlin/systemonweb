
function Viewport1()
{
    this.windowX = (document.documentElement && document.documentElement.clientWidth) || window.innerWidth || self.innerWidth || document.body.clientWidth;
    this.windowY = (document.documentElement && document.documentElement.clientHeight) || window.innerHeight || self.innerHeight || document.body.clientHeight;
    this.scrollX = (document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || self.pageXOffset || document.body.scrollLeft;
    this.scrollY = (document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || self.pageYOffset || document.body.scrollTop;
    this.pageX =   (document.documentElement && document.documentElement.scrollWidth) ? document.documentElement.scrollWidth : (document.body.scrollWidth > document.body.offsetWidth) ? document.body.scrollWidth : document.body.offsetWidth;
    this.pageY =   (document.documentElement && document.documentElement.scrollHeight) ? document.documentElement.scrollHeight : (document.body.scrollHeight > document.body.offsetHeight) ? document.body.scrollHeight : document.body.offsetHeight;
}

function resizeCont()
{}

document.f1.destination.onfocus = function()
{
      var wd = (document.documentElement && document.documentElement.clientWidth) || window.innerWidth || self.innerWidth || document.body.clientWidth;
      var het = (document.documentElement && document.documentElement.clientHeight) || window.innerHeight || self.innerHeight || document.body.clientHeight;
      document.f1.destination.style.height=   "200px";
      document.f1.destination.style.width=   "200px";
      wd -= 24;
      
      het -= 150;
      if (het < 400) het = 400;
      document.f1.destination.style.width = "" + wd+  "px";
      document.f1.destination.style.height= "" + het+ "px";

} 