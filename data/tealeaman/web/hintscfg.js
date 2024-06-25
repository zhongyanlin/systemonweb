/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
/*var HINTS_CFG = {
	'top'        : -1, // a vertical offset of a hint from mouse pointer
	'left'       : 5, // a horizontal offset of a hint from mouse pointer
	'css'        : 'hintsClass', // a style class name for all hints, TD object
	'show_delay' : 500, // a delay between object mouseover and hint appearing
	'hide_delay' : 90000, // a delay between hint appearing and hint hiding
	'wise'       : true,
	'follow'     : true,
	'z-index'    : 0 // a z-index for all hint layers
},

HINTS_ITEMS = [
   // wrap_img('images/jshints.jpg', "Dreamweaver Mx2004 Review"),
    "Just a statement with no tags", //Test comment
    "<img src='images/jshints.gif'>",
	"<p class='row'> Backward pointer/link to previous tutorial   </p>", 
	"<p class='alerter'>Forward pointer/link to next tutorial",
	"<p class='alerter'>Follower Hint"
];
 
var myHint = new THints (HINTS_CFG, HINTS_ITEMS);
*/
function wrap (s_, b_ques) {
	return "<table cellpadding='0' cellspacing='0' border='0' ><tr><td rowspan='2'><img src='images/1"+(b_ques?"q":"")+".gif'></td><td><img src='/img/pixel.gif' width='1' height='15'></td></tr><tr><td background='javascript/images/2.gif' height='28' nowrap>"+s_+"</td><td><img src='javascript/images/4.gif'></td></tr></table>"
}

function wrap_img (s_file, s_title) {
	return "<table cellpadding=5 bgcolor=white style='border:1px solid #777777'><tr><td><img src='javascript/images/%22%2Bs_file%2B%22' class='picI'></td></tr><tr><td align=center>"+s_title+"</td></tr></table>"
}
