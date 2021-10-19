@REM @ echo off
@ setlocal enabledelayedexpansion 
@ call set project=%~dp0
@ call set gitpath=D:\Burt\cocos_game\allgame\hotupdate\upgrade-server

@ call set mdate=%date%
@ call set mdate=%mdate: =%
@ call set mdate=%mdate:~10,4%
@ call set author=burt

@REM call set pinpai=%1
@REM call set huanjin=%2
@ call set pinpai=test
@ call set huanjin=dev

@ call set commitm=%author%-%pinpai%-%huanjin%-"hotupdate"-%mdate%
@ call set h=%time:~0,2%
@ call set h=%h: =0%
@ call set t=%date:~0,10%-%h%:%time:~3,2%%time:~5,3%
@ call set com=%commitm%-%t%

@REM call set upGameList=-g hall -g bcbm -g bjl -g brnn -g ddz -g ebg -g hbld -g hbsl -g hh -g hwby -g jbpby -g lhd -g lp -g pdk -g pccp -g qznn -g sgj -g sss -g zjh -g zrsx -g 21d -g ermj -g dzpk -g shaibao -g sbty -g cyqp -g cbzb -g ygxb -g szwg
@ call set upGameList=-g hall

@ call set argv=-h %huanjin% -p %pinpai% %upGameList%

@REM @ call cd %gitpath%
@REM @ call git pull

@ call cd %project%
@ call node 243update.js %argv%

@REM @ call cd %gitpath%
@REM @ call git add .
@REM @ call git commit -m %com%
@REM @ call git push

@REM @ call cd %gitpath%
@REM @ call git log -1>>temp.txt
@REM @ call set n=0
@REM @ call set gitcode=""
@REM @ call for /f "delims= tokens=* eol=" %%i in (temp.txt) do (
@REM 	set /a n=n+1
@REM 	if !n!==1 (
@REM 		set str=%%i
@REM 		set "str=!str:commit=!"
@REM 		set gitcode=!str!
@REM 		break
@REM 	)
@REM )
@REM @ call del temp.txt

@REM @ call cd %project%
@REM @ call node 243produceMail.js -c %gitcode% -h %huanjin% -p %pinpai%
@REM @ call clip < versiontemp.txt

@REM @ call cd %project%
@REM @ if exist %project%.git (
@REM 	call git add .
@REM 	call git commit -m %com%
@REM 	call git push
@REM )

pause

