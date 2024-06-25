/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
if (ZQ[0]=='announcement0') 
{
    
    cellonblur=" if(cc==0&&x=='1'&&v=='0'){ window.open('DataSearch?rdap=announcement10&allids='+defaultRecord[2],parent.name);}";
    
}
else 
{
     
    cellonblur=" if(cc==0&&x=='0'&&v=='1'){ window.open('DataSearch?rdap=announcement0&allids='+defaultRecord[2],parent.name);}";
    
} 