# Apache

## .htaccess or location config

### Location '/'

```apacheconfig

# ModRewrite is required 
#
#<IfModule mod_rewrite.c>

  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  # Old resources like like precache-<old-hash>.js
  # used by service worker must be returned as 404 if not found
  RewriteCond %{REQUEST_FILENAME} !\.(js|css)$
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]

#</IfModule>

    
# DANGER !
# Cache of service-worker.js and index.html are explicitly
# disabled to prevent issues with PWA... Apache must error
# if mod_headers not present.
#
<FilesMatch "(index.html|service-worker.js)$">
    FileETag None
    Header unset ETag
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
    Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
</FilesMatch>
#</IfModule>

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
            RewriteCond %{REQUEST_URI} .*\.(css|js)
            # …and a matching pre-compressed file exists… 
            RewriteCond %{REQUEST_FILENAME}.br -s
            # …then rewrite the request to deliver the brotli file
            RewriteRule ^(.+) $1.br
            # For each file format set the correct mime type (otherwise brotli mime type is returned) and prevent Apache for recompressing the files
            RewriteRule "\.css\.br$" "-" [T=text/css,E=no-brotli,E=no-gzip]
            RewriteRule "\.js\.br$" "-" [T=application/javascript,E=no-brotli,E=no-gzip]
            
            # Gzip
            # If the web browser accept gzip encoding… 
            RewriteCond %{HTTP:Accept-Encoding} gzip
            # …and the web browser is fetching a probably pre-compressed file…
            RewriteCond %{REQUEST_URI} .*\.(css|js)
            # …and a matching pre-compressed file exists… 
            RewriteCond %{REQUEST_FILENAME}.gz -s
            # …then rewrite the request to deliver the gzip file
            RewriteRule ^(.+) $1.gz
            # For each file format set the correct mime type (otherwise gzip mime type is returned) and prevent Apache for recompressing the files
            RewriteRule "\.css\.gz$" "-" [T=text/css,E=no-brotli,E=no-gzip]
            RewriteRule "\.js\.gz$" "-" [T=application/javascript,E=no-brotli,E=no-gzip]
        </IfModule>
    
    </Location>

    <FilesMatch "\.(css|js)\.br$">
            # Prevent mime module to set brazilian language header (because the file ends with .br)
            RemoveLanguage .br
            # Set the correct encoding type
            Header set Content-Encoding br
            # Force proxies to cache brotli & non-brotli files separately
            Header append Vary Accept-Encoding
    </FilesMatch>
    <FilesMatch "\.(css|js)\.gz$">
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

# Set CORS Headers for resources
<FilesMatch "\.(ttf|woff|vtt|mp4|webm|jpg|mp3)$">
    <IfModule mod_headers.c>
        SetEnvIf Origin "http(s)?://(preview\.|www\.|app\.)?(localhost|materialforthespine.com)(:\d+)?$" AccessControlAllowOrigin=$0
        
        # For dev chrome still have a bug with caching from different origin.
        # Disabled for now
        
        #Header always set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
        #Header always set Vary Origin
        
        Header always set Access-Control-Allow-Origin "*"        
        
        Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
        # 30 seconds before preflight request (let's not cache long when using multiple origins)
        Header always set Access-Control-Max-Age "30"
        Header always set Access-Control-Allow-Headers "x-requested-with, Content-Type, origin, authorization, accept, client-security-token"
    
        # Added a rewrite to respond with a 200 SUCCESS on every OPTIONS request.
        RewriteEngine On
        RewriteCond %{REQUEST_METHOD} OPTIONS
        RewriteRule ^(.*)$ $1 [R=200,L]

    </IfModule>
</FilesMatch>


```


To test cors preflight:

```bash
$ curl -H "Origin: https://localhost:3001" -H "Access-Control-Request-Method: GET"   -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS -i  https://assets.materialforthespine.com/videos/hello.jpg
```
