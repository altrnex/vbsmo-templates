{
	auto_https off
	admin off
	frankenphp
}

:3000 {
	root * /app/public
	encode zstd gzip
	php_server
}
