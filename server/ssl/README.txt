linux下生成签名:
    openssl genrsa -out privatekey.pem 1024
    openssl req -new -key privatekey.pem -out certrequest.csr 
    openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
    参考资料: http://blog.fens.me/nodejs-https-server/
