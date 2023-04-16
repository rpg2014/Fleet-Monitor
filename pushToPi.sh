ssh pi@192.168.0.213 'sudo rm -rf ~/fleet.parkergiven.com/* /var/www/fleet.parkergiven.com/*'
scp -r build/* pi@192.168.0.213:~/fleet.parkergiven.com
ssh pi@192.168.0.213 'sudo mv ~/fleet.parkergiven.com/* /var/www/fleet.parkergiven.com'