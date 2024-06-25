var encryptcharsize = 1; 
var rsaprivate; 
function serCharSize(x)
{
   encryptcharsize = parseInt(x);
} 
function  setServerkeys(ckeys){}
function  encryptString(s){return s;}
function  decryptString(s){return s;}
function decryptString0(z)
{
        var result = "";
        if (z == null || z == "") return z;
        z = z.replace(/ /g,'');
        var k = 2*encryptcharsize; 
 
        for (var i = 0; i < z.length; i+=k ) 
        {
            if (k==4)
               result += String.fromCharCode('0x' 
               + z.charAt(i+2)+z.charAt(i)+z.charAt(i+3)+z.charAt(i+1));
            else
               result += String.fromCharCode('0x' + z.charAt(i+1)+z.charAt(i) );
        }
 
        return result;  
}