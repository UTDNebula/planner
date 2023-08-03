# Documentaition

## API

Sorry! No comprehensive API documentation :)  
This is will probably change a lot. For now it's quite simple so just look inside `api.py`.

## Outline of Deployment

This isn't the only way to deploy the API, just one way that is hopefully not horrible.
![](Deployment%20Design.png)

Cloudflare serves as DNS, and has SSL encryption mode set
to [Full (Strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/). Both CF and Nginx
are configured to redirect HTTP traffic to HTTPS.

On the server itself, Nginx is configured with
[ssl_verify_client](http://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_verify_client) enabled. The only
configured client cert is the one from Cloudflare, meaning Nginx will reject connections from other clients. This
forces all traffic to go through Cloudflare.
