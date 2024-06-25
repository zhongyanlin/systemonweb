 

package telaman;
 

import java.math.BigInteger;
import java.security.SecureRandom;
 
class BigExtendedEuclid 
{
	// We Want to obtain the gcd(a,b)
	//                          a			 b				0			 1				1			 0
	public BigInteger[] EE(BigInteger a, BigInteger b, BigInteger c, BigInteger d, BigInteger e, BigInteger f)
	{
		if (b.compareTo(BigInteger.ZERO)==0)
		{
			BigInteger[] ret  = {BigInteger.ZERO, BigInteger.ZERO, BigInteger.ZERO};
			ret[0] = a; // gcd(a,b)
			ret[1] = e; // coefficient of a
			ret[2] = f; // coefficient of b
			return ret; 
		}
		else
		{
			return  EE(b, a.mod(b), e.subtract((a.divide(b)).multiply(c)), f.subtract((a.divide(b)).multiply(d)), c, d);
		}
	}
}

class MillerRabin 
{
	public int primeT(BigInteger pval)
	{
		BigInteger [] qandm = getqm(pval);
		BigInteger qval =qandm[0];
		BigInteger neg = new BigInteger("-1");
		if (qval.compareTo(neg)==0)return 0;

		SecureRandom r = new SecureRandom();
		BigInteger bval = new BigInteger(pval.bitLength(),r);
		
		
		BigInteger mval =qandm[1];
		BigInteger two = new BigInteger("2");
		
		BigInteger pminusone = pval.subtract(BigInteger.ONE);

			
		if (bval.modPow(mval,pval).compareTo(BigInteger.ONE)==0)return 1;
		BigInteger j = BigInteger.ZERO;
		BigInteger indexval = mval;
		while (j.compareTo(qval)<0)
		{
			if (pminusone.compareTo(bval.modPow(indexval,pval))==0)return 1;
			indexval = indexval.multiply(two);
			j = j.add(BigInteger.ONE);			
		}
		return 0;
	}

	public BigInteger createPrime(int bitlength, int numTests)
	{
		SecureRandom r = new SecureRandom();
		BigInteger p = new BigInteger(bitlength,r);
		int h = 0;

		while(h < numTests)
		{
			if(primeT(p)==0)break;
			else h++;
		}
		if(h==numTests)return p;
		else return createPrime(bitlength, numTests);
	}

	public BigInteger [] getqm(BigInteger p)
	{
		p = p.subtract(BigInteger.ONE);
		BigInteger two = new BigInteger("2");
		BigInteger neg = new BigInteger("-1");
		BigInteger [] rt ={BigInteger.ZERO, BigInteger.ZERO}; // rt = {q, m}
		if (p.mod(two).compareTo(BigInteger.ZERO) != 0)
		{
			rt[0] = neg; rt[1] = neg;
			return rt;
		}
		BigInteger divisor = p.divide(two);
		BigInteger counter = BigInteger.ONE;
		//double maxq = (Math.log(p))/(Math.log(2));
		while ( divisor.mod(two).compareTo(BigInteger.ZERO)==0)
		{
			counter = counter.add(BigInteger.ONE);
			divisor = divisor.divide(two);
		}
		rt[0] = counter; rt[1] = divisor;
		return rt;
	}
}
 
public class MyRSA
{
    public void init()
   {

        MillerRabin test = new MillerRabin();
        P = test.createPrime(bitlen/2, 100);
        Q = test.createPrime(bitlen/2, 100);

        // P and Q must not be equal
        while(P.compareTo(Q) == 0)
        {
            Q = test.createPrime(bitlen/2, 100);
        }

        N = P.multiply(Q);

        csize = 1; 
        String tt0 = "FFFF"; 
        if (charsize==1) tt0 ="FF";
        String tt = tt0;
        BigInteger yy= new BigInteger(tt,16);
        while (yy.compareTo(N) <= 0) 
        {
            tt += tt0; csize++;
            yy = new BigInteger(tt,16);
        }
        csize--;

        M = (P.subtract(BigInteger.ONE)).multiply(Q.subtract(BigInteger.ONE));

        E = new BigInteger("3");
        while(M.gcd(E).intValue() > 1)
        {
            E = E.add(new BigInteger("2"));
        }

        BigExtendedEuclid ee = new BigExtendedEuclid();
        BigInteger [] arra = ee.EE(E, M, BigInteger.ZERO, BigInteger.ONE, BigInteger.ONE, BigInteger.ZERO);
        D = arra[1];
        while (D.compareTo(BigInteger.ZERO)<0)
        {
            D = D.add(M);
        }

   }
   public static void main(String[] args)
   {
       BigInteger big = new BigInteger("1111222");
       MyRSA myrsa = new MyRSA(128,(byte)1);
       myrsa.init();
       BigInteger en = myrsa.encryptInt(big);
       BigInteger de = myrsa.decryptInt(en);
        if (big.compareTo(de) == 0) Toolbox.println(0,"Success!");
         else  Toolbox.println(0,"Not Equal");

       String x = "??";
       String y = myrsa.encryptString(x,1);
        Toolbox.println(0,"y==" + y);
       String z = myrsa.decryptString(y,1);
       if (x.equals(z))  Toolbox.println(0,"Equal");
   }
   private  BigInteger N, D, E, P, Q, M;
   int bitlen = 128;
   public  byte charsize = 2; 
   public int csize = 0;
		// First task is to find P and Q : Primes with a specifies bit length
    public MyRSA(int bl, byte charz) 
    {
        this.bitlen = bl;
        charsize = charz; 
        this.init();
    }

    public void setBitLeng(int bl) 
    {
        this.bitlen = bl;
        this.init();
    }
    public MyRSA(){}
    public MyRSA(byte c){ charsize = c;}
    public MyRSA(String numberstring,byte c) 
    {
        charsize = c;
        String x[] = numberstring.split(",");
        N = new BigInteger(x[0]);
        D = new BigInteger(x[1]);
        E = new BigInteger(x[2]);
        P = new BigInteger(x[3]);
        Q = new BigInteger(x[4]);
        M = new BigInteger(x[5]);
        bitlen = Integer.parseInt(x[6]);
        csize = Integer.parseInt(x[7]);
        
    }
    public String toString()
    {
         return "" +  N + "," + D + "," + E + "," + P + "," +  Q + "," + M + "," + bitlen + ","  + csize;
    }
    
    public String toPublicString()
    {
        return "" +  N + "," + 0 + "," + E + "," + 0 + "," +  0 + "," + 0 + "," + 0 + ","  + csize;
    }
       
       public String publickey()
       {
           return  E.toString(16) +"," + N.toString(16) +"," + csize;
       }
        
       public BigInteger encryptInt(BigInteger big)
       {
            
           // Encryption process: en = big^{E} mod N
	   BigInteger en = big.modPow(E, N);
	   
           return en;
       }
	 	
		//BigInteger big = new BigInteger("1233333333");//Console.readString());

	 public BigInteger decryptInt(BigInteger en)	
         {
		// Decryption process: de = en^{D} mod N
		BigInteger de = en.modPow(D, N);
		
                return de;
         }
private static final int [] reorder = {13,5,8,10,2,3,15,0,7,4,1,11,6,9,14,12};
private  static final int [] zxorder = {7,10,4,5,9,1,12,8,2,13,3,10,15,0,14,6};
private static char swapc(char hexdigit, boolean forward)
{
    int i = hexdigit - 48; 
    if (i>9) i = hexdigit - 65; 
    if (forward) 
        i = reorder[i]; 
    else i = zxorder[i];
    return allhexdigits[i];
} 
static  String myencode(String z)
{
    return z;  
}


         
public static String  encryptString0(String s,int encodingorder)
{
      /*  int j = s.indexOf(":");
        if (j >=0 && j < 15)
        {
            if (j==s.length()-1)
                 return s;
            return s.substring(0,j) + ":" + encryptString0(s.substring(j+1), encodingorder);
        }*/
        if (s==null||s.equals("")) return s;
        boolean recode = !Toolbox.encodings[encodingorder].equals("utf-8"); 
        if (recode)
            try{s = new String(s.getBytes(),Toolbox.encodings[encodingorder]);}catch(Exception e){}
        int l = s.length(); 
        String t;
        String result = ""; 
        for (int i=0; i < l; i++ )
        {
            result  +=  char20hex(s.charAt(i), encodingorder)  ;
          //  if (i>0&&i%7==0) result+= " ";
        }
        return result;
} 

public String  encryptString(String s,int encodingorder)
{
       
        if (csize==0 || s==null||s.equals("")) return s;
        boolean recode = !Toolbox.encodings[encodingorder].equals("utf-8"); 
        if (recode)
            try{s = new String(s.getBytes(),Toolbox.encodings[encodingorder]);}catch(Exception e){}
        int l = s.length()/csize; 
        if (s.length()%csize!=0) l++;
        String t;
        String result = "";
        for (int i=0; i < l; i++ )
        {
            if (i<l-1)
             t = s.substring(i*csize,(i+1)*csize);
            else
            {
                t = s.substring(i*csize);
            }
            String x = "";
            for (int j=0; j < t.length(); j++)
            {
                x += char2hex(t.charAt(j),Toolbox.locales[encodingorder].charsize);
            }
            
            BigInteger z = encryptInt(new BigInteger(x,16));
            
            result += z.toString(16);
            if (i<l-1) result += " ";
        }

	return result;
}
public static String  encryptString(String s, User c, int encodingorder)
{
    if (c==null||c.keys==null||c.equals(""))
            return s; 
    return encryptString(  s,  c.keys, encodingorder);
}
public static String  encryptString(String s, String ckeys, int encodingorder)
{
        if (  ckeys==null||ckeys.equals("")||s==null||s.equals(""))
            return s;
        boolean recode = !Toolbox.encodings[encodingorder].equals("utf-8"); 
        if (recode)
            try{s = new String(s.getBytes(),Toolbox.encodings[encodingorder]);}catch(Exception e){}

        String []enc = ckeys.split(",");
        if (enc.length<3)return s;
        BigInteger E = new BigInteger(enc[0],16);
        BigInteger N = new BigInteger(enc[1],16);
        int csize = 0;
        try{csize = Integer.parseInt(enc[2]);}catch(Exception e){return s;}
        if ( csize==0  )return s;
        int l = s.length()/csize; 
        if (s.length()%csize!=0) l++;
        String t;
        String result = "";
        for (int i=0; i < l; i++ )
        {
            if (i<l-1)
             t = s.substring(i*csize,(i+1)*csize);
            else
            {
                t = s.substring(i*csize);
            }
            String x = "";

            for (int j=0; j < t.length(); j++)
            {
                x += char2hex(t.charAt(j),encodingorder); 
            }
             
            if (!x.equals("")) 
            {
               BigInteger z =  new BigInteger(x,16);
               z = z.modPow(E, N);
               result += z.toString(16);
               if (i<l-1) result += " "; 
            }
            else result=result.replaceFirst(" $","");
        }

	return result;
}
static char allhexdigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                          'a', 'b', 'c', 'd', 'e', 'f'};
char hex2char(String x)
{
    int b4 = Integer.parseInt(x,16);
    char z = (char)(b4);

    return z;
}
static String char2hex(char z, int encodingorder)
{   
   int y = (int)z; 
   if (Toolbox.locales[encodingorder].charsize==2){
   char x[] = {'0','0','0','0'};
   int w =  (y>>12); y = y & 4095; x[0] = allhexdigits[w]; 
       w =  (y>>8);  y = y & 255; x[1] = allhexdigits[w];
       w =  (y>>4);  y = y & 15; x[2] = allhexdigits[w];
   x[3] = allhexdigits[y]; 
   return new String(x);
   }
   char x[] = {'0','0'};
   int w =  (y>>4);  y = y & 15; x[0] = allhexdigits[w];
   x[1] = allhexdigits[y]; 
   return new String(x);
}
static String char20hex(char z,int encodingorder)
{   
   int y = (int)z; 
   if (Toolbox.locales[encodingorder].charsize==2){
   char x[] = {'0','0','0','0'};
   int w =  (y>>12); y = y & 4095; x[2] = allhexdigits[w]; 
       w =  (y>>8);  y = y & 255; x[0] = allhexdigits[w];
       w =  (y>>4);  y = y & 15; x[3] = allhexdigits[w];
   x[1] = allhexdigits[y]; 
   return new String(x);
   }
   char x[] = {'0','0'};
   int w =  (y>>4);  y = y & 15; x[1] = allhexdigits[w];
   x[0] = allhexdigits[y]; 
   return new String(x);
}
 
public String decryptString(String s, int encodingorder)
{
   
        if (s==null) return null;
        else if (s.equals(""))return "";
	String [] blocks = s.split(" ");
	String result = "";
	int i, j;
   String block; boolean tailsemi = false;
	for (i = 0; i < blocks.length; i++) 
   {
 
            try{
	         BigInteger bi = new BigInteger(blocks[i], 16);
            BigInteger x = decryptInt(bi);
            String z = x.toString(16);
            j = z.length()%(2*charsize);
            int k =0;
            if (j==0) j = (2*charsize);
            while (j<=z.length())
            {
                result += hex2char(z.substring(k,j));
                k=j;
                j+=(2*charsize);  
            }
            
            }catch(Exception e){ return null;}

	}
   boolean recode = !Toolbox.encodings[encodingorder].equals("utf-8"); 
   if (recode)
       try{result = new String(result.getBytes(Toolbox.encodings[encodingorder]));}catch(Exception e){}

	return result;
}
}
