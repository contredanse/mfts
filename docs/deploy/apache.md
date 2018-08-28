# Apache


## .htaccess or location config

### Location '/'

```apacheconfig

<IfModule mod_rewrite.c>

  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]

</IfModule>

```

### Location '/static'

```apacheconfig

# Use precompressed version if they exists

    <Location /static/>

        # Use precompressed version if they exists
        <IfModule mod_headers.c>

            RewriteEngine on
               
            # Brotli
            # If the web browser accept brotli encoding… 
            RewriteCond %{HTTP:Accept-encoding} br
            # …and the web browser is fetching a probably pre-compressed file…
            RewriteCond %{REQUEST_URI} .*\.(css|html|js)
            # …and a matching pre-compressed file exists… 
            RewriteCond %{REQUEST_FILENAME}.br -s
            # …then rewrite the request to deliver the brotli file
            RewriteRule ^(.+) $1.br
            # For each file format set the correct mime type (otherwise brotli mime type is returned) and prevent Apache for recompressing the files
            RewriteRule "\.css\.br$" "-" [T=text/css,E=no-brotli,E=no-gzip]
            RewriteRule "\.html\.br$" "-" [T=text/html,E=no-brotli,E=no-gzip]
            RewriteRule "\.js\.br$" "-" [T=application/javascript,E=no-brotli,E=no-gzip]
            
            # Gzip
            # If the web browser accept gzip encoding… 
            RewriteCond %{HTTP:Accept-Encoding} gzip
            # …and the web browser is fetching a probably pre-compressed file…
            RewriteCond %{REQUEST_URI} .*\.(css|html|js)
            # …and a matching pre-compressed file exists… 
            RewriteCond %{REQUEST_FILENAME}.gz -s
            # …then rewrite the request to deliver the gzip file
            RewriteRule ^(.+) $1.gz
            # For each file format set the correct mime type (otherwise gzip mime type is returned) and prevent Apache for recompressing the files
            RewriteRule "\.css\.gz$" "-" [T=text/css,E=no-brotli,E=no-gzip]
            RewriteRule "\.html\.gz$" "-" [T=text/html,E=no-brotli,E=no-gzip]
            RewriteRule "\.js\.gz$" "-" [T=application/javascript,E=no-brotli,E=no-gzip]
        </IfModule>
    
    </Location>

    <FilesMatch "\.(css|html|js)\.br$">
            # Prevent mime module to set brazilian language header (because the file ends with .br)
            RemoveLanguage .br
            # Set the correct encoding type
            Header set Content-Encoding br
            # Force proxies to cache brotli & non-brotli files separately
            Header append Vary Accept-Encoding
    </FilesMatch>
    <FilesMatch "\.(css|html|js)\.gz$">
            # Serve correct encoding type
            Header set Content-Encoding gzip
            # Force proxies to cache gzip & non-gzip files separately
            Header append Vary Accept-Encoding
    </FilesMatch>


```


### Location '/assets' or .htaccess

```apacheconfig

# VTT still misses in modern apache mime

AddType text/vtt .vtt

<IfModule mod_filter.c>
    AddOutputFilterByType DEFLATE "application/atom+xml" \
                                  "application/javascript" \
                                  "application/json" \
                                  "application/ld+json" \
                                  "application/manifest+json" \
                                  "application/rdf+xml" \
                                  "application/rss+xml" \
                                  "application/schema+json" \
                                  "application/vnd.geo+json" \
                                  "application/vnd.ms-fontobject" \
                                  "application/x-font-ttf" \
                                  "application/x-javascript" \
                                  "application/x-web-app-manifest+json" \
                                  "application/xhtml+xml" \
                                  "application/xml" \
                                  "font/eot" \
                                  "font/opentype" \
                                  "image/bmp" \
                                  "image/svg+xml" \
                                  "image/vnd.microsoft.icon" \
                                  "image/x-icon" \
                                  "text/cache-manifest" \
                                  "text/css" \
                                  "text/html" \
                                  "text/javascript" \
                                  "text/plain" \
                                  "text/vcard" \
                                  "text/vnd.rim.location.xloc" \
                                  "text/vtt" \
                                  "text/x-component" \
                                  "text/x-cross-domain-policy" \
                                  "text/xml"
</IfModule>

# Set CORS Headers
<FilesMatch "\.(ttf|woff|vtt|mp4|webm|jpg|mp3)$">
    <IfModule mod_headers.c>
        SetEnvIf Origin "http(s)?://(preview\.|www\.|app\.)?(localhost|materialforthespine.com)(:\d+)?$" AccessControlAllowOrigin=$0
        Header always set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
	#Header always set Access-Control-Allow-Origin "*"        
	Header merge Vary Origin
	Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
	Header always set Access-Control-Max-Age "1000"
	Header always set Access-Control-Allow-Headers "x-requested-with, Content-Type, origin, authorization, accept, client-security-token"

    </IfModule>
</FilesMatch>


# Added a rewrite to respond with a 200 SUCCESS on every OPTIONS request.
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]


```
