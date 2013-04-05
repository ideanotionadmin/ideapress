echo "start cert"

CALL "C:\Program Files (x86)\Microsoft Visual Studio 11.0\VC\vcvarsall.bat"

Certutil -delStore TrustedPeople c:\builds\key\AppFactory.cer
MakeCert /n "%1=%2" /r /h 0 /eku "1.3.6.1.5.5.7.3.3,1.3.6.1.4.1.311.10.3.13" /e 01/01/2020 /sv c:\builds\key\AppFactory.pvk c:\builds\key\AppFactory.cer
Certutil -addStore TrustedPeople c:\builds\key\AppFactory.cer
Pvk2Pfx /f /pvk c:\builds\key\AppFactory.pvk /spc c:\builds\key\AppFactory.cer /pfx c:\builds\key\IdeaPress.pfx

copy c:\builds\key\IdeaPress.pfx c:\builds\template\af.2.0.7\IdeaPress\IdeaPress.pfx