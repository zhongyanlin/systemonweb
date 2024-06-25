
function Tex(s)
{
    
    this.s = s.replace(/\$/g,'').replace(/_{(.)}/g,'_$1').replace(/\^{(.)}/g,'^$1').replace(/\{([0-9|\.]+)[ ]*\over[ ]*([0-9|\.]+)[ ]*\}/g, '$1/$2').replace(/\\frac[ ]*\{([0-9|\.]+)[ ]*\}[ ]*\{([0-9|\.]+)[ ]*\}/g, '$1/$2');
    this.ctype = function(c)
    {
        if ("0123456789.".includes(c)) return 2;
        
        if ("abcdefghijklmnopqrstuvwxyz".includes(c.toLowerCase()) ) return 3;
        return 5;
    };
    this.i = 0;
    this.nextToken = function()
    {
        let state = 0;
        let j = this.i;
        if (this.i == this.s.length) return '';
        for (let i = this.i;  i < this.s.length; i++)
        {
            let c = this.s.charAt(i);
            let type;

            switch(state)
            {
                case 0:
                  if (c == ' ' || c=='\n' || c=='\t' || c =='\r') break;
                  if (c=='\\') {state = 1; j=i; break;}
                  type = this.ctype(c);
                  if (type==2 ){  state = 2; j=i; break;}
                  this.i = i+1;
                  return c;
              case 1:

                  if (c == '\\' && i==j+1){this.i = i+1; state = 0;break;}
                  if (c == ',' && i==j+1){this.i=i+1; state = 0; break;}
                  if (c == '{' && i==j+1){this.i=i+1;return '\\{';}
                  type = this.ctype(c);
                  if (type == 3) break;
                  this.i= i; return this.s.substring(j,i); 

              case 2:
                   type = this.ctype(c);
                   if (type == 2) break;
                  this.i = i; return this.s.substring(j,i); 
            }
        }
        this.i = this.s.length;
        return this.s.substring(j);
     };
     
     this.literal = function()
     {
         let t; arr = new Array();
         while ((t = this.nextToken())!='' )
         {
             if ( t.length != 1 || "(){},".includes(t) == false)
             {
             if (t == '\\frac') arr.push('\\over');
             else
                arr.push(t);
             }
         }
         return arr;
     };
}
function similarn(s, target)
{  
    let x = target.replace(/\$/g,'').replace(/\\over/g, '/').replace(/\\times/g, '*').replace(/{/g,'(').replace(/}/g,')').replace(/([0-9|\.]+)^([0-9|\.]+)/g,'Math.power($1,$2)').replace(/\\pi/g,'3.1415926');
    try
    {
        z = eval(x);
        let y = s.replace(/\$/g,'').replace(/\\over/g, '/').replace(/\\times/g, '*').replace(/{/g,'(').replace(/}/g,')').replace(/([0-9|\.]+)^([0-9|\.]+)/g,'Math.power($1,$2)').replace(/\\pi/g,'3.1415926');
        try
        {
            w = eval(y);
            if (z == 0 && w != 0) return 0;
            u = Math.abs(w/z); if (u >= 2) return 0;
            u = 1 - Math.abs(u - 1);
            if (u >0.98) return 1;
            return u;
        }
        catch(e) 
        {
            return 0;
        }
    }
    catch(e){return 2;} 
}
function similarnum(s, target)
{
    let a = similarn(s,target);
    if (a <= 1) return a;
    tt = target.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
    if (tt.charAt(0)=='$' && tt.charAt(tt.length-1) == '$')
    {
    let x = (new Tex(s)).literal();
    let y = (new Tex(target)).literal();
    let n = 0;
    for (a of x)
    {
        if (y.includes(a)) n++;
    }
    let m = 0;
    for (b of y)
    {
        if (x.includes(b)) m++;
    }
    return (n/x.length + m/y.length)/2;
}
return 2;
}

 


