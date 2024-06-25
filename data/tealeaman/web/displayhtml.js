/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
function showhtml(x)
{
     var nav3 = openblank('statisticWin',
     'toolbar=0,location=0,directories=0,status=0,menubar=0,alwaysRaised=1,scrollbars=0,resizable=1,width= 700,height= 500');
     nav3.document.write(x.value);
     endDocWrite(nav3); 
}  