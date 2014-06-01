#Westfield Lookbook prototype

Ingests a product collection + an array of product id's and generates an interactive image with hotspots to view which products are used in the photo

Currently uses an nginx proxy to handle the product service call, as product service does not support CORS


    upstream api_server {
      server 50.18.156.126;
    }


    server {
      server_name lookbook.local, 10.80.32.225;

      location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_redirect off;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }

      location /api/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://api_server;
        proxy_ssl_session_reuse off;
        proxy_set_header Host 'api.westfieldlabs.com';
        proxy_redirect off;
      }

    }


