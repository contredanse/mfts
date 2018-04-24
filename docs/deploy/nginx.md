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
	    add_header Cache-Control 'no-store';
    }

    location = /index.html {
    	internal;
    	add_header Cache-Control 'no-store';
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
