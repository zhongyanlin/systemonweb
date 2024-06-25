/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
cellonblur = 'if(cc==1){if(defaultRecord[1]!=null && v!=defaultRecord[1]&&(v==\'0\'||defaultRecord[1]==\'0\')){ele(rr,cc).focus();myprompt(textmsg[767]);}else defaultRecord[1]=v;}';
onbegin = 'var ii=0;for(;ii<numRows&&mat[ii][1]==null;ii++);if (ii<numRows)defaultRecord[1]=mat[ii][1];else defaultRecord[1]=null;';
