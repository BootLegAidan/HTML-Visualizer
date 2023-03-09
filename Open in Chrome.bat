pushd "%~dp0"
start chrome --user-data-dir="C:/Chrome dev session" --disable-web-security %~dp0Visualizer\visualize.html
pause
