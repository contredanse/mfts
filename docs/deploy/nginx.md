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

```
server {
    root /var/www/<PATH>/public_html;
    server_name <SERVER_NAME>;

    index index.html;

    gzip on;
    gzip_static on;
    gzip_vary on;

    location / {
	try_files $uri /index.html;	
	    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-r
evalidate, max-age=0';
        expires off;
	    proxy_no_cache 1;
    }
    
    
    location = /index.html {
    	internal;	
	    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-r
evalidate, max-age=0';
        expires off;
	    proxy_no_cache 1;
    }

    location ~* (service-worker\.js)$ {
	    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        expires off;
	    proxy_no_cache 1;
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


# Setting up CORS

As an example

```
location /mfts {

        set $cors '';
	if ($http_origin ~ '^https?://(localhost|www\.soluble\.io|paxton\.soluble\.io|soluble\.io)') {
    	    set $cors 'true';
	}

        if ($cors = 'true') {
            add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
            # required to be able to read Authorization header in frontend
            #add_header 'Access-Control-Expose-Headers' 'Authorization' always;
	}

	if ($request_method = 'OPTIONS') {
    	    add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
            # required to be able to read Authorization header in frontend
            #add_header 'Access-Control-Expose-Headers' 'Authorization' always;
            # Tell client that this pre-flight info is valid for 20 days
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
	}

}

```

 
