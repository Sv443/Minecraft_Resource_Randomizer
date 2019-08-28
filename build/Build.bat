@echo off
cd ..

set PROJ_DIR=%~dp0


:start

echo.
echo Building Minecraft Resource Randomizer...
echo ^(This build script requires Node.js and npm to be installed^)
echo.
echo.

TIMEOUT 5

echo.
echo Downloading or updating dependencies...
echo.

REM making sure that all dependencies are either installed or up to date
call npm i --save

echo.
echo Done downloading or updating dependencies.
echo.
echo Building the executable file^(s^)...
echo.

REM actually building the executable file
call pkg src/index.js -o build/MinecraftResourceRandomizer.exe

echo.
echo.
echo.
echo.
echo.

IF %ERRORLEVEL% EQU 0 (
    echo Successfully built the executable file^(s^). It ^/ they should be located in the ^"build^" folder.
    echo.

    color 0a

    PAUSE

    EXIT
) ELSE (
    echo ERROR
    echo.
    echo Error while building the executable file^(s^). Please make sure Node.js and npm are installed and maybe try running this build script as administrator.
    echo Also make sure the assumed target that pkg chose above is corresponding to your Node.js version, operating system and processor architecture, ^for example: ^"node10-win-x64^" for Node.js version 10.x.x, Windows and a 64bit CPU.
    echo.
    echo Press a key to retry the build after making sure Node.js and npm are installed and working.
    echo Close the window with CTRL+C or the X in the title bar to abort the build process.

    REM windows beep sound:
    @echo 

    color 04

    PAUSE

    cls
    color 0f
    goto start
)