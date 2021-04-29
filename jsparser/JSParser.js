  
function $(x){return document.getElementById(x);} 
function JSParser(str)
{
  this.statesr = [];
  this.states = [];
  this.outr = [];
  this.out = [];
  this.makem =function()
  {
  let s = [
 // state        '    "      /      \     *      s     \t   \r     \n     a9_$    pun    
 "0 init       1(db) 3(db)  5(db)  0(ds)  9(db)  0(b)  0(ds)  0(ds) 0(ds) 10(db)  9(db)"
 ,"1 strings1   0(ds) 1(b)   1(b)  2(b)  1(b)   1(b)   1(b)  13    13     1(b)     1(b)" 
 ,"2 strings0   1(b)  13   13     1(b)   13    13     13    13     13    1(b)      13"  
 ,"3 stringd1   3(b) 0(ds)   3(b)  4(b)  3(b)   3(b)   3(b)  13     13    3(b)     3(b)"  
 ,"4 stringd0   13   3(b)   13     3(b)   13   13      13   13      13   3(b)      13"
 ,"5 commenc1   11(b) 11(b)  8(b)  12(b)  6(b)  11(b) 11(b) 11(b) 11(b)  11(b)   11(b)" 
 ,"6 commenc2   6(b)  6(b)  6(b)   6(b)   7(b)   6(b)  6(b)  6(b) 6(b)   6(b)    6(b)"
 ,"7 commenc3   6(b)  6(b)  0(ds)  6(b)   7(b)   6(b)  6(b)  6(b)  6(b)  6(b)    6(b)"   
 ,"8 commenp    8(b)   8(b)  8(b)  8(b)   8(b)   8(b)  8(b)   0(d)  0(d)   8(b)   8(b)"     
 ,"9 operator   1(db)  3(db) 5(db) 9(ds)  9(db) 0(db)  0(db)  0(db) 0(db)  10(db) 9(b)"        
 ,"10 literal   1(db)  3(db) 5(db) 9(db)  9(db) 0(db)  0(db)  0(db) 0(db)  10(b)  9(db)" 
 ,"11 regex     11(b)  11(b) 0(ds)  12(b)  11(b)  11(b)  11(b)  11(b)  11(b)  11(b)  11(b)" 
 ,"12 regex0    13     13   11(b)  11(b)   11(b)   13     13    13     13    11(b)   11(b)" 
];
 let s5="5 commenc1   13   13    8(b)   13    6(db)   0(db)  0(ds) 0(ds) 0(ds) 10(db)  9(db)";
    
   for (let j=0; j < 13; j++)
   {
       this.statesr[j] = [];
       this.outr[j] = [];
       let z = s[j].split(/[ ]+/);
       for (let k=2; k < z.length; k++)
       {
           let q = z[k];
           this.statesr[j][k-2] = parseInt(q.replace(/[^0-9]/g,''));
           this.outr[j][k-2] =  (q.replace(/[^a-z]/g,''));
       }
   }
   for (let j=0; j < 13; j++)
   {
       this.states[j] = [];
       this.out[j] = [];
       if (j == 5) 
           s[j] = s5;
       let z = s[j].split(/[ ]+/);
       for (let k=2; k < z.length; k++)
       {
           let q = z[k];
           this.states[j][k-2] = parseInt(q.replace(/[^0-9]/g,''));
           this.out[j][k-2] =  (q.replace(/[^a-z]/g,''));
       }
   }
   this.linenum = 0;
  }
    
   this.INIT = 0;
   this.STRINGS1 = 1;
   this.STIRNGS0 = 2;
   this.STRINGD1 = 3;
   this.STIRNGD0 = 4;
   this.COMMENTC1 = 5;
   this.COMMENTC2 = 6;
   this.COMMENTC3 = 7;
   this.COMMENTP =  8;
   this.OPERATOR = 9;
   this.LITERAL = 10;
   this.REGEX = 11;
   this.REGEX0 = 12;
   this.ERROR = 13;
   this.code = function(char)
   {
       let x ="'\"/\\* \t\r\n".split(/|/);
       let i = 0;
       let k = x.length;
       for (; i < x.length; i++) 
           if (x[i] == char) return i;
       x ="~!@#%^&*()-+={[]}|:;<>,?".split(/|/); 
       let j = 0;
       for (; j < x.length; j++) 
           if (x[j] == char) return k+1;
       return k;
   }
   this.s = str;
   this.state = this.INIT;
   this.position = -1;
   this.makem();
   this.buff = "";
   this.parenthesis = false;
   this.inp = false;
   this.olds = null;
   this.parenth = function(ans)
   {
       var ans0 = ans.replace(/^[ ]+/,'').replace(/[ ]+$/,'');
       if (ans0!='')
       {
          if (this.inp == false)
          {    
              this.inp = ans0.charAt(ans0.length-1) == '(';
          }
          else
              this.inp = false;// = ans0.charAt(0) == ')';
       }
   }
   this.buf = "";
   this.dd = "[],(),{},<=,>=,+=,++,--,===,!==,==,-=,*=,/=,%=,||,&&,&=,|=,!=,<<,>>".split(/,/);
   this.nextToken = function()
   {
      if (this.buf.length  == 0)
      {
          let a = this.nextToken0();
          if (a == null) 
          {
              if (this.state == this.ERROR)
              {
                  alert("Syntax error found in line " + this.linenum)
              }
              return null;
          }
          if (a.type != "operator" ||
               a.token.length == 1 ) return a;
          this.buf = (a.token);
      }
      for (let i=0; i < this.dd.length; i++)
      {
          if (this.buf == (this.dd[i]))
          {
              this.buf = "";
              return {token:this.dd[i],type:"operator"};
          }
          else if (this.buf.toString().indexOf(this.dd[i]) == 0)
          {
              this.buf = this.buf.substring(this.dd[i].length);
              return {token:this.dd[i],type:"operator"};
          }
      }
      let ans =  this.buf.charAt(0);
      this.buf = this.buf.substring(1);
      return {token:ans,type:"operator"};
      
   }
   this.linenum = 0;
   this.nextToken0 = function()
   {
      if (this.state == this.ERROR) return null;
      let type = ['sparator','string','string','string','string','operator',
                  'comment', 'comment','comment','operator','literal','regex','regex'];
      while (true)
      {
          if (this.position == this.s.length)
          {
              if (this.buff == '')
                  return null;
              else
              {
                  let ans = this.buff;
                  this.buff = '';
                  return {token:ans,type:type[this.state]};
              }
          }
          ++this.position;
          let char = this.s.charAt(this.position);
          if (char == '\n') this.linenum++;
          let d = this.state;
          let c = this.code(char);
          let o = null;
          if (this.inp)
          {
             this.state = this.statesr[d][c];
             o = this.outr[d][c];
          }
            
          else  
          {
              this.state = this.states[d][c];
              o = this.out[d][c];
          }
          if ( o == '')
          {   
             ans = this.buff;
             if (ans != '')
             {
                this.parenth(ans);
                return {token:ans, type:type[d]}
             }
             else return null;
          }
          else if (o == 'b')
          {
             this.buff = this.buff + char;
          }
          else if (o == 'db')
          {
             ans = this.buff;
             this.buff = char;
             if (ans != '')
             {
                this.parenth(ans);
                return {token:ans, type:type[d]}
             }
          }
          else if (o == 'ds')
          {
             ans = this.buff;
             if (ans == '')
             {
                return {token:char, type:type[d]}  
             }
             else
             {
                this.buff = "";
                this.parenth(ans);
                return {token:ans + char, type:type[d]}  
             }
          }
      }
      return null;
   }
   this.navigate = function()
   {
       let x;
       var t = $('s');
       while ((x = this.nextToken()) != null)
       {
           t.value +=(x.inp + "  " + x.type + "        " + x.token.replace(/\n/,'\\n') + '\n');
       }
   }
   this.valid  = function()
   {
       let x;
       while ((x = this.nextToken()) != null)
       { }
       var t =  this.position == this.s.length;
       if (t == false)
           alert(this.state + ":" + this.s.substr(this.position,100))
       return t;
   }
    
   this.nextPiece = function()
   {
       var p = -1; 
       var t; 
       var l = -1; 
       let state = 0;
       let which;
       while ((t = this.nextToken())!= null)
       {
           let token = t.token;
           if (state == 0)
           {
               if (t.token == 'var' || t.token == 'let' || t.token == 'const')
               {
                   state = 2;
                   p = this.position - t.token.length;
                   l = 0;
               }
               else if (t.token == 'function')
               {
                   l = 0;
                   state = 3;
                   p = this.position - t.token.length;
                   while (p>0 && this.s.charAt(p)!='\n' && this.s.charAt(p)!=';')p--;
               }
               else if (t.token == 'if' || t.token == 'else') 
               {
                   state = 1;
                   p = this.position - t.token.length;
                   l = 0;
                   which = -1;
               }
               else if (t.token == ';')
               {
                   if (p<this.position)
                   {
                       let w = p;p = -1;
                       return {type:'statement',codes:this.s.substring(w,this.position+1)};
                   }
                   
               }
               else if (p == -1)
               {
                   p = this.position-t.token.length+1;
               }
           }
           else if (state == 1)
           {
              if (t.token == '{')
              {
                  l++;
              }
              else if (t.token == '}')
              {
                  l--;
                  if (l == 0)
                  {
                      let q = this.position+1;
                      if (this.s.charAt(q) == ';')
                      {
                         this.position = q;
                         q++;
                      }
                      let w = p;p = -1;
                      if (which == 2)
                          return {type:'var',codes:this.s.substring(w,q)};
                      else if (which==3)
                          return {type:'function',codes:this.s.substring(w,q)};
                      else
                          return {type:'statement',codes:this.s.substring(w,q)};
                  }
              }
              else  if (t.token == ';')
              {
                  if (l == 0)
                  {
                     let w = p;p = -1;
                     if (which == 2)
                          return {type:'var',codes:this.s.substring(w,this.position+1)};
                      else if (which==3)
                          return {type:'function',codes:this.s.substring(w,this.position+1)};
                      else
                          return {type:'statement',codes:this.s.substring(w,this.position+1)};
                  }
              }
              else if (t.token == 'var' || t.token == 'let' || t.token == 'const')
              {
                   if (which==-1)which = 2; 
              }
              else if (t.token == 'function')
              {
                   if (which==-1) which = 3; 
              }
           }
           else if (state == 2 )
           {
              if (t.token == '{') l++;
                 else if (t.token == '}')l--;
              if (t.token == ';' && l==0)
              {
                  let w = p;p = -1;
                  return {type:'var',codes:this.s.substring(w,this.position+1)};
              }
           }
           else if (state == 3)
           {
               if (t.token == '{') l++;
               else if (t.token == '}'){ 
                  l--; 
                  if (l == 0)
                  {
                      let w = p;p = -1;
                      return {type:'function',codes:this.s.substring(w,this.position+1)};
                  }
              }
           }
       }
       return null;
   }
   this.nextGlobalVar = function()
   {
       var p = -1; 
       var t; 
       var l = -1; 
       
       while ((t = this.nextToken())!= null)
       {
           if (l==-1 && t.token == 'function' && t.type == 'literal')
           {
               l = 0;
           }
           else if (l>=0 && t.token == '{')
           {
               l++;
           }
           else if (l >=0 && t.token == '}')
           {
               l--;
               if (l == 0) l--;
           }
           else if (l < 0 && p == -1 && (t.token == 'var' || t.token == 'let' || t.token == 'const') && t.type == 'literal')
           {
               p = this.position - 3;
               while (p >=1 && this.s.charAt(p-1)!='\n' && this.s.charAt(p-1)!=';') 
               {
                   p--;
               }
               if (this.s.substring(p,p+1) == ' ' || this.s.substring(p,p+1) == '\t')
               {
                   p -= 2;
                   while (p >=1 && this.s.charAt(p-1)!='\n' && this.s.charAt(p-1)!=';') 
                   {
                      p--;
                   }
               }
           }
           else if(l <0 && p>= 0 && t.token == ';') 
           {
               return this.s.substring(p,this.position+1); 
           }
       }
       return '';
   }
}


