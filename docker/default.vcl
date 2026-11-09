vcl 4.1;

backend default {
    .host = "gup-backend";
    .port = "3000";
}

sub vcl_recv {
    return (pass);
    # Never cache authenticated requests.
    if (req.http.Authorization) {
        return (pass);
    }
    if (req.method != "GET" && req.method != "HEAD") {
        return (pass);
    }
    return (hash);
}

sub vcl_backend_response {
    # For anonymous requests, ignore Rails' conservative cache headers
    if (!bereq.http.Authorization) {
        unset beresp.http.Cache-Control;
        unset beresp.http.Expires;
        unset beresp.http.Pragma;
        unset beresp.http.Set-Cookie;

        set beresp.ttl = 24h;

        # optional but useful
        set beresp.grace = 1h;
    }
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
        set resp.http.X-Cache-Hits = obj.hits;
    } else {
        set resp.http.X-Cache = "MISS";
    }
}
