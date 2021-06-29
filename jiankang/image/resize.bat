setlocal enableextensions enabledelayedexpansion
set /a COUNTER =1
for /f %%i in ('dir /b *.jpg') do ( call  C:\project\tealeaman\web\image\convert.exe %%i -resize 400x cell!COUNTER!.jpg
set /a COUNTER =COUNTER+1)
endlocal


 