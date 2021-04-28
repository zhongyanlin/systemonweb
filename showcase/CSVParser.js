 let m = (new CSVParse(source,'"',",",'\n')).nextMatrix();

function CSVParse() // noun  arguments
{
     
    this.str = '';
    this.quote = "\"";
    this.separates = [',', '\r\n'];
    this.previousOffset = -1;
    this.PREQUOTE = 0;
    this.QUOTE = 1;
    this.UNQUOTE = 2;
    this.POSTQUOTE = 3;
    this.NAKED = 4;
    this.FILEEND = 5;
    this.ERROR = 6;
    this.DIMENSIONEND = [7, 8];
    this.states =
            [
                /*PREQUOTE  = 0*/  [0, 1, 4, 5, 7],
                /*QUOTE     = 1*/  [1, 2, 1, 6, 1],
                /*UNQUOTE   = 2*/  [3, 1, 6, 5, 7],
                /*POSTQUOTE = 3*/  [3, 6, 6, 5, 7],
                /*NAKED     = 4*/  [4, 4, 4, 5, 7],
                /*FILE END  = 5*/  [5, 5, 5, 5, 5],
                /*ERROR     = 6*/  [6, 6, 6, 6, 6],
                /*DIM1 END  = 7*/  [0, 1, 4, 5, 7]

            ];
    this.state = this.PREQUOTE;
    this.pstate;
    this.ppOffset = -1;
    this.ppstate = 0;
    this.index = [0, 0];
    this.numSeparates = 2;

    if (arguments.length > 0)
    {
        this.str = arguments[0];
    }
    if (arguments.length >= 2)
    {
        this.quote = arguments[1];
    }
    if (arguments.length >= 3)
    {
        if (arguments[2] != null)
        {
            this.numSeparates = arguments.length - 2;
            this.separates = new Array(this.numSeparates);
            for (let i = 0; i < arguments.length - 2; i++)
                this.separates[i] = arguments[i + 2];
            this.index = new Array(this.numSeparates);
            for (let j = 0; j < this.numSeparates; j++)
                this.index[j] = 0;
        }
        else
        {
            this.numSeparates = 0;
            this.separates = null;
            this.numSeparates = 0;
        }
    }
    if (this.numSeparates > 0)
    {
        this.DIMENSIONEND = new Array(this.numSeparates);
        for (let i = 0; i < this.numSeparates; i++)
            this.DIMENSIONEND[i] = (7 + i);
    }

    this.transit = function(charCode)
    {
        if (this.state == this.FILEEND || this.state == this.ERROR || this.state == this.QUOTE && charCode >= 4)
        {
            return;
        }

        let diff = 0;
        if (charCode >= 4)
        {
            diff = charCode - 4;
            charCode = 4;
        }
        let v = this.state;
        if (v >= this.DIMENSIONEND[0])
            v = 0;
        this.state = this.states[v][charCode] + diff;

    };

    this.checkError = function(b)
    {
        if (b)
        {
            this.states[1][3] = this.states[2][2] = this.states[3][1] = this.states[3][2] = this.ERROR;
        }
        else
        {
            this.states[1][3] = FILEEND;
            this.states[2][2] = this.states[3][1] = this.states[3][2] = this.POSTQUOTE;
        }
    };
    
    this.ignorespace = true;
    
    this.code = function(c)
    {
        if (  c == ' ')
        {
            return 0;
        }
        if (c == this.quote)
        {
            return 1;
        }
        for (let i = 0; i < this.numSeparates; i++)
        {
            if (this.separates[i].indexOf("" + c) >= 0)
            {
                return  (i + 4);
            }
        }

        return 2;

    };

    this.putBack = function()
    {
        this.previousOffset = this.ppOffset;
        this.state = this.ppstate;
    }
    this.nextElement = function()
    {
        this.ppOffset = this.previousOffset;
        this.ppstate = this.state;
        if (this.str==null || this.state == this.FILEEND || this.state == this.ERROR)
        {
            return null;
        }
        let k;
        let c = ' ';
        let i = this.previousOffset;
        let charCode;
        let i1,j1;
        let j = i + 1;
        let ans = '';
        while (true)
        {
            i++;
            if (i < this.str.length)
            {
                c = this.str.charAt(i);
                charCode = this.code(c);
            }
            else
            {
                charCode = 3;
            }

            /*
             if ( (this.state == this.PREQUOTE || this.state > (this.ERROR + 1) ) && charCode > 4)
             {
             continue;
             }*/
            this.pstate = this.state;
            this.transit(charCode);

            switch (this.state)
            {
                case this.PREQUOTE:
                case this.NAKED:
                    break;
                case this.QUOTE:
                    if (this.pstate == this.UNQUOTE)
                    {
                        j = i;
                    }
                    else if (this.pstate != this.QUOTE)
                    {
                        j = i + 1;
                    }
                    break;
                case this.UNQUOTE:
                    if (i > j)
                    {
                         
                        ans += this.str.substring(j, i);
                    }
                    break;
                case this.POSTQUOTE:
                    break;
                case this.ERROR:
                    return null;
                default:
                    this.previousOffset = i;
                    k = this.state - 7;
                    if (k < 0)
                    {
                        k = this.numSeparates - 1;
                    }
                    for (let l = 0; l < k; l++)
                        this.index[l] = 0;
                    if (k >= 0)
                        this.index[k]++;

                    if (this.pstate == this.UNQUOTE || this.pstate == this.POSTQUOTE)
                    {
                        if (this.ignorespace == false && this.str.charAt(this.ppOffset+1)==' ')
                        {
                           ans = ' ' + ans;
                        }
                        return ans;
                    }
                    else
                    {
                        if (i > j)
                        {
                            if (this.ignorespace == false && j>0 && this.str.charAt(j-1)==' ')
                            {
                                j--;
                            }
                            return this.str.substring(j, i);
                        }
                        else
                            return '';
                    }
            }
        }
    };

    this.getState = function()
    {
        return this.state;
    };
    this.getPstate = function()
    {
        return this.pstate;
    };
    this.setString = function(s)
    {
        this.str = s;
    };
    this.setSeparates = function(s, i)
    {
        if (i == null)
        {
            if (s != null)
            {
                this.separates = s;
                this.numSeparates = s.length;
                this.index = new Array(this.numSeparates);
                for (let j = 0; j < this.numSeparates; j++)
                    this.index[j] = 0;
            }
            else
            {
                this.separates = null;
                this.numSeparates = 0;
                this.index = null;
            }
        }
        else if (i < this.numSeparates)
            this.separates[i] = s;
        this.state = this.PREQUOTE;
        this.previousOffset = -1;
    };
    this.setQuote = function(q)
    {
        this.quote = q;
        this.state = this.PREQUOTE;
        this.previousOffset = -1;
    };

    this.nextInt = function()
    {
        if (this.state == this.FILEEND)
            return null;
        let x = parseInt(this.nextElement());
        if ('' + x == 'NaN')
            return null;
        return x;
    };
    this.nextFloat = function()
    {
        return parseFloat(this.nextElement());
    };

    this.beyong = function(x)
    {
        if (x == null || this.index == null || x.length != this.index.length)
        {
            return false;
        }
        for (let k = x.length - 1; k >= 0; k--)
            if (this.index[k] < x[k])
                return true;
        return false;
    };
    this.elementAt = function(x)
    {
        while (this.beyong(x))
        {
            this.nextElement();
        }
        return this.nextElement();
    };
    this.hasSeparate = function(v)
    {
        for (let i = 0; i < this.numSeparates; i++)
        {
            for (let j = 0; j < this.separates[i].length; j++)
                if (v.indexOf(this.separates[i].charAt(j)) >= 0)
                    return true;
        }
        return false;
    };
    this.compose = function(v)
    {
        if (v == null)
            return v;
        if (this.hasSeparate(v))
            return this.quote + this.doubleQuote(v) + this.quote;
        return v;
    };

    this.doubleQuote = function(v)
    {
        let j = v.indexOf(this.quote);
        if (j == -1)
            return v;
        if (j == v.length - 1)
            return v + this.quote;
        return v.substring(0, j + 1) + this.quote + this.doubleQuote(v.substring(j + 1));

    };
    this.setStr = function(x, v, ifadd)
    {
        if (x == null || this.index == null || x.length != this.index.length || this.str == null)
        {
            return;
        }
        this.reset();
        while (this.beyong(x))
        {
            this.nextElement();
        }

        v = this.compose(v);
        if (ifadd == false)
        {
            let ll = this.previousOffset + 1;
            this.str = this.str.substring(0, ll) + v + this.str.substring(this.previousOffset);
        }
        else if (this.previousOffset > -1)
        {
            this.str = this.str.substring(0, this.previousOffset + 1) + v + this.separates[0].charAt(0) + this.str.substring(this.previousOffset + 1);
        }
        else
        {
            this.str = v + this.separates[0].charAt(0) + this.str;
        }
    };

    this.nextRow = function()
    {

        if (this.state == this.FILEEND || this.state == this.ERROR || this.str == null)
            return null;
        let v = new Array();
        do
        {
            v[v.length] = this.nextElement();
        }
        while (this.state == this.DIMENSIONEND[0]);

        return v;
    }
    this.nextMatrix = function(ignoreblank)
    {

        if (this.state == this.FILEEND || this.state == this.ERROR || this.str == null)
            return null;
        let v = new Array();
        do
        {
            let y = this.nextRow();
            if (y.length > 1 || y[0] != null && y[0] != '' || ignoreblank == null || ignoreblank == false)
                v[v.length] = y;

        }
        while (this.state == this.DIMENSIONEND[1]);
        return v;
    }
    this.tohtml = function()
    {
        let x = this.nextMatrix();
        let num = [];
        for (let j=0; j < x[0].length+10; j++)
        {
            num[j] = true;
            if (x.length < 2) num[j] = false;
            for (let i=1; i < x.length; i++)
            {
                if (j >= x[i].length) continue;
                if (x[i][j]!=null && x[i][j]!='' && isNaN(x[i][j]))
                {
                    num[j] = false; break;
                }
            }
        }
        let s = '<table border=1 style="border-collapse:collapse" >';
        for (let i = 0; i < x.length; i++)
        {
            s += "<tr height=28>";
            for (let j = 0; j < x[i].length; j++)
            {
                let sp=1; for (let k=j+sp; k < x[i].length && x[i][k] == null; k++,sp++);
                s += "<td " + (num[j]?"align=right ":"align=left ") + ((sp==1)?"":"colspan=" + sp) + ">" + x[i][j] + '</td>';
            }
            s += "</tr>";
        }
        return s + "</table>";
    }
}

 