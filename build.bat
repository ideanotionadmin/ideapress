echo "start"

SET outputPath=c:\builds\ 

CALL "C:\Program Files (x86)\Microsoft Visual Studio 11.0\VC\vcvarsall.bat"
msbuild %2"MetroPress.sln" /p:Configuration=Release /p:Platform="Any CPU" /p:OutDir=%1
