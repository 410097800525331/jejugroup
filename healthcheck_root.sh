#!/bin/bash
echo '=== 1. Healthcheck: GET /check-id (ROOT CONTEXT) ==='
curl -s -w "\nHTTP Code: %{http_code}\n" -X GET 'https://jejugroup.alwaysdata.net/api/auth/check-id?loginId=healthcheck'
echo -e '\n=== 2. Healthcheck: OPTIONS /login (CORS) ==='
curl -s -i -w "\nHTTP Code: %{http_code}\n" -X OPTIONS 'https://jejugroup.alwaysdata.net/api/auth/login' \
  -H 'Origin: http://127.0.0.1:5500' \
  -H 'Access-Control-Request-Method: POST' | grep -i 'Access-Control'
echo -e '\n=== 3. Healthcheck: POST /login ==='
curl -s -w "\nHTTP Code: %{http_code}\n" -X POST 'https://jejugroup.alwaysdata.net/api/auth/login' \
  -H 'Origin: http://127.0.0.1:5500' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'email=test@example.com&password=invalid123'
