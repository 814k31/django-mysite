import jwt
import requests
from cryptography.hazmat.backends import default_backend
from cryptography.x509 import load_pem_x509_certificate
from django.http import JsonResponse

def validate_jwt(token, audience, issuer):
    # Fetch the JWKS from the provided URL
    response = requests.get(issuer + '.well-known/jwks.json')
    jwks = response.json()

    # Find the correct RSA key in the JWKS
    rsa_key = None
    for key in jwks['keys']:
        if key['kty'] == 'RSA' and key['alg'] == 'RS256':
            rsa_key = key
            break
    else:
        raise ValueError("No RSA public key found in JWKS")

    # Parse the RSA public key from JWKS
    cert_str = "-----BEGIN CERTIFICATE-----\n" + rsa_key['x5c'][0] + "\n-----END CERTIFICATE-----"
    cert_obj = load_pem_x509_certificate(cert_str.encode(), default_backend())
    public_key = cert_obj.public_key()

    # Decode the token using the public key
    decoded_token = jwt.decode(token, public_key, algorithms=['RS256'], audience=audience, issuer=issuer)

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
            validate_jwt(
                access_token,
                issuer='https://dev-yxuqagk74bpowmp5.us.auth0.com/',
                audience='gkxcHO9gtKAALKZmXFWkNKwAsrU5QbQp'
            )
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
