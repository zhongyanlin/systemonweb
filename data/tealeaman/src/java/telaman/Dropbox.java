/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;

import com.dropbox.core.DbxAccountInfo;
import com.dropbox.core.DbxAppInfo;
import com.dropbox.core.DbxClient;
import com.dropbox.core.DbxEntry;
import com.dropbox.core.DbxException;
import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.DbxWebAuthNoRedirect;
import com.dropbox.core.DbxWriteMode;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

/**
 *
 * @author zhong
 */
public class Dropbox   
{
    //private static final String DROP_BOX_APP_KEY = "1wqbfdn2n9ccgr6";
	//private static final String DROP_BOX_APP_SECRET = "guowr7tsoeonypt";
    DbxClient dbxClient;
    String yourname = "";
    public Dropbox (String dropBoxAppKey, String dropBoxAppSecret,String authAccessToken) throws  IOException, DbxException 
    {
        dbxClient  = new DbxClient(new DbxRequestConfig("JavaDropboxTutorial/1.0", Locale.getDefault().toString()), authAccessToken);
        yourname = dbxClient.getAccountInfo().displayName; 
        
       /* DbxAppInfo dbxAppInfo = new DbxAppInfo(dropBoxAppKey, dropBoxAppSecret);
		DbxRequestConfig dbxRequestConfig = new DbxRequestConfig(
				"JavaDropboxTutorial/1.0", Locale.getDefault().toString());*/
    }
    /*
	DbxClient dbxClient;

	public DbxClient authDropbox(String dropBoxAppKey, String dropBoxAppSecret,String authAccessToken)
			throws IOException, DbxException {
		DbxAppInfo dbxAppInfo = new DbxAppInfo(dropBoxAppKey, dropBoxAppSecret);
		DbxRequestConfig dbxRequestConfig = new DbxRequestConfig(
				"JavaDropboxTutorial/1.0", Locale.getDefault().toString());
		DbxWebAuthNoRedirect dbxWebAuthNoRedirect = new DbxWebAuthNoRedirect(
				dbxRequestConfig, dbxAppInfo);
		String authorizeUrl = dbxWebAuthNoRedirect.start();
		System.out.println("1. Authorize: Go to URL and click Allow : "
				+ authorizeUrl);
		System.out
				.println("2. Auth Code: Copy authorization code and input here ");
		String dropboxAuthCode = "YE_tny6FlugAAAAAAAAAJMrMTXRdLztT2CvPkghqPq8";
            //    new BufferedReader(new InputStreamReader( System.in)).readLine().trim();
		//DbxAuthFinish authFinish = dbxWebAuthNoRedirect.finish(dropboxAuthCode);
		//String authAccessToken = authFinish.accessToken;
        //String authAccessToken = "YE_tny6FlugAAAAAAAAAI-XwOABIlxN3ZgKdpeKFphNnA0jCaYQf9hbEVAPNuS-N";
		dbxClient = new DbxClient(dbxRequestConfig, authAccessToken);
		System.out.println("Dropbox Account Name: "
				+ dbxClient.getAccountInfo().displayName);

		return dbxClient;
	}
    */
    
	/* returns Dropbox size in GB */
	public long getDropboxSize() throws DbxException {
		long dropboxSize = 0;
		DbxAccountInfo dbxAccountInfo =  dbxClient.getAccountInfo();
		// in GB :)
		dropboxSize = dbxAccountInfo.quota.total / 1024 / 1024 / 1024;
		return dropboxSize;
	}

	public String uploadToDropbox(String  pathhere, String paththere)  
    {
         String sharedUrl = null;
         FileInputStream fis = null;
        try
        {
		    File inputFile = new File(pathhere);
            fis = new FileInputStream(inputFile);
		 
            paththere = paththere.replaceFirst("^/", "").replaceFirst("/$", "");
		    
			DbxEntry.File uploadedFile =  dbxClient.uploadFile("/" + paththere + "/" +  inputFile.getName(),
					DbxWriteMode.add(), inputFile.length(), fis);
			sharedUrl = dbxClient.createShareableUrl("/" + paththere + "/" +  inputFile.getName());
			 
		} 
        catch (DbxException e){}
        catch(IOException e1){}
        finally 
        {
			try{ if (fis!=null) fis.close();} catch(IOException e1){}
		}
        return sharedUrl;
	}

	public void createFolder1(String folderName) throws DbxException {
		 dbxClient.createFolder("/" + folderName);
	}

	public void listDropboxFolders(String folderPath, java.util.Vector<String> v) throws DbxException {
		DbxEntry.WithChildren listing =  dbxClient.getMetadataWithChildren(folderPath);
		 
		for (DbxEntry child : listing.children) {
			v.addElement( child.name + ": " + child.toString());
		}
	}

	public boolean downloadFromDropbox(String paththere, String pathhere) throws DbxException,
			IOException {
        boolean j = false;
        paththere = paththere.replaceFirst("^/", "").replaceFirst("/$", "");
		FileOutputStream outputStream = new FileOutputStream(pathhere);
		try 
        {
			DbxEntry.File downloadedFile =  dbxClient.getFile("/" + paththere, null, outputStream);
            j = true;
		} 
        catch(Exception e){}
        finally {
			outputStream.close();
		}
        return true;
	}
    
	public static void main(String[] args) throws IOException, DbxException {
		 Dropbox javaDropbox = new  Dropbox("1wqbfdn2n9ccgr6", "guowr7tsoeonypt","YE_tny6FlugAAAAAAAAAI-XwOABIlxN3ZgKdpeKFphNnA0jCaYQf9hbEVAPNuS-N");
		 
		System.out.println("Dropbox Size: " + javaDropbox.getDropboxSize()
				+ " GB");
      
		javaDropbox.uploadToDropbox("qq.png", "");
		javaDropbox.createFolder1("tealeaman");
        java.util.Vector<String> v = new  java.util.Vector<String>();
		javaDropbox.listDropboxFolders("/",v);
		javaDropbox.downloadFromDropbox("qq.png", "qq1.png");
	}
    public static String puttime(int orgnum, String uid,   String lastbackup, String backupperiod)
    {
           
         String sql1 = "";
          
          String sql2 = "";
          if (lastbackup!=null &&  backupperiod!=null)
          {
              sql1 = "INSERT INTO Userkeys(lastupdate, uid, dropboxappkey, dropboxappsecret,dropboxtoken, lastbackup, backupperiod) VALUES("
                 + (System.currentTimeMillis()/1000) + ",'" + uid.replaceAll("'","''") + "','" 
                 +   "','"
                 +   "','"
                 + lastbackup.replaceAll("'","''") + "','"
                 + backupperiod.replaceAll("'","''")+ "')";
         sql2 =  "UPDATE Userkeys SET lastupdate=" +  (System.currentTimeMillis()/1000) +", lastbackup=" 
                 + lastbackup + ",backupperiod=" + backupperiod
                 + "  WHERE uid='" + uid.replaceAll("'","''") + "'";
          }
          else   if (lastbackup!=null  ){
         sql2 =  "UPDATE Userkeys SET lastupdate=" +  (System.currentTimeMillis()/1000) +", lastbackup=" 
                 + lastbackup + "   WHERE uid='" + uid.replaceAll("'","''") + "'";
          } else  if (backupperiod!=null  ) {
         sql2 =  "UPDATE Userkeys SET lastupdate=" +  (System.currentTimeMillis()/1000) +" backupperiod=" + backupperiod
                 + "  WHERE uid='" + uid.replaceAll("'","''") + "'";
          }
          else
          {
               sql2 =  "UPDATE Userkeys SET lastupdate=" +  (System.currentTimeMillis()/1000) +" backupperiod=NULL,lastbackup=NULL  WHERE uid='" + uid.replaceAll("'","''") + "'";
          }
      
         JDBCAdapter adapter =  Toolbox.getSysAdapter(orgnum);
         if (1!=adapter.executeUpdate(sql1))
             adapter.executeUpdate(sql2);
         adapter.close();
         return adapter.error();
    }
     
    public static String putkeys(int orgnum, String uid, String dropboxappkey, String dropboxappsecret, String dropboxtoken )
    {
          try{
           
             dropboxappkey = Toolbox.decrypt(dropboxappkey,orgnum);
             
             dropboxappsecret = Toolbox.decrypt(dropboxappsecret,orgnum);
          
             dropboxtoken = Toolbox.decrypt(dropboxtoken,orgnum);
           
             Dropbox dp = new Dropbox( (dropboxappkey), (dropboxappsecret), (dropboxtoken));
             dp.createFolder1("tealeaman");
             }catch(Exception e){return e.toString();}
              int encodingorder = 0;
             while (encodingorder < Toolbox.langs.length)
                 if (Toolbox.encodings[encodingorder].equals("utf-8")) break;
                 else encodingorder++;
             if (encodingorder== Toolbox.langs.length)  encodingorder = Toolbox.langnum;
             dropboxappkey = Toolbox.initrsa.encryptString(dropboxappkey,encodingorder);
             dropboxappsecret = Toolbox.initrsa.encryptString(dropboxappsecret,encodingorder);
             dropboxtoken = Toolbox.initrsa.encryptString(dropboxtoken,encodingorder);
              
         String sql1 = "INSERT INTO Userkeys(lastupdate, uid, dropboxappkey, dropboxappsecret,dropboxtoken,lastbackup,backupperiod ) VALUES("
                 + (System.currentTimeMillis()/1000) + ",'" + uid.replaceAll("'","''") + "','" 
                 + dropboxappkey.replaceAll("'","''") + "','"
                 + dropboxappsecret.replaceAll("'","''") + "','"
                 + dropboxtoken.replaceAll("'","''") 
                 +"',-1,-1)";
         String sql2 = "UPDATE Userkeys SET lastupdate=" +  (System.currentTimeMillis()/1000) +", dropboxappkey='" 
                 + dropboxappkey.replaceAll("'","''") + "',dropboxappsecret='" + dropboxappsecret.replaceAll("'","''")
                 + "',dropboxtoken='" + dropboxtoken.replaceAll("'","''") + "' WHERE uid='" + uid.replaceAll("'","''") + "'";
         JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
         int n = 0;
         if (1!=(n=adapter.executeUpdate(sql1)))
         {
          
             n = adapter.executeUpdate(sql2);
         }
     
         adapter.close();
         return n+adapter.error();
    }
    public static String uploadFile(int orgnum, String uid, String pathhere )
    {
       
         String err = Toolbox.emsgs(orgnum,71);
         JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
         String sql = "SELECT dropboxappkey,dropboxappsecret,dropboxtoken FROM Userkeys WHERE uid='" + uid.replaceAll("'","''") + "'";
         int n = 0;
         boolean b = adapter.executeQuery2(sql,false);
        
         if (b && adapter.getValueAt(0, 0) != null) 
         {
             int encodingorder = 0;
             while (encodingorder < Toolbox.langs.length)
                 if (Toolbox.encodings[encodingorder].equals("utf-8")) break;
                 else encodingorder++;
             if (encodingorder== Toolbox.langs.length)  encodingorder = Toolbox.langnum;
             String dropboxappkey = Toolbox.initrsa.decryptString(adapter.getValueAt(0,0),encodingorder );
             String dropboxappsecret =Toolbox.initrsa.decryptString(adapter.getValueAt(0,1),encodingorder ); 
             String dropboxtoken = Toolbox.initrsa.decryptString(adapter.getValueAt(0,2),encodingorder );
             try
             {
                Dropbox dp = new Dropbox(dropboxappkey,dropboxappsecret,dropboxtoken);
                dp.uploadToDropbox(pathhere, "tealeaman");
             }catch(Exception e){ err = e.toString();}
         }
         else err = "No dropbox " + Toolbox.emsgs(orgnum,1363);
         adapter.close();
         return err;
    }
    public static String downloadFiles(int orgnum, String uid, long start, long end, String userdir, String fold,   String [] f )
    {
        
         String err = "";
         String files = "";
         Vector<String> v = new Vector<String>();
         JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
         String sql = "SELECT dropboxappkey,dropboxappsecret,dropboxtoken FROM Userkeys WHERE uid='" + uid.replaceAll("'","''") + "'";
         int n = 0;
         boolean b = adapter.executeQuery2(sql,false);
         if (b && adapter.getValueAt(0,0)!=null) 
         {
             int encodingorder = 0;
             while (encodingorder < Toolbox.langs.length)
                 if (Toolbox.encodings[encodingorder].equals("utf-8")) break;
                 else encodingorder++;
             if (encodingorder== Toolbox.langs.length)  encodingorder = Toolbox.langnum;
             String dropboxappkey = Toolbox.initrsa.decryptString(adapter.getValueAt(0,0),encodingorder );
             String dropboxappsecret = Toolbox.initrsa.decryptString(adapter.getValueAt(0,1) ,encodingorder);  
             String dropboxtoken = Toolbox.initrsa.decryptString(adapter.getValueAt(0,2) ,encodingorder);
             try{
             Dropbox dp = new Dropbox(dropboxappkey,dropboxappsecret,dropboxtoken);
             
             dp.listDropboxFolders("/tealeaman",v);
             for (int i=0; i < v.size(); i++)
             {
                 String fn = v.elementAt(i).replaceFirst(":.*", "");
                 
                 if (fn.matches(f[0] + "[0-9]+.zip")==false) continue;
                 long t = 1000* Toolbox.parseTime( fn.replaceAll("[^0-9]","").replaceFirst("([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]).*", "$1"), "YYYYMMDD");
                 if ( start < t && t <= end)
                 {
                     if (dp.downloadFromDropbox("tealeaman/"+fn, userdir + File.separator +  fold + File.separator + fn))
                     {
                          if (!files.equals("")) files += ";";
                          files += fold + File.separator + fn;
                           
                     }
                     
                 }
             }
            
             }catch(Exception e){ err = e.toString();}
         }
         else err = "no drop account";
         adapter.close();
         f[0] = err;
         return files;
    }
    public static String listFiles(int orgnum,  String uid,Vector<String>v )
    {
         String err = "";
         JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
         String sql = "SELECT dropboxappkey,dropboxappsecret,dropboxtoken FROM Userkeys WHERE uid='" + uid.replaceAll("'","''") + "'";
         int n = 0;
         boolean b = adapter.executeQuery2(sql,false);
         if (b && adapter.getValueAt(0,0) !=null) 
         {
             int encodingorder = 0;
             while (encodingorder < Toolbox.langs.length)
                 if (Toolbox.encodings[encodingorder].equals("utf-8")) break;
                 else encodingorder++;
             if (encodingorder== Toolbox.langs.length)  encodingorder = Toolbox.langnum;
             String dropboxappkey = Toolbox.initrsa.decryptString(adapter.getValueAt(0,0),encodingorder );
             String dropboxappsecret = Toolbox.initrsa.decryptString(adapter.getValueAt(0,1),encodingorder );  
             String dropboxtoken = Toolbox.initrsa.decryptString(adapter.getValueAt(0,2),encodingorder );
             try{
             Dropbox dp = new Dropbox(dropboxappkey,dropboxappsecret,dropboxtoken);
             dp.listDropboxFolders("/tealeaman",v);
             }catch(Exception e){ err = e.toString();}
         }
         else err = "no drop account";
         adapter.close();
         return err;
    }
    
    
}
