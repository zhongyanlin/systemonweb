/*
 *lx2html.js
 *Zhongyan Lin
 *Oct 2012
 *Systems on Web, Inc.
 *All rights reserved
 */

Trans.symhash = new Array();
//Greek letters
Trans.symhash["\\alpha"] = "\u03B1";
Trans.symhash["\\beta"] = "\u03B2";
Trans.symhash["\\gamma"] = "\u03B3";
Trans.symhash["\\delta"] = "\u03B4";
Trans.symhash["\\epsilon"] = "\u03B5";
Trans.symhash["\\varepsilon"] = "\u025B";
Trans.symhash["\\zeta"] = "\u03B6";
Trans.symhash["\\eta"] = "\u03B7";
Trans.symhash["\\theta"] = "\u03B8";
Trans.symhash["\\vartheta"] = "\u03D1";
Trans.symhash["\\iota"] = "\u03B9";
Trans.symhash["\\kappa"] = "\u03BA";
Trans.symhash["\\lambda"] = "\u03BB";
Trans.symhash["\\mu"] = "\u03BC";
Trans.symhash["\\nu"] = "\u03BD";
Trans.symhash["\\xi"] = "\u03BE";
Trans.symhash["\\pi"] = "\u03C0";
Trans.symhash["\\varpi"] = "\u03D6";
Trans.symhash["\\rho"] = "\u03C1";
Trans.symhash["\\varrho"] = "\u03F1";
Trans.symhash["\\varsigma"] = "\u03C2";
Trans.symhash["\\sigma"] = "\u03C3";
Trans.symhash["\\tau"] = "\u03C4";
Trans.symhash["\\upsilon"] = "\u03C5";
Trans.symhash["\\phi"] = "\u03C6";
Trans.symhash["\\varphi"] = "\u03D5";
Trans.symhash["\\chi"] = "\u03C7";
Trans.symhash["\\psi"] = "\u03C8";
Trans.symhash["\\omega"] = "\u03C9";
Trans.symhash["\\Gamma"] = "\u0393";
Trans.symhash["\\Delta"] = "\u0394";
Trans.symhash["\\Theta"] = "\u0398";
Trans.symhash["\\Lambda"] = "\u039B";
Trans.symhash["\\Xi"] = "\u039E";
Trans.symhash["\\Pi"] = "\u03A0";
Trans.symhash["\\Sigma"] = "\u03A3";
Trans.symhash["\\Upsilon"] = "\u03A5";
Trans.symhash["\\Phi"] = "\u03A6";
Trans.symhash["\\Psi"] = "\u03A8";
Trans.symhash["\\Omega"] = "\u03A9";
Trans.symhash["\\frac"] = "\\faqc";
Trans.symhash["\\over"] = "\\over";
Trans.symhash["\\half"] = "\\half";
Trans.symhash["\\quarter"] = "\\quarter";
//fractions
Trans.symhash["\\frac12"] = "\u00BD";
Trans.symhash["\\frac14"] = "\u00BC";
Trans.symhash["\\frac34"] = "\u00BE";
Trans.symhash["\\frac13"] = "\u2153";
Trans.symhash["\\frac23"] = "\u2154";
Trans.symhash["\\frac15"] = "\u2155";
Trans.symhash["\\frac25"] = "\u2156";
Trans.symhash["\\frac35"] = "\u2157";
Trans.symhash["\\frac45"] = "\u2158";
Trans.symhash["\\frac16"] = "\u2159";
Trans.symhash["\\frac56"] = "\u215A";
Trans.symhash["\\frac18"] = "\u215B";
Trans.symhash["\\frac38"] = "\u215C";
Trans.symhash["\\frac58"] = "\u215D";
Trans.symhash["\\frac78"] = "\u215E";

//binary operation symbols
Trans.symhash["\\pm"] = "\u00B1";
Trans.symhash["\\mp"] = "\u2213";
Trans.symhash["\\triangleleft"] = "\u22B2";
Trans.symhash["\\triangleright"] = "\u22B3";
Trans.symhash["\\cdot"] = "\u22C5";
Trans.symhash["\\star"] = "\u22C6";
Trans.symhash["\\ast"] = "\u002A";
Trans.symhash["\\times"] = "\u00D7";
Trans.symhash["\\div"] = "\u00F7";
Trans.symhash["\\circ"] = "\u2218";
//Trans.symhash["\\bullet"] = "\u2219";
Trans.symhash["\\bullet"] = "\u2022";
Trans.symhash["\\oplus"] = "\u2295";
Trans.symhash["\\ominus"] = "\u2296";
Trans.symhash["\\otimes"] = "\u2297";
Trans.symhash["\\bigcirc"] = "\u25CB";
Trans.symhash["\\oslash"] = "\u2298";
Trans.symhash["\\odot"] = "\u2299";
Trans.symhash["\\land"] = "\u2227";
Trans.symhash["\\wedge"] = "\u2227";
Trans.symhash["\\lor"] = "\u2228";
Trans.symhash["\\vee"] = "\u2228";
Trans.symhash["\\cap"] = "\u2229";
Trans.symhash["\\cup"] = "\u222A";
Trans.symhash["\\sqcap"] = "\u2293";
Trans.symhash["\\sqcup"] = "\u2294";
Trans.symhash["\\uplus"] = "\u228E";
Trans.symhash["\\amalg"] = "\u2210";
Trans.symhash["\\bigtriangleup"] = "\u25B3";
Trans.symhash["\\bigtriangledown"] = "\u25BD";
Trans.symhash["\\dag"] = "\u2020";
Trans.symhash["\\dagger"] = "\u2020";
Trans.symhash["\\ddag"] = "\u2021";
Trans.symhash["\\ddagger"] = "\u2021";
Trans.symhash["\\lhd"] = "\u22B2";
Trans.symhash["\\rhd"] = "\u22B3";
Trans.symhash["\\unlhd"] = "\u22B4";
Trans.symhash["\\unrhd"] = "\u22B5";


//BIG Operators
Trans.symhash["\\sum"] = "\u2211";
Trans.symhash["\\prod"] = "\u220F";
Trans.symhash["\\bigcap"] = "\u22C2";
Trans.symhash["\\bigcup"] = "\u22C3";
Trans.symhash["\\bigwedge"] = "\u22C0";
Trans.symhash["\\bigvee"] = "\u22C1";
Trans.symhash["\\bigsqcap"] = "\u2A05";
Trans.symhash["\\bigsqcup"] = "\u2A06";
Trans.symhash["\\coprod"] = "\u2210";
Trans.symhash["\\bigoplus"] = "\u2A01";
Trans.symhash["\\bigotimes"] = "\u2A02";
Trans.symhash["\\bigodot"] = "\u2A00";
Trans.symhash["\\biguplus"] = "\u2A04";
Trans.symhash["\\int"] = "\u222B";
Trans.symhash["\\oint"] = "\u222E";

//binary relation symbols
Trans.symhash[":="] = ":=";
Trans.symhash["\\lt"] = "<";
Trans.symhash["\\gt"] = ">";
Trans.symhash["\\ne"] = "\u2260";
Trans.symhash["\\neq"] = "\u2260";
Trans.symhash["\\le"] = "\u2264";
Trans.symhash["\\leq"] = "\u2264";
Trans.symhash["\\leqslant"] = "\u2264";
Trans.symhash["\\ge"] = "\u2265";
Trans.symhash["\\geq"] = "\u2265";
Trans.symhash["\\geqslant"] = "\u2265";
Trans.symhash["\\equiv"] = "\u2261";
Trans.symhash["\\ll"] = "\u226A";
Trans.symhash["\\gg"] = "\u226B";
Trans.symhash["\\doteq"] = "\u2250";
Trans.symhash["\\prec"] = "\u227A";
Trans.symhash["\\succ"] = "\u227B";
Trans.symhash["\\preceq"] = "\u227C";
Trans.symhash["\\succeq"] = "\u227D";
Trans.symhash["\\subset"] = "\u2282";
Trans.symhash["\\supset"] = "\u2283";
Trans.symhash["\\subseteq"] = "\u2286";
Trans.symhash["\\supseteq"] = "\u2287";
Trans.symhash["\\sqsubset"] = "\u228F";
Trans.symhash["\\sqsupset"] = "\u2290";
Trans.symhash["\\sqsubseteq"] = "\u2291";
Trans.symhash["\\sqsupseteq"] = "\u2292";
Trans.symhash["\\sim"] = "\u223C";
Trans.symhash["\\simeq"] = "\u2243";
Trans.symhash["\\approx"] = "\u2248";
Trans.symhash["\\cong"] = "\u2245";
Trans.symhash["\\Join"] = "\u22C8";
Trans.symhash["\\bowtie"] = "\u22C8";
Trans.symhash["\\in"] = "\u2208";
Trans.symhash["\\ni"] = "\u220B";
Trans.symhash["\\owns"] = "\u220B";
Trans.symhash["\\propto"] = "\u221D";
Trans.symhash["\\vdash"] = "\u22A2";
Trans.symhash["\\dashv"] = "\u22A3";
Trans.symhash["\\models"] = "\u22A8";
Trans.symhash["\\perp"] = "\u22A5";
Trans.symhash["\\smile"] = "\u2323";
Trans.symhash["\\frown"] = "\u2322";
Trans.symhash["\\asymp"] = "\u224D";
Trans.symhash["\\notin"] = "\u2209";
Trans.symhash["\\begin{eqnarray}"] = "X";
Trans.symhash["\\begin{array}"] = "X";
Trans.symhash["\\\\"] = "}&{";
Trans.symhash["\\end{eqnarray}"] = "}}";
Trans.symhash["\\end{array}"] = "}}";
Trans.symhash["\\big"] = "1.2"   ;
Trans.symhash["\\Big"] = "1.6"   ;
Trans.symhash["\\bigg"] = "2.2"   ;
Trans.symhash["\\Bigg"] = "2.9"   ;
Trans.symhash["\\large"] = "1.2"   ;
Trans.symhash["\\Large"] = "1.6"   ;
Trans.symhash["\\LARGE"] = "2.2"   ;

Trans.symhash["\\left"] = "X";
Trans.symhash["\\right"] = "X";
Trans.symhash["{"] = "{";
Trans.symhash["}"] = "}";

 
Trans.symhash["\\lbrack"] = "[";
Trans.symhash["\\{"] = "{"       ;
Trans.symhash["\\lbrace"] = "{"       ;
Trans.symhash["\\langle"] = "\u2329"   ;
Trans.symhash["\\lfloor"] = "\u230A" ;
Trans.symhash["\\lceil"] = "\u2308" ;
Trans.symhash["\\rbrack"] = "]";
Trans.symhash["\\}"] = "}";
Trans.symhash["\\rbrace"] = "}";
Trans.symhash["\\rangle"] = "\u232A";
Trans.symhash["\\rfloor"] = "\u230B";
Trans.symhash["\\rceil"] = "\u2309";

// "|", "\\|", "\\vert" and "\\Vert" modified later: lspace = rspace = 0em
Trans.symhash["|"] = "\u2223" ;
Trans.symhash["\\|"] = "\u2225" ;
Trans.symhash["\\vert"] = "\u2223" ;
Trans.symhash["\\Vert"] = "\u2225" ;
Trans.symhash["\\mid"] = "\u2223" ;
Trans.symhash["\\parallel"] = "\u2225" ;
Trans.symhash["/"] = "/" ;
Trans.symhash["\\backslash"] = "\u2216" ;
Trans.symhash["\\setminus"] = "\\";

//miscellaneous symbols
Trans.symhash["\\!"] = "";
Trans.symhash["\\,"] = "<div style=width:0.167em><!----></div>";
Trans.symhash["\\>"] = "<div style=width:0.222em><!----></div>";
Trans.symhash["\\:"] = "<div style=width:0.222em><!----></div>";
Trans.symhash["\\;"] = "<div style=width:0.278em><!----></div>";
 
Trans.symhash["\\quad"] = "<div style=width:1em><!----></div>";
Trans.symhash["\\qquad"] = "<div style=width:2em><!----></div>";
//Trans.symhash["{}"] = "\u200B"; // zero-width
Trans.symhash["\\prime"] = "\u2032";
Trans.symhash["'"] = "\u02B9";
Trans.symhash["''"] = "\u02BA";
Trans.symhash["'''"] = "\u2034";
Trans.symhash["''''"] = "\u2057";
Trans.symhash["\\ldots"] = "\u2026";
Trans.symhash["\\cdots"] = "\u22EF";
Trans.symhash["\\vdots"] = "\u22EE";
Trans.symhash["\\ddots"] = "\u22F1";
Trans.symhash["\\forall"] = "\u2200";
Trans.symhash["\\exists"] = "\u2203";
Trans.symhash["\\Re"] = "\u211C";
Trans.symhash["\\Im"] = "\u2111";
Trans.symhash["\\aleph"] = "\u2135";
Trans.symhash["\\hbar"] = "\u210F";
Trans.symhash["\\ell"] = "\u2113";
Trans.symhash["\\wp"] = "\u2118";
Trans.symhash["\\emptyset"] = "\u2205";
Trans.symhash["\\infty"] = "\u221E";
Trans.symhash["\\surd"] = "\\sqrt{}";
Trans.symhash["\\partial"] = "\u2202";
Trans.symhash["\\nabla"] = "\u2207";
Trans.symhash["\\triangle"] = "\u25B3";
Trans.symhash["\\therefore"] = "\u2234";
Trans.symhash["\\angle"] = "\u2220";
Trans.symhash["\\diamond"] = "\u22C4";
Trans.symhash["\\Diamond"] = "\u25C7";
Trans.symhash["\\neg"] = "\u00AC";
Trans.symhash["\\lnot"] = "\u00AC";
Trans.symhash["\\bot"] = "\u22A5";
Trans.symhash["\\top"] = "\u22A4";
Trans.symhash["\\square"] = "\u25AB";
Trans.symhash["\\Box"] = "\u25A1";
Trans.symhash["\\wr"] = "\u2240";

//standard functions
Trans.symhash["\\arccos"] = "arccos";
Trans.symhash["\\arcsin"] = "arcsin";
Trans.symhash["\\arctan"] = "arctan";
Trans.symhash["\\arg"] = "arg";
Trans.symhash["\\cos"] = "cos";
Trans.symhash["\\cosh"] = "cosh";
Trans.symhash["\\cot"] = "cot";
Trans.symhash["\\coth"] = "coth";
Trans.symhash["\\csc"] = "csc";
Trans.symhash["\\deg"] = "deg";
Trans.symhash["\\det"] = "det";
Trans.symhash["\\dim"] = "dim";  
Trans.symhash["\\exp"] = "exp";
Trans.symhash["\\gcd"] = "gcd";  
Trans.symhash["\\hom"] = "hom";
Trans.symhash["\\inf"] = "inf";
Trans.symhash["\\ker"] = "ker";
Trans.symhash["\\lg"] = "lg";
Trans.symhash["\\lim"] = "lim";
Trans.symhash["\\liminf"] = "liminf";
Trans.symhash["\\limsup"] = "limsup";
Trans.symhash["\\ln"] = "ln";
Trans.symhash["\\log"] = "log";
Trans.symhash["\\max"] = "max";
Trans.symhash["\\min"] = "min";
Trans.symhash["\\Pr"] = "Pr";
Trans.symhash["\\sec"] = "sec";
Trans.symhash["\\sin"] = "sin";
Trans.symhash["\\sinh"] = "sinh";
Trans.symhash["\\sup"] = "sup";
Trans.symhash["\\tan"] = "tan";
Trans.symhash["\\tanh"] = "tanh";
Trans.symhash["\\gets"] = "\u2190";
Trans.symhash["\\leftarrow"] = "\u2190";
Trans.symhash["\\to"] = "\u2192";
Trans.symhash["\\rightarrow"] = "\u2192";
Trans.symhash["\\leftrightarrow"] = "\u2194";
Trans.symhash["\\uparrow"] = "\u2191";
Trans.symhash["\\downarrow"] = "\u2193";
Trans.symhash["\\updownarrow"] = "\u2195";
Trans.symhash["\\Leftarrow"] = "\u21D0";
Trans.symhash["\\Rightarrow"] = "\u21D2";
Trans.symhash["\\Leftrightarrow"] = "\u21D4";
Trans.symhash["\\iff"] = "~\\Longleftrightarrow~";
Trans.symhash["\\Uparrow"] = "\u21D1";
Trans.symhash["\\Downarrow"] = "\u21D3";
Trans.symhash["\\Updownarrow"] = "\u21D5";
Trans.symhash["\\mapsto"] = "\u21A6";
Trans.symhash["\\longleftarrow"] = "\u2190";
Trans.symhash["\\longrightarrow"] = "\u2192";
Trans.symhash["\\longleftrightarrow"] = "\u2194";
Trans.symhash["\\Longleftarrow"] = "\u21D0";
Trans.symhash["\\Longrightarrow"] = "\u21D2";
Trans.symhash["\\Longleftrightarrow"] = "\u21D4";
Trans.symhash["\\longmapsto"] = "\u21A6";
Trans.symhash["\\acute"] = "\u00B4";
Trans.symhash["\\grave"] = "\u0060";
Trans.symhash["\\breve"] = "\u02D8";
Trans.symhash["\\check"] = "\u02C7";
Trans.symhash["\\dot"] = ".";
Trans.symhash["\\ddot"] = "..";
Trans.symhash["\\mathring"] = "\u00B0";
Trans.symhash["\\vec"] = "\u20D7";
Trans.symhash["\\overrightarrow"] = "\u20D7";
Trans.symhash["\\overleftarrow"] = "\u20D6";
Trans.symhash["\\hat"] = "\u005E";
Trans.symhash["\\widehat"] = "\u0302";
Trans.symhash["\\tilde"] = "~";
Trans.symhash["\\widetilde"] = "\u02DC";
Trans.symhash["\\bar"] = "\u203E";
Trans.symhash["\\overbrace"] = "\u23B4";
Trans.symhash["\\overline"] = "\u00AF";
Trans.symhash["\\underbrace"] = "\u23B5";
Trans.symhash["\\underline"] = "\u00AF";
Trans.symhash["\\sqrt"] = "&radic;";
Trans.symhash["\\section"] = "section";
Trans.symhash["\\chapter"] = "chapter";
/*
Trans.symhash["\\displaystyle",atname:"displaystyle"] = "true";
Trans.symhash["\\textstyle",atname:"displaystyle"] = "false";
Trans.symhash["\\scriptstyle",atname:"scriptlevel"] = "1"},
Trans.symhash["\\scriptscriptstyle",atname:"scriptlevel"] = "2"},
Trans.symhash["\\textrm"] = "\\mathrm"},
Trans.symhash["\\mathbf",  atname:"mathvariant"] = "bold"},
Trans.symhash["\\textbf",  atname:"mathvariant"] = "bold"},
Trans.symhash["\\mathit",  atname:"mathvariant"] = "italic"},
Trans.symhash["\\textit",  atname:"mathvariant"] = "italic"},
Trans.symhash["\\mathtt",  atname:"mathvariant"] = "monospace"},
Trans.symhash["\\texttt",  atname:"mathvariant"] = "monospace"},
Trans.symhash["\\mathsf",  atname:"mathvariant"] = "sans-serif"},
Trans.symhash["\\mathbb",  atname:"mathvariant"] = "double-struck"},
Trans.symhash["\\mathcal", atname:"mathvariant"] = "script"},
Trans.symhash["\\mathfrak",atname:"mathvariant"] = "fraktur"}
];
 */
var browserstr = "Chrome";
function formatnolx(s){return s;}
Trans.isIE = (document.createElementNS==null);
Trans.firefox = (browserstr.indexOf("Firefox")>=0);
Trans.chrome =(browserstr.indexOf("Chrome")>=0);
Trans.referlabels = [];  
Trans.subsupfontrate = "0.6";
Trans.limitfontrate = "0.6"; 
Trans.lowerc = "acegmnpqrsuvwxyz\u03B1\u03B2\u03B5\u03B7\u03B9\u03BC\u03BD\u03C0\u03C1\u03F1\u03C3\u03C4\u03C5\u03C7\u03C8\u03C9";
Trans.chapter = 0;
Trans.section = 0;
Trans.subsection = 0;
Trans.equationnum = 0; 
Trans.equnumber = function()
{
    var equnum = '';
    if (Trans.chapter > 0 )
       equnum += Trans.chapter +".";
    if (Trans.section>0)
       equnum += Trans.section +".";
    equnum += '' + (++Trans.equationnum);
    return "(" + equnum +")";
}
Trans.areAllLower = function(s)
{
    if (s == null) 
        return true;
    for (var i=0; i < s.length; i++)
        if (this.lowerc.indexOf(s.charAt(i)) < 0)
            return false;
    return true;
}    
function Trans(s, color, fs, fontname)
{
    this.wcolor = "red";
    this.color = color;
    if (this.color == 'red' || this.color =='#ff0000')
        this.wcolor = "blue";
    this.s = s; 
    this.pos = 0;
    this.fs = fs;
    this.math = false;
    this.isLower = function(s)
    {
        if (s == null) return true;
        var i = s.length-6;
        if (i < 0 || s.substring(i) != "</div>") return false;
        return Trans.areAllLower(s.charAt(i-1));

    }
  

    this.format = function(s,fs,hs)
    {
        if (hs == null)
            hs='0';
        var vs = '0';
        //"-" + Math.floor(0.20*fs);
       // if (Trans.isIE)    hs = "-" + Math.floor(0.10*fs);
        s =  "<table cellpadding=0 cellspacing=0 border=0><tr><td><div  class=tlmmsty style=\"color:" + this.color +";height:" +  fs  + "px;font-size:" + (fs - Math.round(4* this.linethick(fs)) )
            +"px;overflow:hidden;margin:" + vs +"px " + (hs)
            +"px 0px 0px\"><nobr>" + s +"</nobr></div></td></tr></table>";

        return s;
    }
    this.formatl = function(s,fs)
    {
        var hs='0', vs = '0'; 
       // if (Trans.isIE) hs = "-" + Math.floor(0.1*fs);
        //vs = "-" + Math.floor(0.30*fs);
        return "<div class=tlmmsty style=\"color:" + this.color +";height:" +    Math.round(fs )   + "px;margin:" + vs +"px " + hs
            +"px 0px 0px;font-size:" + (fs -4* this.linethick(fs)) +"px\"><nobr>" + s +"</nobr></div>";
    }
    this.formats = function(s,fs)
    {
        var hs='0', vs = '0';
        return "<div class=tlmmsty  style=\"color:" + this.color +";font-style:normal;height:"
        + fs  + "px;font-size:"
        + fs  + "px;margin:" + vs +"px " + hs +"px 0px 0px\">" + s +"</div>";
    }
    this.formatthin = function(s,fs)
    {
        var hs='0', hs1='0',vs =  '0';//"-" + Math.floor(0.20*fs);
        if (Trans.isIE) 
        {
            //hs = "-" + Math.floor(0.10*fs);
        }
        else if(Trans.firefox)
        {
            //hs = "-" + Math.floor(0.25*fs);
            //hs1 = "-" + Math.floor(0.25*fs);
        }   
        return "<div  class=tlmmsty  style=\"color:" + this.color +";height:" + fs + "px;font-size:" + (fs  ) +"px;margin:"
            + vs +"px " + hs +"px  0px " + hs1 +"px\"><nobr>" + s +"</nobr></div>";
    }
    this.formate = function(s,fs)
    {
        return "<div  class=tlmmsty  style=\"color:" + this.color +";font-family:Times;height:" + fs + "px;color:" + this.wcolor +";font-size:" + (fs  ) +"px;\"><nobr>" + s +"</nobr></div>";
    }
    this.formatbuf = function(s, Z, fs)
    {
        var bb = Trans.areAllLower(s.replace(/\s/g,''));
        if (bb) 
        {   
            var x = Math.ceil(fs*0.5 ) ;
            var  t = this.format(s,fs);
            var y = Math.ceil(fs*.5  ) ;
        }
        else
        {
            x = Math.ceil(fs*.5);
            t = this.format(s,fs);
            y = Math.ceil(fs/2); 
        } 
        Z[Z.length] ={
            x:x,
            y:y, 
            t:t
        }; 
    }
    this.param = function()
    {
        var x;
        while ( (x = this.literal()) !=null && x!='{');
        var k1 = this.pos;
        x = this.closeone("{", "}");
        return this.s.substring(k1,this.pos-1).replace(/^[ ]+/, '').replace(/[ ]+$/, '');
        
    }
    this.literal = function(skip)
    {
        var s = this.s;
        var did = false;
        var state = 0;
        var bstate = 0;
        var i = this.pos;
        var j = this.pos;
        var ans = null;
        while (i < s.length && s.charAt(i) == ' ') i++;
        if (i > j)
        {
            this.pos = i;
            if (skip!=null) return ' ';
            j = i;
        }
        while (i < s.length)
        {
             
            if (state == 0)
            {
                if (s.charAt(i) == ' ')
                {
                    i++;
                }
                else if (s.charAt(i) == '\\')
                {

                    state = 1;
                    j = i;
                    i++;
                }
                else if (s.charAt(i)<='9' && s.charAt(i) >='0' || s.charAt(i)=='.')
                {
                    state = 2;
                    j= i;
                    i++;
                }
                else if (s.charAt(i) == '$')
                {
                    if ( i < s.length-1 && s.charAt(i+1) == '$')
                    {
                        this.pos = i+2;
                        ans = "$$";
                        state = 0;
                        break;
                    }
                    else  
                    {
                        this.pos = i+1;
                        ans = '$';
                        break;
                    }
                        
                }
                else
                {
                    this.pos = i+1;
                    ans = s.charAt(i);
                    
                    break;
                }
            }
            else if (state == 2)
            {
                if (s.charAt(i)<='9' && s.charAt(i) >='0' || s.charAt(i)=='.')
                {
                    i++;
                }
                else
                {
                    this.pos = i;
                    ans = s.substring(j,i);
                    state = 0;
                    break;
                }
            }
            else if (state == 3)
            {
                if ( s.charAt(i)=='}')
                {
                    this.pos = i+1;
                    ans = s.substring(j,i+1).replace(/ /g,'');
                    state = 0;
                    break;
                }
                else
                    i++;
            }
            else if (state == 1)
            {
                if (i == j+1 && s.charAt(i) == '\\')
                {
                    this.pos = i+1;
                    ans = '\\\\';
                    state = 0;
                    break;
                }
                else if (i == j+1 && (s.charAt(i) == '{' || s.charAt(i) == '}' || s.charAt(i) == ',' || s.charAt(i) == '>' ||s.charAt(i) == ':' || s.charAt(i) == ';'))
                {
                    this.pos = i+1;
                    ans = '\\' + s.charAt(i);
                    state = 0;
                    break;
                } 
                
                else if ( s.charAt(i)=='{' && (s.substring(j,i)=='\\begin'||s.substring(j,i)=='\\end') )
                {
                    i++;
                    state = 3;
                }
                else if ((s.charAt(i)=='(' ||  s.charAt(i)=='[' ) && s.substring(j,i)=='\\left' )
                {
                    this.pos = i+1;
                    ans = s.substring(j,i+1);
                    state = 0;
                    break;
                }
                else if ((  s.charAt(i)==')'||   s.charAt(i)==']') && s.substring(j,i)=='\\right' )
                {
                    this.pos = i+1;
                    ans = s.substring(j,i+1);
                    state = 0;
                    break;
                }
                else if (  (s.charAt(i) < 'a' || s.charAt(i) > 'z')   )
                {
                    this.pos = i;
                    if (i>j+1)
                    {
                        ans = s.substring(j,i);

                        while  (i >= j+1 && Trans.symhash[ans]==null)
                        {
                            i--;
                            ans = s.substring(j,i);
                            did = true; 
                        }
                        if (i >= j+1)
                        {

                            this.pos = i; 

                        }
                        else
                        {
                            ans = s.substring(j,this.pos);
                        }
                        state = 0;
                        break;
                    }
                    else
                    {  
                        state = 0;
                    }

                }
                else i++;
            }
        }
        
        if (state==2)
        {
            this.pos = i;
            ans = s.substring(j,i);
        }
        else if (state==1 && ans == null)
        {
            this.pos = i;
            ans = s.substring(j,i);
            while  (i > j  && Trans.symhash[ans]==null)
            {
                i--;
                ans = s.substring(j,i);
                did = true; 
            }
            if (i >  j )
            {
                this.pos = i; 
                state = 0;
            }
            else
            {
                ans = s.substring(j,this.pos);
                state = 1;
            }


        }
        else if (state == 3 && ans == null)
        {
            this.pos = i;
            ans = s.substring(j,i+1);
        }
        return ans;
    }

    this.closeone = function(openc,c )
    {
        var t = ''; 
        var s = 1;
        while ((t = this.literal()) != null)
        {
            if (t == openc) s++;
            else if ( t == c) s--;
            if (s == 0) return t;
        }
        return null;
    }
    this.subs = function(t)
    {
        var tt  = Trans.symhash[t];
        if (tt!=null) return tt; 
        return t;
    }
    this.fontname = fontname;
    if (fontname == null)
        this.fontname = "sans-serif";
    
    this.linethick = function(fs)
    {
        return Math.floor(fs/50) + 1;
    }
    this.recur = function(p, beginx,endx, fs)
    { 
        var s = this.s;
        this.pos = p;
        var tt, t, a, u, v, buf = '', ans='';
        var k, k1, k2, k3, k4, newpos = 0;
        var x, y, lk = this.linethick(fs);
        var Z = [];
        var w, z, num, den;
        var sum = 1; 
        var old = this.pos;
        var numrows = 0;
        var labelis = '';
        var alignment = null;
        var envir = (endx!=null && endx.indexOf("\\end{") >= 0);
        if (this.math) envir = true;

        if (endx=='\\end{tabular}' )
        { 
            alignment =  this.param();
        }
        else if ( endx=='\\end{array}')
        { 
            alignment =  this.param().replace(/[^a-z]/g,'');
        }
            
        while ((tt=this.literal(1))!=null)
        {
            if (beginx!=null && tt==beginx)
            {
                sum++;
            }
            else if (endx != null && tt == endx) 
            {
                sum--;
            }
            if ( (endx!=null && endx==tt) && (beginx == null || sum==0 ) )
            {
                break;
            }
             
            switch(tt)
            {
                 case '^': case '_':
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    if (buf!='')this.formatbuf(buf, Z, fs);
                    buf = '';
                    k1 = this.pos;
                    a = this.literal();
                    if (a == '{')
                    {
                        num  = this.recur(this.pos,"{","}",Math.ceil( Trans.subsupfontrate *fs));
                    }
                    else
                    {
                        x = Math.ceil(Trans.limitfontrate*fs/2);
                        t = this.subs(a);
                        num = {
                            x:x,
                            y:x,
                            t:this.format(t,Math.ceil(Trans.limitfontrate*fs))
                        };
                    }
                    var islower = true;
                    if (Z.length > 0)
                    {
                       w = Z[Z.length-1];
                       islower = this.isLower(w.t);
                    }
                    else
                    {
                        w = {x:Math.round(fs/2),y:Math.round(fs/2),t:''};
                        islower = true;
                    }
                    if (islower)
                    {
                      //  w.x = Math.ceil(w.x*0.67);
                      //  w.y = Math.ceil(w.y*0.67);

                    }

                    k1 = this.pos;
                    a = this.literal();
                    if (a!='^' && a!='_')
                    {
                       this.pos = k1;
                       if (tt =='^')
                       {
                        var lowery = w.x+w.y;
                        lowery = Math.max(lowery-num.x, num.y);

                        t = "<table cellpadding=0 cellspacing=0 border=0>"
                        +   "<tr height=" + (w.x + w.y + num.x) +"><td  valign=center>" + w.t
                        + "</td><td  valign=top align=left>" + num.t.replace(/vertial.align:[^;]+/g, 'vertical-align:top') +"</td></tr></table>";
                         
                        y = w.y;//Math.max(w.y, num.y-w.x);
                        x = w.x ;

                        Z[Z.length-1] = {
                            x:x,
                            y:y,
                            t:t
                        };
                      }
                      else
                      {
                         lowery = w.x+w.y;
                        lowery = Math.max(lowery-num.y, num.x);
                        var hs = Math.round(0.2*fs);
                        t = "<table cellpadding=0 cellspacing=0 border=0><tr height="
                        + (w.x + w.y + num.y) +"><td  valign=middle>" + w.t
                        + "</td><td  valign=bottom align=left>" + num.t.replace(/vertial.align:[^;]+/g, 'vertical-align:bottom') +"</td></tr></table>";
          
                        x = w.x;// Math.max(w.x, num.x-w.y);
                        y = w.y ;

                        Z[Z.length-1] = {
                            x:x,
                            y:y,
                            t:t
                        };
                       }
                    }
                    else
                    {
                        var thise = a;
                        k1 = this.pos;
                        a = this.literal();
                        if (a == '{')
                        {
                           den  =this.recur(k1,"{","}",Math.ceil( Trans.subsupfontrate *fs));
                        }
                        else
                        {
                           x = Math.ceil(Trans.limitfontrate*fs/2);
                           t = this.subs(a);
                           den = {
                            x:x,
                            y:x,
                            t:this.format(t,Math.ceil(Trans.limitfontrate*fs))
                           };
                        }
                        if (thise == '^')
                        {
                            var ww = num;
                            num = den;
                            den = ww;
                        }
                        var hv = islower?0.67:0.9;
                        var hh = num.x + den.y + Math.max(num.y + den.x, Math.round(hv*(w.x+ w.y)));
                        t  = "<table  cellpadding=0 cellspacing=0 border=0><tr><td rowspan=2 align=right><table  cellpadding=0 cellspacing=0 border=0><tr height=" + (hh-w.x-w.y-den.y) +"><td>"
                        + "<div style=\"" +  (hh-w.x-w.y-den.y) +"px;width:2px\"><!-- --></td></tr><tr height=" +  Math.round(hv*(w.x+ w.y)) + "><td>" + w.t +"</td></tr><tr height=" + (den.y) +"><td>"
                        + "<div style=\"" +   den.y  +"px;width:2px\"><!-- --></td></tr></table></td><td align=left valign=top>" + num.t + "</td></tr><tr><td align=left valign=bottom>" +  den.t.replace(/text-align:center/,'').replace(/vertical-align:middle/,'') +"</td></tr></table>";
                        y = w.y;// + den.y;
                        x = w.x;//hh - y;
                        Z[Z.length-1] = {x:x, y:y, t:t};
                    }
                    break;
                case '\\frac':

                    if (this.math == false)
                    {
                        buf += tt;
                        break;
                    }
                    if (buf!='') this.formatbuf(buf, Z, fs);
                    buf = '';
                    
                    u = this.literal();
                    if (u!='{' ) 
                    { 
                        Z[Z.length] =  {
                            x:Math.ceil(fs/2), 
                            y:Math.ceil(fs/2),
                            t:this.formate("Missing \"{\"   in "   + s.substring(this.pos))
                        };
                        break;
                    }
                     
                    num = this.recur(this.pos, "{", "}", fs);
                    x = num.x + num.y;
                    a = this.literal();
                    if (a !=  '{') 
                    { 
                        Z[Z.length] =   Z[Z.length] =  {
                            x:Math.ceil(fs/2), 
                            y:Math.ceil(fs/2),
                            t:this.formate("Missing \"{\"   in "  + s.substring(this.pos))
                        };
                        break;
                    }
                   
                    den = this.recur(this.pos, "{", "}", fs);
                    y = den.x + den.y;
                   
                    t = "<table cellpadding=0 cellspacing=0 border=0><tr height=" + x +"><td align=center valign=center>" + num.t 
                    + "</td></tr><tr height=" + lk +"><td><div class=tlmmline style=\"background-color:" + this.color +";height:" + lk +"px\"><!-- --></td></tr><tr height=" + y +"><td  align=center valign=center>" + den.t +"</td></tr></table>";
                    x += Math.ceil(lk/2);
                    y += lk - Math.ceil(lk/2);

                    Z[Z.length] = {
                        x:x, 
                        y:y, 
                        t:t
                    };
                  
                    break;
                case '\\lim':
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    if (buf!='') 
                        this.formatbuf(buf, Z, fs);
                    buf = '';
                    newpos = this.pos;
                    a = this.literal();
                    if (a!='_' ) 
                    {
                        Z[Z.length] = {
                            x:Math.ceil(fs/2), 
                            y:Math.ceil(fs/2),
                            t:this.formats('lim ',fs)
                        };
                        this.pos = newpos;
                        break;
                    }

                    a = this.literal();
                    k1 = this.pos;
                    if (a != "{" ) 
                    { 
                        Z[Z.length] = {
                            x:Math.ceil(fs/2), 
                            y:Math.ceil(fs/2),
                            t:this.formate("Missing \"{\" in "   + s.substring(newpos ) )
                        };
                        break;
                    }
                    num  =this.recur(this.pos,"{","}",Math.ceil(Trans.limitfontrate*fs));
                    x = num.x + num.y;
                   
                    t = "<table cellpadding=0 cellspacing=0><tr height=" + fs +"><td align=center>"  + this.formats('lim ', fs) 
                    + "</td></tr><tr height=" +  x +"><td  align=center >" + num.t +"</td></tr></table>";
                    y = Math.round(fs/2 + x);
                    x = Math.round(fs/2);
                    Z[Z.length] = {
                        x:x, 
                        y:y, 
                        t:t
                    };
                   
                    break;    
                case '\\sum': case '\\prod':
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    if (buf!='') this.formatbuf(buf, Z, fs);
                    buf = '';
                    newpos = this.pos;
                    u = this.literal();
                    if ( u!='_' && u!='^') 
                    {
                        this.pos = newpos;
                        buf += this.subs(tt);
                        break;
                    }

                    k1 = this.pos;
                    a = this.literal();
                    if (a == '{')
                    {
                        k1 = this.pos;
                        num = this.recur(this.pos,"{", "}",Math.ceil(Trans.limitfontrate*fs));
                    }
                    else
                    {
                        x = Math.ceil(Trans.limitfontrate*fs/2);
                        num = {
                            x:x,
                            y:x,
                            t:this.format(this.subs(a),Math.ceil(Trans.limitfontrate*fs)) 
                        };
                    }
                    v = this.literal();
                    if (v!='_' && v!='^') 
                    {
                        
                        x = num.x + num.y;
                        if (u =='_')
                        {
                            t = "<table cellpadding=0 cellspacing=0><tr height=" + fs +"><td>" + this.formats(tt,fs) 
                            + "</td></tr><tr height=" + x +"><td>" + num.t +"</td></tr></table>";
                            y = Math.round(fs/2 + x);
                            x = Math.round(fs/2);
                        }
                        else
                        {
                            t = "<table cellpadding=0 cellspacing=0><tr height=" + x +"><td  align=center >" + num.t +"</td></tr><tr height=" + fs +"><td  align=center >" +  this.formats(tt,fs) 
                            + "</td></tr></table>"; 
                            x = Math.round(fs/2 + x);
                            y = Math.round(fs/2);
                        }
                        Z[Z.length] = {
                            x:x, 
                            y:y, 
                            t:t
                        };
                       
                        break;
                    }

                    k3 = this.pos;
                    a = this.literal();
                    if (a == '{')
                    {
                        k3 = this.pos;
                        z  = this.recur(this.pos, "{", "}", Math.ceil(Trans.limitfontrate*fs));
                    }
                    else
                    {
                        k4 = this.pos;
                        x = Math.ceil(Trans.limitfontrate*fs/2);
                        z = {
                            x:x,
                            y:x,
                            t:this.format(this.subs(a),Math.ceil(Trans.limitfontrate*fs))
                        };
                    }
                     
                    if (u !='^')
                    {
                        var zz = num;
                        num = z;
                        z = zz;
                    }

                    x = num.x + num.y;
                    y = z.x + z.y;
                    tt= this.subs(tt);
                    t = "<table cellpadding=0 cellspacing=0><tr height=" + x +"><td  align=center >" + num.t +"</td></tr>"
                    +"<tr height=" + fs +"><td  align=center >"  +  this.formats(tt,fs) 
                    + "</td></tr><tr height=" + y +"><td  align=center >" + z.t +"</td></tr></table>";
                    x = Math.round(fs/2 + x);
                    y = Math.round(fs/2 + y);
                    Z[Z.length] = {
                        x:x, 
                        y:y, 
                        t:t
                    };
                     
                    break;

                case '\\int': case '\\oint':
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    if (buf!='') this.formatbuf(buf, Z, fs);
                    buf = '';
                    newpos = this.pos;
                    u = this.literal();

                    if ( u!='_' && u!='^') 
                    {
                        this.pos = newpos;
                        buf += this.subs(tt);
                        break;
                    }
                    k1 = this.pos;
                    a = this.literal();
                    if (a == '{')
                    {
                        k1 = this.pos;
                        num = this.recur(k1,"{", "}",Math.ceil(Trans.limitfontrate*fs));
                    }
                    else
                    {
                        x = Math.ceil(Trans.limitfontrate*fs/2);
                        num = {
                            x:x,
                            y:x,
                            t:this.format(this.subs(a), Math.ceil(Trans.limitfontrate*fs)) 
                        };
                    }
                    newpos = this.pos;
                    v = this.literal();
                    if (v!='_' && v!='^') 
                    {
                        
                        x = num.x + num.y;
                        tt = this.subs(tt);
                        if (u =='_')
                        {
                            t = "<table cellpadding=0 cellspacing=0 border=0><tr height=" + x +"><td rowspan=3 valign=middle width=" + Math.ceil(fs/2) +">" + this.formatthin(tt,fs+x) 
                            + "</td><td><!----></td></tr><tr height=" + fs +"><td><!-- --></td></tr><tr height=" + x +"><td>" + num.t +"</td></tr></table>";
                            y = Math.round(fs/2 + x);
                            x = Math.round(fs/2 + x);
                        }
                        else
                        {
                            t = "<table cellpadding=0 cellspacing=0><tr height=" + x +"><td rowspan=3 valign=middle>" + this.formatthin(tt,fs+x) 
                            + "</td><td>" + num.t +"</td></tr><tr height=" +  fs +"><td><!-- --></td></tr><tr height=" + x +"><td><!----></td></tr></table>";
                            x = Math.round(fs/2 + x);
                            y = Math.round(fs/2 + x);
                        }
                        Z[Z.length] = {
                            x:x, 
                            y:y, 
                            t:t
                        };
                        this.pos = newpos;
                        break;
                    }
                    a = this.literal();
                    k3 = this.pos;
                    if (a == '{')
                    {
                        k1 = this.pos;
                        z = this.recur(k1,"{", "}",Math.ceil(Trans.limitfontrate*fs));
                    }
                    else
                    {
                        x = Math.ceil(Trans.limitfontrate*fs/2);
                        z = {
                            x:x,
                            y:x,
                            t:this.format(this.subs(a),Math.ceil(Trans.limitfontrate*fs))
                        };
                    } 
                  
                    if (u =='^')
                    {
                        zz = num;
                        num = z;
                        z = zz;
                    }
                    x = num.x + num.y;
                    y = z.x + z.y;
                    tt = this.subs(tt);
                    t = "<table cellpadding=0 cellspacing=0 border=0>"
                    + "<tr height=" + x +"><td rowspan=3 valign=middle >"   +  this.formatthin(tt,x+y+fs) + "</td>"
                    + "<td>"   + num.t +"</td></tr>"
                    + "<tr height=" + fs+"><td>&nbsp;</td></tr>"
                    + "<tr height="  + y +"><td  align=center >"  
                    + z.t  + "</td></tr></table>";
                    x = Math.round(fs/2 + x);
                    y = Math.round(fs/2 + y);
    
                    Z[Z.length] = {
                        x:x, 
                        y:y, 
                        t:t
                    };
                 
                    break;
                case '\\left(': case '\\left[':  case '\\left{':
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    if (buf!='')this.formatbuf(buf, Z, fs);
                    buf = '';
                    k1 = this.pos;
                    var closed = "\\right" + String.fromCharCode(2+tt.charCodeAt(5));
                    if (tt.charAt(5) == '(')
                        closed = "\\right" + String.fromCharCode(1+tt.charCodeAt(5));
    
                    num  =this.recur(k1, tt, closed, fs);
                    x = num.x + num.y;
                    t = "<table cellpadding=0 cellspacing=0 border=0>"
                    + "<tr height=" + x +"><td>"   +  this.formatthin(tt.charAt(5),x) + "</td>"
                    + "<td>"   + num.t +"</td>"
                    + "<td>"   +  this.formatthin(closed.charAt(6),x) 
                    + "</td></tr></table>";
                    x = Math.round(x/2);
                    y = Math.round(x/2);
                    Z[Z.length] = {
                        x:x, 
                        y:y, 
                        t:t
                    };
                     
    
                    break;
               
     
                case "{":

                    if (envir)
                    {
                       this.formatbuf(buf, Z, fs);
                       buf = '';
                       Z[Z.length] = this.recur(this.pos, "{", "}", fs);
                    }
                    else
                    {
                        num = this.recur(this.pos, "{", "}", fs);
                        if (typeof(num.t) == 'undefined')
                        buf += num;
                        else
                          buf += num.t;
                    }
                    if (endx == '}') 
                        sum--;
                    break;
                case "\\sqrt" :
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    if (buf!='') this.formatbuf(buf, Z, fs);  
                    buf = '';
                    a = this.literal();
                    if (a != '{')
                    {
                        Z[Z.length] = {
                            x:Math.ceil(fs/2), 
                            y:Math.ceil(fs/2),
                            t:this.formate("Missing \"{\"   in " + s.substring(k1 ))
                        };
                        break;
                    }
                    num = this.recur(this.pos, "{", "}", fs); 
                    tt = this.subs(tt);
                    t = "<table cellspacing=0 cellpadding=0><tr height=" +  lk + "><td rowspan=2 valign=top>" + this.format(tt, Math.round( 1.3*(num.x + num.y+ lk )) ) 
                        + "</td><td><div class=tlmmline style=\"background-color:" + this.color +";height:" 
                        + lk +"px\"><!-- --></div></td></tr>"
                    + "<tr><td>" + num.t + "</td></tr></table>"; 
                    x = num.x+ 2*lk ;
                    y = num.y+9*lk;
                    Z[Z.length] = {
                        x:x, 
                        y:y, 
                        t:t
                    };
                   
                    break;  

                case  "\\arcsin":  
                case "\\arctan":  
                case"\\arg" :  
                case"\\cos" :  
                case"\\cosh":  
                case"\\cot" :  
                case"\\coth":  
                case"\\csc" :  
                case"\\deg" :  
                case"\\det":  
                case"\\dim" :  
                case"\\exp" :  
                case"\\gcd" :  
                case"\\hom" :  
                case"\\inf" :  
                case"\\ker" :  
                case"\\lg" :  
                case"\\liminf" :  
                case"\\limsup" :  
                case"\\ln":  
                case"\\log" :  
                case"\\max" :  
                case"\\min" :  
                case"\\sec" :  
                case"\\sin" :  
                case"\\sinh" :  
                case"\\sup" :  
                case"\\tan" :  
                case"\\tanh":
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    Z[Z.length] = {
                        x:Math.round(fs/2), 
                        y:Math.round(fs/2), 
                        t:this.formats(tt.substring(1), fs, true)
                    };
                    break;
                case "\\over":
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    if (buf!='')
                    {  
                        this.formatbuf(buf,Z,fs);
                    }   
                    buf = '';
                    num = this.padding0(Z,0,Z.length,true,fs);
                    den = this.recur(this.pos, "{", "}",fs);
                    x = num.x + num.y;
                    y = den.x + den.y;
                    lk = this.linethick(fs);
                    t = "<table cellpadding=0 cellspacing=0 border=0><tr height=" + x +"><td align=center valign=center>" + num.t 
                    + "</td></tr><tr height=" + lk +"><td><div class=tlmmline style=\"background-color:" + this.color +";height:" + lk +"px\"><!-- --></td></tr><tr height=" + y +"><td  align=center valign=center>" + den.t +"</td></tr></table>";
                    x += Math.ceil(lk/2);
                    y += lk - Math.ceil(lk/2);
                    return {
                        x:x, 
                        y:y, 
                        t:t
                    };
                case "\\half": 
                case "\\quarter":
                    
                    if (this.math == false)
                    {
                        buf += tt;break;
                    }
                    if (buf!='')
                    {  
                        this.formatbuf(buf,Z,fs);
                    }   
                    buf = '';
                    lk = this.linethick(fs );
                    t = "<table cellpadding=0 cellspacing=0 border=0><tr height=" + Math.ceil(fs ) +"><td align=center valign=center>" + this.formats("1",fs)  
                    + "</td></tr><tr height=" + lk +"><td><div class=tlmmline style=\"background-color:" + this.color +";height:" + lk +"px\"><!-- --></td></tr><tr height=" + + Math.ceil(fs ) +  "><td  align=center valign=center style=\"color:" + this.color +"\">" + this.formats(  ((tt=="\\half")?'2':'4') , fs)
                    + "</td></tr></table>";
                    x = Math.ceil(fs  + lk/2);
                    y = Math.ceil(fs  + lk/2);
                    Z[Z.length] = {
                        x:x, 
                        y:y, 
                        t:t
                    };
                    break;
                case "&": case "\\\\": case "\\cr":
                     
                    if (!envir)
                    {
                        buf += tt; 
                        break;
                    }
                    if (buf!='' || endx.indexOf("\\end{") >=0)
                        this.formatbuf(buf,Z,fs);
                    buf = '';
                       
                    if (tt == '\\cr') tt = '\\\\';
                     
                    if (tt == '\\\\')
                    {
                          numrows++;
                          if (endx.indexOf("equation") > 0 || endx.indexOf("eqnarray") > 0)
                          {
                             Z[Z.length] = {x:0, y:0, t:labelis};
                          }
                          else
                             Z[Z.length] = {x:0, y:0, t:'\\\\'}; 
                          labelis ='';
                    }
                    else
                          Z[Z.length] = {x:0, y:0, t:'&'};
                    
                    break;
                    
                case "\\begin{pmatrix}": case "\\begin{bmatrix}":case "\\begin{vmatrix}":
                    if (envir)
                    {
                        this.formatbuf(buf,Z,fs);
                        buf = '';
                        Z[Z.length]   = this.recur(this.pos, tt, tt.replace(/begin/,'end'), fs);
                    } 
                    else ans += tt;
                    
                    break;
                case "\\begin{eqnarray}":case "\\begin{eqnarray*}":case "\\begin{equation}":
       
                    if (envir && buf != '')
                    {
                        this.formatbuf(buf,Z,fs);

                    }
                    else
                    {
                        ans += formatnolx(buf);
                       
                    }
                     buf = '';
                    this.math = true;
                    num   = this.recur(this.pos, tt, tt.replace(/begin/,'end'), fs);
                    this.math = false;
                    if (envir)
                        Z[Z.length] = num;
                    else
                        ans += num.t;
                    break;
                case "$$":
                    if (envir)
                    {
                        if (buf!='') {
                        buf += "<br>";
                        this.formatbuf(buf,Z,fs);
                       
                        }
                    }
                    else if (ans!='')
                    {
                        ans += formatnolx(buf) + '<br>';

                    }
                     buf = '';
                    this.math = true;
                    num   = this.recur(this.pos, null, '$$', fs);
                    this.math = false;
                   
                    if (envir)
                        Z[Z.length] = num;
                    else
                    {
                        ans += num.t ;
                        k = this.pos;
                        a = this.literal();
                        this.pos = k;
                        if (a !=null)
                        {
                            ans += "<br>";
                        }
                    }

                    break;
                case "$":
                    if (envir )
                    {  
                        if (buf!='')
                            this.formatbuf(buf,Z,fs);
                    }
                    else
                    {
                        ans = formatnolx(buf);

                    }
                    buf = '';
                    this.math = true;
                    num   = this.recur(this.pos, null, '$', fs);
                    this.math = false;
                    if (envir == false)
                    {
                        ans += num.t;
                    }
                    else
                        Z[Z.length] = num;
                    break;
                case "\\[":
                    if (envir)
                    {
                        this.formatbuf(buf,Z,fs);
                    }
                    else
                    {
                        ans = formatnolx(buf) + '<br>';
                    }
                    buf = '';
                    this.math = true;
                    num   = this.recur(this.pos, null, '\\]', fs);
                    this.math = false;
                    if (envir)
                        Z[Z.length] = num;
                    else
                        ans += num.t + "<br>";
                    break;
                
                case "\\(":
                    if (envir  && buf!='')
                    {  
                        this.formatbuf(buf,Z,fs);
                    }
                    else
                    {
                        ans = formatnolx(buf);
                    }
                    buf = '';
                    this.math = true;
                    num   = this.recur(this.pos, null, '\\)', fs);
                    this.math = false;
                    if (envir == false)
                        ans +=num.t;
                    else
                        Z[Z.length] = num;
                    break;
                case "\\chapter":
                    a = this.param();
                    Trans.chapter++;
                    buf += "<center><h1>Chapter " + Trans.chapter + "<br>" + a +"</h1></center>";
                    Trans.section = 0;
                    Trans.equationum = 0;
                    break;
                case "\\section":
                    a = this.param();
                    buf += "<h2>Section ";
                    if (Trans.chapter>0)
                        buf += Trans.chapter + ".";
                    buf += (++Trans.section);
                    buf += " " + a +"</h2>";
                    Trans.equationum = 0;
                    break;
                case "\\nonumber":
                    if (envir)
                    { 
                       labelis = null;
                    }
                    break;
                case "\\label":
                    labelis = this.param();
                    break;
                case "\\begin{case}": case "\\begin{tabular}": case "\\begin{array}":
                    if (envir  && buf!='')
                    {  
                        this.formatbuf(buf,Z,fs);
                        
                    }
                    else
                    {
                        ans += formatnolx(buf);
                    }
                    buf = '';
                    num   = this.recur(this.pos, tt, tt.replace(/begin/,'end'), fs);
                    if (envir == false)
                        ans +=num.t;
                    else
                        Z[Z.length] = num;
                    break;
                  
                 case "\\mbox":
                    a = this.param();
                    Z[Z.length] = {x:Math.round(fs/2),y:Math.round(fs/2),t:this.format(a, fs).replace(/font.style:italic/g,'font-style:normal')};
                    break;
                 case "\\hline":
                    if (endx!=null && (endx.indexOf("\\end{tabular}") >= 0  ))
                    {
                        if (Z.length > 0)
                           Z[Z.length-1].t += "\\hline";
                        else 
                           Z[0] = {x:0, y:0, t:"\\hline"};
                    }
                    else if (!envir)
                        buf += tt;
                    break;
                 case "\\ref":
                    a = this.param();
                    if (Trans.referlabels[a] == null)
                    {
                       buf += "(<font color=" + this.wcolor + ">Reference  \\ref{"+ a + "} not exists or not displayed</font>)" ;
                    }
                    else
                    { 
                       buf +=   Trans.referlabels[a]  ;
                    }
                    break;
                case "\\large": case "\\Large": case "\\LARGE": case "\\big": case "\\Big": case "\\BIG":
                 var r = parseFloat(Trans.symhash[tt]);
                 if ('' + r == 'NaN') r = 1;
                 return this.recur(this.pos, "{", "}", Math.round(r*fs));

                case "\\underline":
                num = this.recur(this.pos, "{", "}",fs);
                x = num.x;
                y = num.y;
                t = "<table cellpadding=0 cellpadding=0 border=0><tr height=" + (x+y) +"><td>"  +  num.t + "</td></tr><tr height=" + lk 
                    +"><td><div class=tlmmline  style=\"background-color:" + this.color +";height:"  + lk +"px\"><!-- --></div></td></tr></table>";
                return {x:x,  y:y, t:t};

            
            case "\\bf":
                 num = this.recur(this.pos, "{", "}",fs);
                 x = num.x;
                 y = num.y;
                 return {x: x,  y:y,  t: num.t.replace(/font.size/g, "font-weight:700;font-size")};
              break;
            case "\\bar":
       
                var  kk = this.pos;
                num = this.recur(kk, "{", "}", fs);
                if (typeof(num.t) == 'undefined')
                {
                    x = Math.round(fs/2);
                    num = {x:x, y:x, t:num};
                }
                var  ll = s.indexOf("}",kk);
                u = s.substring(kk,ll).replace(/<[^>]+>/g,'').replace(/ /g,'');
                if ( Trans.areAllLower(u) && u.length == 1)
                {
                   x = num.x + Math.round(-0.15*fs);
                   y = num.y + Math.round(0.15*fs);
                   var mt = Math.round(-0.55*fs);
                   t = "<table cellpadding=0 cellpadding=0 border=0><tr height=" + lk +"><td align=center><div class=tlmmline style=\"background-color:" + this.color +";color:" + this.color +";width:70%;height:"
                       + lk +"px;\"><!-- --></div><br><div class=tlmmsty style=\"color:" + this.color +";margin-top:" + mt +"px;font-size:" + fs +"px\">"  +  u + "</div></td></tr></table>";
                   return {x:x,  y:y, t:t};
                  
                }
                else
                {
                    x = num.x;
                   y = num.y;
                   t = "<table cellpadding=0 cellpadding=0 border=0><tr height=" + lk +"><td align=center><div class=tlmmline style=\"background-color:" + this.color +";width:90%;height:"  + lk +"px;\"><!-- --></div></td></tr><tr height=" + (x+y) +"><td>"  +  num.t + "</td></tr></table>";
                   return {x:x,  y:y, t:t};
                }
                 break;
            case "\\hat" : case "\\tilde":
                     
                        kk = this.pos;
                       num = this.recur(kk, "{", "}", fs);
                        if (typeof(num.t) == 'undefined')
                        {
                          x = Math.round(fs/2);
                          num = {x:x, y:x, t:num};
                        }
                        ll = s.indexOf("}",kk);
                        u = s.substring(kk,ll).replace(/ /g,'');
                        islower = Trans.areAllLower(u);
                       var  mb = 0.2;
                       var  mb1 = 0.2;
                         mt = 0.0;
                        var hx = 0;
                        var hy = 0;
                        hh = 0;
                        if (Trans.isIE * islower )
                        {
                           mb = -0.9;
                            mt =  -0.0;
                            mb1 = -0.1;

                        }
                        else if (!Trans.isIE * islower )
                        {
                            mb = -0.20;
                            mt = -0.80;
                            mb1 = -0.2;

                        }
                        else if (Trans.isIE * !islower )
                        {
                            mb = -0.7;
                            mt = 0.0;
                            mb1 = -0.2;

                        }
                        else if (!Trans.isIE * !islower )
                        {
                            mb = -0.20;
                            mt = -0.60;
                            mb1 = -0.2;

                        }
                        mb = Math.round(mb*fs);
                        mb1 = Math.round(mb1*fs);
                        mt =  Math.round(mt*fs);
                        var cr = this.subs(tt);
                        if (tt == '-') cr =  "<div style=\"height:" + lk +"px\"><!-- --></div>";
                        t = "<table cellspacing=0 cellpadding=0><tr><td align=center><div><div class=tlmmsty style=\"text-align:center;color:" 
                            + this.color +";margin-bottom:"  + mb
                            + "px;margin-top:" + mt + "px;font-size:"
                            + (Math.round(fs*0.6)) +"px\">" + cr +"</div><br><div class=tlmmsty style=\"color:" + this.color +";margin-bottom:"
                            + mb1+ "px;margin-top:" + mt + "px;font-size:"
                            + (fs-2)  +"px\">"
                            + num.t.replace(/<[^>]+>/g,'') +"</div></div></td></tr></table>";
 
                       if (!Trans.isIE  ) {
                        x = Math.round(num.x + mb  );
                        y = Math.round(num.y - mb1   );
                        if (islower)
                        {
                           x = Math.round(num.x + mb +mb );
                           y = Math.round(num.y - mb1 - mb );
                        }
                       }
                       else
                        {
                             x = Math.round(num.x -mb1     );
                             y = Math.round(num.y   +mb1   );
                             if (islower)
                             {
                                x = Math.round(num.x -mb1   );
                                y = Math.round(num.y +mb1  );
                             }
                        }
                        return {x:x,  y:y, t:t};
                default:
                    tt = this.subs(tt);
                    if (tt.indexOf("\\") > 0)
                        buf +=   tt +" ";
                    else
                        buf += tt;

                    break;

            }


        }
        if ( endx!=null && endx.indexOf("\\end{")==0) 
        {
           
            if (Z[Z.length-1].t!="&" && Z[Z.length-1].x==0 &&  Z[Z.length-1].y==0 &&buf.replace(/\s/g,'')=='')
            { 
                numrows--;
            }
            else
            { 
               this.formatbuf(buf,Z,fs);
               if (endx.indexOf("equation") > 0 || endx.indexOf("eqnarray") > 0)
               {
                   Z[Z.length] = {x:0, y:0, t:labelis}; 
               }
               else
               {   
                   Z[Z.length] = {x:0, y:0, t:'\\\\'};
               }
            }
              
             num =  this.padding(Z,endx,numrows+1,fs,alignment);
        }
        else if (this.math) 
        { 
            if (buf!='') this.formatbuf(buf,Z,fs);
            num = this.padding0(Z,0,Z.length,true,fs);
        }
        else
        {
            ans += formatnolx(buf);
            num = ans;
        }
        
        return num;
    }
    this.padding0 = function(Z, k1, k2, head,fs, alignment)
    {
        var lk = this.linethick(fs);
        var j=-1;
        var a = null;
        var b = null;
        if (alignment !=null)
        { 
         a = [];
         b = [];
        for (var i=0; i < alignment.length; i++)
        {
            if (alignment.charAt(i) <'z' && alignment.charAt(i) >'a')
            {
                a[a.length] = (alignment.charAt(i)=='l')?'left':(alignment.charAt(i)=='r'?'right':'center');
                b[b.length] =  i-j-1;
                j = i;
            }
        }
        b[b.length] = alignment.length-1-j;
        for (i=b.length; i <=k2-k1; i++) b[i] = 0;
        for (i=a.length; i < k2-k1; i++) a[i] = 'center';
       
        }
         
        if (k2==k1)
        {
            this.numcols = 1;
            return  {x:1, y:1, t:''};
        } 
        else  if (k2-k1 == 1)
        {
            this.numcols = 1; 
            if (head) return Z[k1];
            return {x:Z[k1].x, y:Z[k1].y, t:'<td>' + Z[k1].t +"</td>"};
        }
        var mx = 0; 
        var my = 0;

        
        for (  i=k1; i < k2; i++)
        {
            if (Z[i].x > mx) mx = Z[i].x;
            if (Z[i].y > my) my = Z[i].y;
        }
        this.numcols = 0; 
        this.rowheight = mx + my+2;
        var t = '';
        if (head) t ='<table cellspacing=0 cellpadding=0 border=0><tr>';
        if (b!=null && b[0] > 0) 
        {
            for (j=0; j < b[0]; j++)
            {
                if (j>0)
                {
                        this.numcols++;
                        t += '<td width=' + (lk-1) + '><div style="width:' + (lk-1) +'px;height:' + (mx + my+2)  + "px;background-color:transparent\"><!-- --></td>";
                }
                this.numcols++;
                t += '<td width=' + (lk-1) + '><div style="padding:0 0 0 0px;width:' + (lk-1) +'px;height:' + (mx + my+2)  + "px;background-color:" + this.color +"\"><!-- --></td>";
            }
        }
        var vc = '#' +  Math.round(Math.random()*256).toString(16)+  Math.round(Math.random()*256).toString(16)+  Math.round(Math.random()*256).toString(16);
        for (i=k1; i < k2; i++)
        {
            if (Z[i].x == 0) continue;
            if (i > 0 && head &&b==null)
            {
                t += "<td style=width:" + lk + "px><!-- --></td>";
                this.numcols++;
            }
           // t += "<td>" + (mx - Z[i].x) + " " + (Z[i].x + Z[i].y) + " " +  (my-Z[i].y) + "</td>";
            t +="<td " + ((a==null)?'':('align='+ a[i-k1])) + "><table cellspacing=0 cellpadding=0  border=0>";
             
            if (mx > Z[i].x)
                t += "<tr height=" + (mx-Z[i].x) +" ><td valign=top align=center><div  style=\"height:" + (mx-Z[i].x) +"px !important;width:5px;background-color:transparent;font-size:" + Math.round(0.9*(mx-Z[i].x)) +"px;border:0px " + vc + " solid\"><!-- --></div></td></tr>";
            t += "<tr height=" + (Z[i].y+Z[i].x) +"><td valign=middle style=\"border:0px black\">" + Z[i].t +"</td></tr>";
            if (my > Z[i].y)
                t += "<tr height=" + (my-Z[i].y) +"><td valign=bottom  align=center><div style=\"height:" + (my-Z[i].y) +"px !important;width:5px;background-color:transparent;font-size:" + Math.round(0.9*(mx-Z[i].y)) +"px;border:0px black solid\" ><!-- --></div></td></tr>";
            t += "</table></td>";
            this.numcols++;
            if (b!=null)
            {
                for (j=0; j < b[i-k1+1]; j++)
                {
                    if (j>0)
                    {
                        this.numcols++;
                        t += '<td width=' + (lk-1) + '><div style="width:' + (lk-1) +'px;height:' + (mx + my+2)  + "px;background-color:transparent\"><!-- --></td>";
                    }
                    this.numcols++;
                    t += '<td width=' + (lk-1) + '><div style="padding:0 0 0 0px;width:' + (lk-1) +'px;height:' + (mx + my+2)  + "px;background-color:" + this.color +"\"><!-- --></td>";
                    
                }
            }  
        }
        if (head)
        t +="</tr></table>";
        return {
            x:mx, 
            y:my, 
            t:t
        };
}       
  this.numcols = 0; 
  this.rowheight = 0;
  this.padding = function(Z,endx,nr,fs, alignment)
  {
       
       var lk = this.linethick(fs);
       var t = '', t11,t12,t21,t22,t31,t32;
       var k = 0, j = 0;
       var x = 0, y = 0;
       var U = []; 
       var numcols =0 ;
       var hline = [];
       var maxcols = 0;
       var W = new Array();
       var istable = false;
       if (endx == "\\end{tabular}")
       { 
       istable = true;
       if (Z[0].x == 0 && Z[0].y == 0)
       {
           hline[0] = Z[0].t.replace(/^\\\\/,'').replace(/.hline/g, 'h').length;
            
           j=1;
       }
       else 
       {
           hline[0] = 0; 
       }
       }
       var fh = [];
       for (var i=0; i < nr; i++)
       {
           var kk = 0;
           if ( endx.indexOf("equation") > 0 || endx.indexOf("eqnarray}") > 0)
               kk = 1;
           do 
           { 
             k = j;
             
             while (j < Z.length && Z[j].x!=0 && Z[j].y !=0)
             {
                
                j++;
             }
             W[kk++] = this.padding0(Z,k,j,true,fs,alignment);
             
             j++;
             if (j>=Z.length-1) break;
           }
           while (j-1 < Z.length && Z[j-1].t == '&');
           
           
           if ( endx.indexOf("equation") > 0 || endx.indexOf("eqnarray}") > 0)
           {
                var equn = '';   
                if (Z[j-1].t!=null) equn = Trans.equnumber();
               // if (Z[j-1].t!=null && Z[j-1].t!='' && Trans.referlabels[Z[j-1].t] !=null)
               // {
               //     equn += "<font color=" + this.wcolor +">label " + Z[j-1].t + " is being defined twice</font>";
               // }
                if (Z[j-1].t!=null && Z[j-1].t!='')
                   Trans.referlabels[Z[j-1].t] = equn;
                t =  this.format(equn,fs).replace(/font.style:italic/g, 'font-style:normal').replace(/font.family:[^:]+/g, 'font-family:times');
                
                W[0] = {x:Math.round(fs/2), y:Math.round(fs/2), t:t};
           } 
           else if ( endx.indexOf("tabular}") > 0)
           {
              hline[i+1] = Z[j-1].t.replace(/^\\\\/,'').replace(/.hline/g, 'h').length;
           }
           
           this.numcols = 0;
           var num = this.padding0(W,0,kk,false,fs,alignment);
           if (i==0) fh[0]= num.x;
           else if (i==nr-1) fh[2]= num.y;
           var y1 = num.x +  num.y;
           x += y1;
           num.x = this.numcols;
           
           if (num.x > numcols)
           {     
               numcols = num.x;
           }
           num.y = y1;
           U[i] = num ;
            
       }
       fh[1] = x - fh[0]-fh[2]; 
        
       for (  i=0; i < nr; i++)
       {
               for (j = U[i].x; j < maxcols; j++)
               U[i].t = U[i].t + "<td></td>";
       }
       
  
        
       if (nr == 1) 
       {
         if (endx.indexOf("pmatrix") > 0)        
        { 
            t11 = '<table cellspacing=0 cellpadding=0 border=0><tr><td>(</td>';
            t12 = '<td>)</td></tr></table>';
        }
        else if (endx.indexOf("bmatrix") > 0)
        { 
           t11 = "<table cellspacing=0 cellpadding=0 border=0><tr><td><table>"
              +  "<tr><td width=" + (2*lk) +"  valign=top><div style=\"width:" + (2*lk)  + "px;height:" + lk +"px;background-color:" + this.color  + "\"><!-- --></div></td></tr>" 
              +  "<tr><td width=" + (2*lk) +   " align=left><div style=\"width:" + lk  + "px;height:" + x +"px;background-color:" + this.color + "\"><!-- --></div></td></tr>"
              +  "<tr><td width=" + (2*lk) +"  valign=bottom><div style=\"width:" + (2*lk)  + "px;height:" + lk +"px;background-color:" + this.color  + "\"><!-- --></div></td></tr>"
              + "</table></td>";
           t12 = "<td><table>"
              +  "<tr><td width=" + (2*lk) +"  valign=top><div style=\"width:" + (2*lk)  + "px;height:" + lk +"px;background-color:" + this.color  + "\"><!-- --></div></td></tr>" 
              +  "<tr><td width=" + (2*lk) +   " align=right><div style=\"width:" + lk  + "px;height:" + x +"px;background-color:" + this.color + "\"><!-- --></div></td></tr>"
              +  "<tr><td width=" + (2*lk) +"  valign=bottom><div style=\"width:" + (2*lk)  + "px;height:" + lk +"px;background-color:" + this.color  + "\"><!-- --></div></td></tr>"
              + "</table></td></tr></table>";
        }                            
        else if (endx.indexOf("vmatrix") > 0)
        { 
            t11 = "<table cellspacing=0 cellpadding=0 border=0><tr>"
              +  "<td width=" + (lk) +   " align=left><div style=\"width:" + lk  + "px;height:" + x +"px;background-color:" + this.color + "\"><!-- --></div></td>";
            t12 = "<td width=" + (lk) +   " align=right><div style=\"width:" + lk  + "px;height:" + x +"px;background-color:" + this.color + "\"><!-- --></div></td>"
              + "</tr></table>";
        } 
        else  
        {
            t11 = "<table cellspacing=0 cellpadding=0 border=0><tr>";
            t12 = "</tr></table>";
        }
       }
       else 
       { 
        if (endx.indexOf("pmatrix") > 0)        
        { 
            t11 = '<table cellspacing=0 cellpadding=0 border=0><tr><td>(</td>';
            t12 = '<td>)</td></tr>';
            t21 = (nr<=2)?'':'<tr><td><div class=tlmvline style="width:' + lk  + 'px"><!-- --></div></td>';
            t22 = (nr<=2)?'':'<td><div  class=tlmvline  style="width:' + lk  + 'px"><!-- --></div></td></tr>';
            t31 = '<tr><td>(</td>';
            t32 = '<td>)</td></tr></table>';
        }
        else if (endx.indexOf("bmatrix") > 0)
        { 
             t11 = "<table cellspacing=0 cellpadding=0 border=0><tr>"
              + "<td width=" + lk +   " rowspan=" + nr + "><div style=\"width:" + lk  + "px;height:" + x +"px;background-color:" + this.color + "\"><!-- --></div></td>"
              + "<td width=" + (2*lk) +" rowspan=" + (nr-1) +" valign=top><div style=\"width:" + (2*lk)  + "px;height:" + lk +"px;background-color:" + this.color  + "\"><!-- --></div></td>";
             t12 = "<td width=" + (2*lk) +" rowspan=" + (nr-1) +" valign=top><div style=\"width:" + (2*lk)   + "px;height:" + lk +"px;background-color:" + this.color + "\"><!-- --></div></td>"
               + "<td width=" + lk +" rowspan=" + nr +"><div style=\"width:" + lk  + "px;height:" + x +"px;background-color:" + this.color + "\"><!-- --></div></td></tr>"; 
             t21 = (nr <=2)?'':'<tr>';
             t22 = (nr <=2)?'':'</tr>';
             t31 = '<tr><td valign=bottom width=' + (2*lk) + '><div style="width:' + (2*lk) + "px;height:" + lk + "px;background-color:" + this.color + '"><!-- --></div></td>';
             t32 = '<td  valign=bottom  width=' + (2*lk) + '><div style="width:' + (2*lk) + "px;height:" + lk + "px;background-color:" + this.color + '"><!-- --></div></td></tr></table>';
             
       }                            
        else if (endx.indexOf("vmatrix") > 0)
        {  
             t11 = "<table cellspacing=0 cellpadding=0 border=0><tr><td width=" + lk +" rowspan=" + nr +">"
               + "<div style=\"width:" + lk  +"px;height:" + x +"px;background-color:" + this.color
               + "\"><!-- --></div></td>";
             t12 = "<td width=" + lk +" rowspan=" + nr +">"
               + "<div style=\"width:" + lk  +"px;height:" + x + "px;background-color:" + this.color
               + "\"><!-- --></div></td></tr>";
             t21 = (nr <=2)?'':'<tr>';
             t22 = (nr <=2)?'':'</tr>';
             t31 = '<tr>';
             t32 = '</tr></table>';
        }
        else  if (endx.indexOf("{case}") > 0  )
        {
             if (Trans.isIE)
             t11 = "<table cellspacing=0 cellpadding=0 border=0><tr><td valign=bottom rowspan=" + nr +"><div style=\"border:0px black solid;font-size:" 
                 + Math.round(x*1.2) +"px;color:" + this.color  + ";vertical-align:bottom;margin-left:-" + Math.round(x*0.2) +"px;\">{</div></td>";
             else
               t11 = "<table cellspacing=0 cellpadding=0 border=0><tr><td valign=top rowspan=" + nr +"><div style=\"border:0px black solid;font-size:" 
                 + Math.round(x*1.2) +"px;color:" + this.color  + ";vertical-align:top;\">{</div></td>";
             t12 = "</tr>";
             t21 =  '<tr>';
             t22 =  '</tr>';
             t31 = '<tr>';
             t32 = '</tr></table>';
             
        }
        else // if (endx.indexOf("eqnarray") > 0  )
        {
            t11 = "<table cellspacing=0 cellpadding=0 border=0><tr>";
            t12 = "</tr>";
            t21 = "<tr>";
            t22 = t12;
            t31 = t21;
            t32 = "</tr></table>";
        }
       }
       
      
       t = ''; 
        
       for (  i=0; i < nr ; i++)
       {
           
           if (i==0)
           { 
               if (istable && hline[0]!=null && hline[0]>0)
               { 
                 t = "<table cellspacing=0 cellpadding=0 border=0>";
                 for (j=0; j < hline[i]; j++)
                 { 
                    if (j>0) t += "<tr height=" + (lk-1) +"><td colspan=" + (U[i].x+1) + "><div style=\"width:100%;height:" + 1 +"px;background-color:transparent\"><!-- --></div></td></tr>";
                      t  += "<tr height=" + (lk-1) +"><td  style=\"padding:0px 0px 0px 0px\" colspan=" + (U[i].x+1) + "><div style=\"width:100%;height:" + lk +"px;background-color:" + this.color +";margin:0px 0px 0px 0px\"><!-- --></div></td></tr>";
                 }
                 t += "<tr height=" + U[0].y + ">" + U[i].t + t12;
               }
               else
                   t  = t11 + U[i].t + t12;
           }
           else if (i >0 && i < nr - 1)
           {
               
               if (istable &&hline[i]!=null && hline[i]>0)
               { 
                 for (j=0; j < hline[i]; j++)
                 {   
                     if (j>0) t += "<tr height=" + (lk-1) +"><td colspan=" + (U[i].x+1) + "><div style=\"width:100%;height:" + 1 +"px;background-color:transparent\"><!-- --></div></td></tr>";
                     t += "<tr height=" + (lk-1) +"><td colspan=" + (U[i].x+1) + "><div style=\"width:100%;height:" + lk +"px;background-color:" + this.color +"\"><!-- --></div></td></tr>";
                 }
                 t +=   "<tr height=" + U[i].y + ">" + U[i].t + "</tr>";
               }
               else
                   t += t21 + U[i].t + t22;
           }
           else
           {
               if (istable && hline[nr-1]!=null && hline[nr-1]>0)
               {
                  for (j=0; j < hline[nr-1]; j++)
                 {   
                     if (j>0) t += "<tr height=" + (lk-1) +"><td colspan=" + (U[i].x+1) + "><div style=\"width:100%;height:" +1 +"px;background-color:transparent\"><!-- --></div></td></tr>";
                     t += "<tr height=" + (lk-1) +"><td colspan=" + (U[i].x+1) + "><div style=\"width:100%;height:" + lk +"px;background-color:" + this.color +"\"><!-- --></div></td></tr>";
                 }
               }
               
               if (istable && hline[nr]!=null && hline[nr] > 0)
               { 
                    t +=   "<tr height=" + U[i].y + ">" + U[i].t + "</tr>";
                    for (j=0; j < hline[nr]; j++)
                    { 
                      if (j>0) t += "<tr height=" + (lk-1) +"><td colspan=" + (U[i].x+1) + "><div style=\"width:100%;height:" + 1 +"px;background-color:transparent\"><!-- --></div></td></tr>";
                      t +=   "<tr height=" + (lk-1) +"><td colspan=" + (U[i].x+1) + "><div style=\"width:100%;height:" + lk +"px;background-color:" + this.color +"\"><!-- --></div></td></tr>"; 
                    }
                    t += "</table>";
               }
               else
               {
                  t += t31 + U[i].t + t32;
               }
               
           }
           
       }
       
       x = y = Math.ceil(x/2);
       if (endx.indexOf("\\end{case}") >= 0)
       {
           x = fh[0] + Math.round(fh[1]/2);
           y = fh[2] + Math.round(fh[1]/2);
           
       }
       return {x:x, y:x, t:t};
    }
    this.setcolor = function(cl){this.color = cl;}
    this.sets = function(s){this.s = s;}
}
var thetrans = new Trans(null,'red',20);
function latex2html(s,color,fs)
{
    
    if (color==null) color = 'black';
    if (fs == null) fs = 17;
    thetrans.setcolor(color);
    thetrans.sets(s);
    return   thetrans.recur(0,null,null, fs);
    
}
 




