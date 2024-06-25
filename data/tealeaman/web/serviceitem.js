/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
function fresh(){} 
var opened = new Array();
var N = 100;
var z = new Array(N);
var full = ''+screen.width+''+screen.height;  
z[0] = ['instruct', 'Singup', 1, textmsg[355]];
z[1] = ['DataForm?subdb=&rdap=userself',    'Updaterecord',   1,  textmsg[356]];
z[2] = ['DataForm?rsacode=2&exbut=cp&rdap=userresetpass',    'Changepassword', 1, textmsg[357]];
z[3] = ['DataTable?rdap=mycourse&subdb=', 'mycourse', 1,  textmsg[360]];
z[5] = ['DataSearch?rdap=mystudent0&dim=900700&subdb=','mystudent',1, textmsg[695]];
z[4] = ['DataTable?rdap=mysession&subdb=','session', 1, textmsg[362]];
z[6] = ['webfiles.jsp', 'webfolder', 1, textmsg[363]];
z[7] = ['announcement.jsp', 'anounce', 1, textmsg[365]];
z[8] = ['DataSearch?rdap=messages0&dim=900700&preop=messages0&subdb=', 'message',1,  textmsg[388]];
z[9] = ['talk.jsp', 'talks',1, textmsg[366]];
z[10] = ['dboperation.jsp', 'database', 1, textmsg[367]];
z[11] = ['tables.jsp','tables',1, textmsg[368]];
z[12] = ['userrdaps.jsp','slqcenter',1, textmsg[369]];
z[13] = ['login.jsp?follow=announcement.jsp','Login',1, textmsg[389]];
z[14] = ['login.jsp?follow=logout','Logout',0, textmsg[371]];
z[15] = ['sessioninfo.jsp?','SessionInfo',0, textmsg[372]];
z[16] = ['assignment.jsp','Assign',1, textmsg[374]];
z[17] = ['DataSearch?rdap=grading0&dim=900700&exbut=h&subdb=','Select',1, textmsg[375]];
z[18] = ['grades.jsp','recods',1, textmsg[376]];
z[19] = ['aggregate.jsp','aggregate',1, textmsg[377]]; 
z[20] = ['DataSearch?rdap=webservices0&dim=900700&subdb=','operation',1, textmsg[379]];
z[21] = ['servicecourse.jsp','courseop',1, textmsg[380]];
z[22] = ['utf-8.html', 'whitepap', 1, textmsg[382]];
z[23] = ['defect.jsp', 'defects', 1,textmsg[383]];
z[24] = ['discussview1.jsp?course=TeaLeaMan&coursetitle=' + textmsg[384],'forum',1, textmsg[384]];
z[26] = ['student.jsp?submit=ToSelect','Student',1, textmsg[386]];
z[27] = ['studentlogin.jsp?follow=studentpage.jsp','Student',1, textmsg[389]];
z[28] = ['studentlogin.jsp?submit=Logout','Logout',1, textmsg[371]];
z[29] = ['adminlogin.jsp','adminlogin',1, textmsg[389]];     
z[30] = ['adminlogin.jsp?submit=Logout','adminlogin',1, textmsg[371]];
z[31] = ['adminlogin.jsp?submit=ToChange','adminlogin',1, textmsg[357]];
z[32] = ['admincfg.jsp','admincfg',1, textmsg[390]];
z[33] = ['DataSearch?rdap=userlist0&subdb=','adminuser',1, textmsg[391]];

z[34] = ['scheduler.jsp','scheduler',1, textmsg[392]];
z[35] = ['login.jsp', 'inslogin', 1, textmsg[389]];
z[36] = ['feedback.jsp', 'feedback', 1, textmsg[400]];
z[37] = ['dbapplication.jsp', 'dbapplic', 1, textmsg[402]];
z[38] = ['discussion.jsp', 'discuss', 1, textmsg[403]];
z[39] = ['DataSearch?rdap=dbowner0&subdb=','admdbowner',1, textmsg[694]];

z[41] = ['DataSearch?rdap=faculty0&subdb=','faculty',1, textmsg[689]];
z[42] = ['DataSearch?rdap=student0&subdb=&role=','student',1, textmsg[690]];
z[43] = ['DataSearch?rdap=acaprogram0&subdb=','acaprog',1, textmsg[685]];
z[44] = ['DataSearch?rdap=course0&subdb=','course',1, textmsg[691]];

z[45] = ['DataSearch?rdap=statuschange0&dim=800700&subdb=','statuschange',1, textmsg[766]];
z[46] = ['DataSearch?rdap=statuschangea0&dim=800700&subdb=','statuschange',1, textmsg[766]];
z[47] = ['DataSearch?rdap=student0&role=r','student',1, textmsg[690]];
z[48] = null;
z[49] = ['webfolder.jsp','webfolder',1, textmsg[404]];
z[50] = null;
z[51] = null;
z[52] = null;
z[53] = ['DataSearch?rdap=department0&subdb=','department',1,textmsg[692]];
z[54] = ['subjectmajor.jsp?dim=800700&subdb=','majors',1, textmsg[718]];

z[55] = ['DataSearch?rdap=registration0&subdb=','registration',1, textmsg[717]];
z[56] = ['scheduler.jsp','scheduler',1, textmsg[693]];
z[57] = ['DataSearch?rdap=textbook0&subdb=', 'textbook', 1, textmsg[468]];
z[58] = null;
z[59] = ['webfolder.jsp','webfolder',1, textmsg[404]];
z[60] = ['DataTable?subdb=&rdap=statuschanger&dim=800700&semester=','status1',1, textmsg[773]];
z[61] = ['DataForm?subdb=&rdap=facultyself&numrows=1&extraline=0',    'Updaterecord',   1,  textmsg[776]];
z[62] = null;
z[63] = ['DataSearch?rdap=acalender0&subdb=', 'acalender', 1, textmsg[724]];
z[64] = ['domainvalue.jsp','domain',1, textmsg[696]];
z[65] = ['DataTable?subdb=&rdap=commandline&dim=800700', 'systemcfg', 1, textmsg[697]];
z[66] = ['cfgdb.jsp?dim=850700', 'systemcfg', 1,textmsg[698]];
z[67] = ['cfgfolders.jsp','systemcfg',1, textmsg[699]];
z[68] = ["DataForm?rsacode=2&rdap=systemparameter&subdb=&extraline=0", 'systemcfg', 1, textmsg[700]];
z[69] = ['DataTable?rdap=role&subdb=', 'roles', 1,textmsg[701]];
z[70] = ["DataLongForm?rdap=registerp&onsaved=opener.follows(1)&dim=600650&subdb=",'signup',1,textmsg[702]];
z[71] = ["datatransfer.jsp", 'datatrans',1,textmsg[703]];
z[72] = ["datamerge.jsp", 'datamerge',1,textmsg[704]]; 
z[73] = ["customize.jsp", 'customize',1,textmsg[785]];  
z[74] = ['DataTable?rdap=evalution&subdb=', 'evalution', 1, textmsg[706]];
z[75] = ['DataSearch?rdap=staff0&subdb=', 'staff', 1, textmsg[490]];
z[76] = ['DataSearch?rdap=vender0&subdb=', 'venders', 1, textmsg[707]];
z[77] = ['DataSearch?rdap=transfer0&subdb=', 'transfer', 1, textmsg[708]];
z[78] = ['DataSearch?rdap=textbook0&subdb=', 'textbook', 1, textmsg[468]];
z[79] = ['DataSearch?rdap=evalquestion0&subdb=', 'evalques', 1, textmsg[710]];
z[81] = ['DataSearch?rdap=evaluation0&subdb=', 'evaluation', 1, textmsg[711]];
z[80] = ['DataSearch?rdap=sessionsum0&subdb=', 'sessionsum', 1, textmsg[712]];
z[82] = ['DataSearch?rdap=alumini0&subdb=', 'alumini', 1, textmsg[713]];
z[83] = ['myeval.jsp?dim=800700','myevaluation',1, textmsg[706]];
z[84] = ['statuschange.jsp?dim=800700&semester=','status',1, textmsg[773]];
z[85] = ['DataFormHTML?rdap=fqashow&dim=800700&subdb=','faq',1, textmsg[786]];
z[86] = ['DataFormHTML?rdap=feeset&dim=800700&subdb=','fee',1, textmsg[855]];
z[87] = ['DataFormHTML?rdap=balance&dim=800700&subdb=','balance',1, textmsg[856]];
z[88] = ['DataFormHTML?rdap=fqashow&dim=800700&subdb=','payment',1, textmsg[857]];
function addnewhint(nummsg, numsub, numins)
{
 z[8][3] = z[8][3] + nummsg;
 z[17][3] = z[17][3] + numsub;
 z[9][3] = z[9][3] + numins;
}
function addother(subdb,semester)
{
  z[3][0] += subdb;
  z[4][0] += subdb;
  z[5][0] += subdb;
  z[8][0] += subdb;
  z[17][0] += subdb;
  z[20][0] += subdb;
  
  
}

var teanum = 0;

function follows(x)
{

}
 
function hints()
{
   myprompt(textmsg[714] +".");
}
 
function hints1()
{
   myprompt(textmsg[715] +".");
}