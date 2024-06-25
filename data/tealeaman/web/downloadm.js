var sfd;
var filenamek;
var orderk;
var stilldo = true;
var _OBJECT_URL;
function downloadselected()
{
   sfd = new Array();
   let mt = document.getElementById('themaintbl');
   for (var i = 0; i < N; i++)  
   {  
      if (cb[i] != null && cb[i].checked && mt.rows[i+2].cells[2].innerHTML.includes('file.jpg'))
      { 
         sfd[sfd.length]  = i ;
      }
      else if (cb[i] != null && cb[i].checked && !mt.rows[i+2].cells[2].innerHTML.includes('file.jpg'))
      {
          cb[i].checked = false;
      }
   }
   if (sfd.length == 0)
   {
       myprompt(textmsg[247],null,null,textmsg[1871].split(/@/)[3]);
       return;
   }
   stilldo = true;
    var s = '<div id="download-filename"></div>'
	+'<div id="download-progress" style="height:6px;background-color:green;width:1%;margin:10px 0px 0px 0px" ></div>'
    +'<a id="download-link">   </a><br>'
	+'<center><input id=cancelbtn type=button class=OrangeButton style="width:80px" value="'+textmsg[18] + '" onclick="cancelop()"></center>';
	orderk =0; 
    myprompt(s,null,null,textmsg[1871].split(/@/)[3]);
    downloadafile();
}
function cancelop()
{
    let btn = document.getElementById("cancelbtn");
    if (stilldo)
    {
        stilldo = false;
        btn.className = "GreenButton";
        btn.value = textmsg[1357];
        let obj = document.getElementById('download-filename');
        if (obj!=null)
        {
           obj.innerHTML = (orderk+1) +  "/" + sfd.length + " " + textmsg[1938];
         }
    }
    else
    {
        
        closeprompt();
    }
}
function downloadafile()
{
    var k = sfd[orderk];    
    filenamek = fn[k];
    var dtype = "application/x-www-form-urlencoded"; 
    let mimetype =  "text/html";
   
    let fd = new FormData();
    fd.append("operation","download");
    fd.append("destination","attachment");
    fd.append("folder", document.form2.folder.value);
    fd.append("filedir",fn[k]);
    fd.append("securitytoken",document.form2.securitytoken.value); 
    fd.append("allcourse",document.form2.allcourse.value);
    fd.append("option", "");
  
	const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', function(e) 
    {
    	if(request.readyState == 2 && request.status == 200) 
        {
            console.log(request.readyState);
            if (stilldo == false) 
            {
                request.abort();
                _OBJECT_URL = null;
                return;
            }
            let obj = document.getElementById('download-filename');
            if (obj!=null)
            {
    		   obj.innerHTML = (orderk+1) + "/" + sfd.length + ":   " + filenamek;
            }
    	}
    	else if(request.readyState == 3) {
            console.log(request.readyState);
    		if (stilldo == false) 
            {
                request.abort();
                _OBJECT_URL = null;
                return;
            } 
    	}
    	else if(request.readyState == 4) 
        {
            console.log(request.readyState +  '  ' + sfd[orderk] + ' '+ orderk);
            cb[sfd[orderk]].checked = false;
            if (stilldo == false) 
            {
                request.abort();
                _OBJECT_URL = null;
                return;
            }
    		if (request.response == null)
            {
                orderk++;
                cancelop();
                return; 
            }    
           
            _OBJECT_URL = URL.createObjectURL(request.response);
            const dlink =  document.getElementById('download-link');
            if (dlink!=null)
            {
                dlink.onclick = function()
                {
                    dlink.setAttribute('download',filenamek);
                    dlink.setAttribute('href', _OBJECT_URL);

                    setTimeout(function() 
                    {
                        window.URL.revokeObjectURL(_OBJECT_URL);
                        _OBJECT_URL = null;
                        if (stilldo && orderk < sfd.length-1)
                        {
                            orderk++;
                            downloadafile();
                        }
                        else
                        {
                             
                            cancelop();
                        }
                    }, 1500);
                } 
                dlink.click();
            }
        } 
    });
    request.addEventListener('progress', function(e) {
        if (stilldo == false) 
        {
                request.abort();
                _OBJECT_URL = null;
                return;
        }
        var obj = document.getElementById('download-progress');
        if (obj!=null)
        {
    	var percent_complete = (e.loaded / e.total)*100;
    	obj.style.width = percent_complete + '%';
        }
    });
    request.open('POST', "FileOperation", true);
    request.responseType = 'blob';
    request.setRequestHeader("Content-type",dtype);
    let xx = new URLSearchParams(fd).toString();
    request.send(xx); 
    
}

