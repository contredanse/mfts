# Nginx

## SSL

### Install certbot for nginx

```shell
$ sudo add-apt-repository ppa:certbot/certbot && sudo apt update
$ sudo apt-get install python-certbot-nginx
```

### Creating certificate

```shell
$ sudo certbot --nginx -d example.com -d www.example.com
```

### Verify autorenewal

```shell
$ sudo certbot renew --dry-run
```

## Nginx example config

Important things:

*   redirect http to https
*   http2
*   gzip_static on (built js and css provides a static .gz version)

```apacheconfig
server {
    root /var/www/<PATH>/public_html;
    server_name <SERVER_NAME>;

    index index.html;

    gzip on;
    gzip_static on;
    gzip_vary on;

    index index.html;

    charset utf-8;

    gzip on;
    gzip_static on;
    gzip_vary on;

    location / {
	   try_files $uri /index.html;		
    }

    location = /index.html {
        internal;	
        add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        expires off;
        proxy_no_cache 1;
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }
       
    # Do not cache service-worker.js, required for offline-first updates.
    location ~* (service-worker\.js)$ {
      add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
      proxy_no_cache 1; 
      proxy_cache_bypass $http_pragma;
      proxy_cache_revalidate on;
      expires off;
      access_log off;
    }

    location ~* ^/assets/ {
	
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            #
            # Custom headers and headers various browsers *should* be OK with but aren't
            #
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
            #
            # Tell client that this pre-flight info is valid for 20 days
            #
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        if ($request_method = 'POST') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
            add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
        }
        if ($request_method = 'GET') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
            add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
        }

    }
	
    location ~* ^/assets/.+\.(jpg|mp4|webm|png|mp3|svg|woff2|woff|webp)$ {
        add_header Cache-Control public;
        expires 1d;
    }

    location ~* ^/assets/.+\.(vtt|srt)$ {
        add_header Cache-Control public;
        expires 1h;
    }

    location ~* ^/static/.+\.(woff|woff2|png|jpg|svg)$ {
        etag off;		
        add_header Cache-Control public;
        expires 365d;
    }
    
    location ~* ^/static/.+\.(js|css)$ {
        etag off;		
        gzip_static on;
        add_header Cache-Control public;
        expires 365d;
    }

    ##
    # If you want to use Node/Rails/etc. API server
    # on the same port (443) config Nginx as a reverse proxy.
    # For security reasons use a firewall like ufw in Ubuntu
    # and deny port 3000/tcp.
    ##
    
    # location /api/ {
    #
    #   proxy_pass http://localhost:3000;
    #   proxy_http_version 1.1;
    #   proxy_set_header X-Forwarded-Proto https;
    #   proxy_set_header Upgrade $http_upgrade;
    #   proxy_set_header Connection 'upgrade';
    #   proxy_set_header Host $host;
    #   proxy_cache_bypass $http_upgrade;
    #
    # }


    ## Begin - PHP
    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #

    #location ~ \.php$ {
    #    try_files $uri =404;
    #    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    #    fastcgi_pass unix:/var/run/php7.2-fpm.<SITE>.sock;
    #    fastcgi_index index.php;
    #    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    #    include fastcgi_params;
    #}
    ## End - PHP
     
   
    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    location ~ /\.ht {
    	deny all;
    }

    ## Begin - Security
    # deny all direct access for these folders
    location ~* /(.git|cache|bin|logs|backups)/.*$ { return 403; }
    # deny running scripts inside core system folders
    location ~* /(system|vendor)/.*\.(txt|xml|md|html|yaml|php|pl|py|cgi|twig|sh|bat)$ { return 403; }
    # deny running scripts inside user folder
    location ~* /user/.*\.(txt|md|yaml|php|pl|py|cgi|twig|sh|bat)$ { return 403; }
    # deny access to specific files in the root folder
    location ~ /(LICENSE|yarn.lock|npm.lock|composer.lock|composer.json|nginx.conf|web.config|htaccess.txt|\.htaccess) { return 403; }
    ## End - Security

    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/<PATH>/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/<PATH>/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    access_log /var/log/nginx/<SERVER_NAME>.access.log;
    error_log /var/log/nginx/<SERVER_NAME>.error.log;
       

}
server {
    if ($host = <SERVER_NAME>) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name <SERVER_NAME>;
    return 404; # managed by Certbot
}
```

# Fix mimetypes

Be sure you have `.vtt` mime type in `/etc/nginx/mime.types`, as an example:

```
    text/html                             html htm shtml;
    text/css                              css;
    text/xml                              xml;
    text/vtt                              vtt;

```


