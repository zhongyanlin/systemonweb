setlocal enableextensions enabledelayedexpansion
set /a COUNTER =1
for /f %%i in ('dir /b *.jpg') do ( ren %%i !COUNTER!.jpg
rem for /f %%i in ('dir /b *.jpg') do ( call  C:\project\tealeaman\web\image\convert.exe %%i -resize 800x !COUNTER!.jpg
set /a COUNTER =COUNTER+1)
endlocal


 