var d = function()
{
      let mime_type =  "text/html";
      let contents = '<html>'+document.body.outerHTML.replace(/<input[^>]+>/,'').replace(/<script.*/i,'')+'</html>';
      var blob = new Blob([contents], {type: mime_type});
      var dlink = document.createElement('a');
      dlink.download = '{{ fname }}.html';
      dlink.href = window.URL.createObjectURL(blob);
      dlink.onclick = function(e)
      {
        var that = this;
        setTimeout(function()
        {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
      }
};

window.onload=d;