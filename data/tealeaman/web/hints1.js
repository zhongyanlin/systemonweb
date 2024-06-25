// Title: Tigra Hints
// URL: http://www.softcomplex.com/products/tigra_hints/
// Version: 1.2
// Date: 04/18/2003 (mm/dd/yyyy)
// Feedback: feedback@softcomplex.com (specify product title in the subject)
// Note: Permission given to use this script in ANY kind of applications if
//    header lines are left unchanged.
// About us: Our company provides offshore IT consulting services.
//    Contact us at sales@softcomplex.com if you have any programming rdap you
//    want to be handled by professionals. Our typical hourly rate is $20.

function THints (o_cfg, items) 
{
	this.top = o_cfg.top ? o_cfg.top : 0;
	this.left = o_cfg.left ? o_cfg.left : 0;
	this.n_dl_show = o_cfg.show_delay;
	this.n_dl_hide = o_cfg.hide_delay;
	this.b_wise = o_cfg.wise;
	this.b_follow = o_cfg.follow;
	this.x = 0;
	this.y = 0;
	this.divs = [];
	this.show  = TTipShow;
	this.showD = TTipShowD;
	this.hide = TTipHide;
	this.move = TTipMove;
        this.adjs = TTipAdjs; 
	if (document.layers) return;
	var b_IE = browserstr.indexOf('MSIE') > -1,
	s_tag = ['<div id="TTip%name%" style="visibility:hidden;position:absolute;top:0px;left:0px;',   
                 b_IE ? 'width:280px;height:60px;' : 'width:280px;height:60px;', 
                 o_cfg['z-index'] != null ? 'z-index:' + o_cfg['z-index'] : '', 
                 '"><table cellpadding="0" cellspacing="0" border="0"><tr><td class="', 
                 o_cfg.css, 
                 '" >%text%</td></tr></table></div>'].join('');
        

	this.getElem = 
		function (id) { return document.all ? document.all[id] : document.getElementById(id); };
	this.showElem = 
		function (id, hide) { this.divs[id].o_css.visibility = hide ? 'hidden' : 'visible'; };
	this.getWinSz = window.innerHeight != null 
		? function (b_hight) { return b_hight ? innerHeight : innerWidth; }
		: function (b_hight) { return document.body[b_hight ? 'clientHeight' : 'clientWidth']; };	
	this.getWinSc = window.innerHeight != null 
		? function (b_hight) { return b_hight ? pageYOffset : pageXOffset; }
		: function (b_hight) { return document.body[b_hight ? 'scrollTop' : 'scrollLeft']; };	
	if (window.opera) {
		this.getSize = function (id, b_hight) { 
			return this.divs[id].o_css[b_hight ? 'pixelHeight' : 'pixelWidth']
		};
		document.onmousemove = function () {
			myHint.x = event.clientX;
			myHint.y = event.clientY;
			if (myHint.b_follow && myHint.visible) 
                             myHint.move(myHint.visible);
			return true;
		};
	}
	else {
		this.getSize = function (id, b_hight) { 
			return this.divs[id].o_obj[b_hight ? 'offsetHeight' : 'offsetWidth'] 
		};
		document.onmousemove = b_IE
		? function () {
			myHint.x = event.clientX + document.body.scrollLeft;
			myHint.y = event.clientY + document.body.scrollTop;
			if (myHint.b_follow && myHint.visible) myHint.move(myHint.visible);
			return true;
		} 
		: function (e) {
			myHint.x = e.pageX;
			myHint.y = e.pageY;
			if (myHint.b_follow && myHint.visible) myHint.move(myHint.visible);
			return true;
		};
	}
	for (i in items) {
                document.write (s_tag.replace(/%text%/, items[i]).replace(/%name%/, i));
		this.divs[i] = { 'o_obj' : this.getElem('TTip' + i) };
		this.divs[i].o_css = this.divs[i].o_obj.style;
	}
}





function TTipShow (id) 
{
	if (document.layers) return;
	this.hide();
	if (this.divs[id]) 
        {
                if (this.n_dl_show) this.divs[id].timer = setTimeout("myHint.showD(" + id + ")", this.n_dl_show);
		else this.showD(id);
		this.visible = id;
                
	}
        this.adjs(id);
}

function TTipShowD (id) {
        
	this.move(id);
	this.showElem(id);
	if (this.n_dl_hide) this.timer = setTimeout("myHint.hide()", this.n_dl_hide);
}

function TTipMove (id) {
	var n_x = this.x + this.left, n_y = this.y + this.top;
	if (this.b_wise) {
		var n_w = this.getSize(id), n_h = this.getSize(id, true),
		n_win_w = this.getWinSz(), n_win_h = this.getWinSz(true),
		n_win_l = this.getWinSc(), n_win_t = this.getWinSc(true);
		if (n_x + n_w > n_win_w + n_win_l) n_x = n_win_w + n_win_l - n_w;
		if (n_x < n_win_l) n_x = n_win_l;
		if (n_y + n_h > n_win_h + n_win_t) n_y = n_win_h + n_win_t - n_h;
		if (n_y < n_win_t) n_y = n_win_t;
	}
	this.divs[id].o_css.left = n_x;
	this.divs[id].o_css.top = n_y;
         
}

function TTipHide () {
	if (this.timer) clearTimeout(this.timer);
	if (this.visible != null) {
		if (this.divs[this.visible].timer) clearTimeout(this.divs[this.visible].timer);
		setTimeout("myHint.showElem(" + this.visible + ", true)", 10);
		this.visible = null;
	}
         
       
}

function TTipAdjs(id) 
{
   var x = myHint.x;
   var y = myHint.y;
   var myHintdiv = this.divs[id].o_obj;
   var wd = 250;
   if (browserstr.indexOf('MSIE')>-1) 
   {
       wd = document.body.offsetWidth - 30;
   }
   else  
   {
       wd = self.innerWidth - 30;
   }
   var y1 =   0;
   if (typeof myHintdiv.offsetHeight !='undefined')
      y1 += myHintdiv.offsetHeight;
   else
      y1 += myHintdiv.scrollHeight;

   if (y - y1-40 > 0)
      y -= y1 + 40;
   else 
      y += 40;
   var x1 = 0;
   if (typeof myHintdiv.offsetWidth !='undefined')
      x1 = myHintdiv.offsetWidth;
   else
      x1 = myHintdiv.scrollWidth;
   if (x1 > wd) 
   {
       myHintdiv.style.width = "" + wd + "px";
       x1 = wd;
   }
   else if (x1 < wd - 20 && y1 > 60 )
   {
       myHintdiv.style.width = "" + (wd-20) + "px";
       x1 = wd - 20;
   }
   if (x1 > wd - x)
        x = wd - x1;
   myHintdiv.style.left = "" + x + "px";
   myHintdiv.style.top  = "" + y + "px";

}


var HINTS_CFG = {
	'top'        : 10, //  vertical offset in pixels of a hint from the mouse pointer
	'left'       : 0, //  horizontal offset of a hint from the mouse pointer
	'css'        : 'thehint', // a style class name for all hints, TD object (not used here)
	'show_delay' : 200, // the delay in miiliseconds between object mouseover and a hint appearing
                        // this is important to be non-zero to prevent "flashing"
                        // - that is tripping off hints with inadvertent mouse movements
                        // we use 500 milliseconds = 1/2 sec in this case.
	'hide_delay' : 90000, // a delay between hint appearing and hint auto-hiding
	                      // we use 90000 milliseconds = 90 seconds because
						  // we want the hint to remain until the user moves 
						  // mouse from over the object being tooltiped/hinted.
	'wise'       : true,  //when set to true, the hint will move itself in the 
                          //browser window if it otherwise would be cut off from view
	'follow'     : true, //when set to true the tooltip will track the mouse movement 
	'z-index'    : 0 // a z-index for all hint layers. This is important if you are using
                     // CSS layers and need to establish the tooltips as "highest" layer
};
 
 
 var myHint = new THints (HINTS_CFG, hints);
 function showmyhint(j)
 {
     myHint.show(j);
     
 }
 function hidemyhint()
 {
     myHint.hide();
 }