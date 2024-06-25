echo off
set /p dest=enter the path t oa folder that will contain tealeaman: 
set dest=%dest%\tealeaman
echo %dest%
if not exist %dest% (
   mkdir %dest% 
)

if not exist %dest%\copysource.bat (
   copy copysource.bat %dest%\.
)

set webf=%dest%\web
set webs=%dest%\src
set webj=%dest%\src\java
set webt=%dest%\src\java\telaman
set webW=%dest%\web\WEB-INF
set webc=%dest%\web\WEB-INF\conf

if not exist %webf% (
   mkdir %webf% 
)
if not exist %webs% (
   mkdir %webs% 
)
if not exist %webW% (
   mkdir %webW% 
)
if not exist %webc% (
   mkdir %webc% 
)

if not exist %webj% (
   mkdir %webj% 
)
if not exist %webt% (
   mkdir %webt% 
)

copy /Y web\*.js* %webf%\.
copy /Y src\java\telaman\*.java %webt%\.
copy /Y web\WEB-INF\conf\*.txt %webc%\.
copy /Y web\WEB-INF\conf\*.html %webc%\.
copy /Y web\WEB-INF\conf\*.csv %webc%\. 



  
