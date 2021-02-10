ssh pi@192.168.0.133 'sudo rm -rf ~/dash.parkergiven.com/* /var/www/dash.parkergiven.com/*'
scp -r build/ pi@192.168.0.133:~/dash.parkergiven.com
ssh pi@192.168.0.133 'sudo mv ~/dash.parkergiven.com/build/* /var/www/dash.parkergiven.com'