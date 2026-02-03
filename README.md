
# To get around mixed content blocking
will need to give every pi a ssl cert?  put it in common directory in pi's for rocket to find?
can have the pi do the dns routing.  Will have to set up domain names in pi, and set up pi's to use pihole for dns, add that to the install script.  
then can get ssl certs from lets encrypt or aws, and put them on the pi's for rocket
or just unencrypted 


for temp sensor will need to use https://pyo3.rs/master/python_from_rust.html


# Vite + Deno + React + TypeScript

## Running

You need to have Deno v2.0.0 or later installed to run this repo.

Start a dev server:

```
$ deno task dev
```

## Deploy

Build production assets:

```
$ deno task build
```
then run `pushToPi.sh`or just rsync to Pi host
```
$ rsync -avz --delete ./dist/ pi@192.168.0.213:/var/www/fleet.parkergiven.com/
```
