/*
 * Decompiled with CFR 0_87.
 * 
 * Could not load the following classes:
 *  javax.mail.Authenticator
 *  javax.mail.PasswordAuthentication
 */
package telaman;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
 
class SMTPAuthen extends Authenticator {
    SMTPAuthen(int orgnum) 
    {
        this.orgnum = orgnum;
    }
    int orgnum;
    public PasswordAuthentication getPasswordAuthentication() {
     
        return new PasswordAuthentication(Toolbox.dbadmin[orgnum%65536].stmpuser, Toolbox.dbadmin[orgnum%65536].stmppass);
    }
}
