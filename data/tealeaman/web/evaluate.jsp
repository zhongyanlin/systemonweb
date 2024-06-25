<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>

<% int orgnum = Toolbox.setcharset(request,response);%>
    if (orgnum == -1) return;
<script type="text/javascript" >
function allanswers()
{
  var s= '';
  var nr = window.frames[0].passNumRows();
  for (var i = 0; i < nr; i++)
  {
     var v = window.frames[0].retrv(i,2);
     if (v == null) 
     {
        validating == 'You have not chosen a answer for Question' + retrv(i,0);
        return;
     }
     s = s + v;
  }
  setv(0,1,s);
}
</script>

<jsp:include page="DataForm">
<jsp:param name="rdap"  value="evalform" />
<jsp:param name="subdb" value="" />
<jsp:param name="onsave"  value="79" />
<jsp:param name="courseid"  value="os" />
<jsp:param name="sessionname"  value="02" />
<jsp:param name="type"  value="1" />
<jsp:param name="semester" value="<%=Toolbox.dbadmin[orgnum%65536].currentSemester%>"  />
</jsp:include>

