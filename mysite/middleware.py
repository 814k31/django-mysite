import jwt
from django.http import JsonResponse
import requests

def decode_jwt(token):
    # Fetch the public key from your authorization server
    # Replace 'your_authorization_server' with the actual URL of your authorization server
    public_key_url = 'https://accounts.google.com/.well-known/jwks.json'
    response = requests.get(public_key_url)
    jwks = response.json()

    # Extract the public key from the JWKS (JSON Web Key Set)
    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwks['keys'][0])

    print("publickey", public_key)

    # Decode the token using the public key
    decoded_token = jwt.decode(token, public_key, algorithms=['RS256'])

    return decoded_token

def token_validation_middleware(get_response):
    def middleware(request):
        # Retrieve the access token from the request headers
        authorisation_header = request.headers.get('Authorization', '')

        if (authorisation_header == ""):
            # response = get_response(request)
            # return response
            return JsonResponse({'error': 'No Authorization Header'}, status=401)

        access_token = authorisation_header.split(' ')[1]

        try:
            # Validate the access token
            decoded_token = decode_jwt(access_token)
            # Optionally, you can perform additional checks on the decoded token
            # Check if the token's issuer matches the expected authority
            if decoded_token.get('iss') != 'https://accounts.google.com':
                return JsonResponse({'error': 'Invalid issuer'}, status=401)
            
            if decoded_token.get('aud') != '359225057863-48lo1b60nn73qgbb9k2hs63bfkbnq6hg.apps.googleusercontent.com':
                return JsonResponse({'error': 'Invalid audience'}, status=401)

        except jwt.ExpiredSignatureError:
            # Token has expired
            return JsonResponse({'error': 'Token has expired'}, status=401)

        except (jwt.InvalidTokenError, requests.RequestException):
            # Token is invalid or public key fetch failed
            return JsonResponse({'error': 'Invalid token'}, status=401)

        # Token is valid, proceed with the request
        response = get_response(request)
        return response

    return middleware
