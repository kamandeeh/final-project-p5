from flask import Flask,Blueprint,request
import requests
from requests.auth import HTTPBasicAuth

mpesa_bp=Blueprint("mpesa_bp",__name__)

#mpesa details
consumer_key='rFYhFppuJv2Jhk54GhtBzweTwsbpYDu2yOIXA5rpHHMgeg2O'
consumer_secret='os4qOYqxs86YOGMalzXu00GedAuGfGzCKKhlxUuu31nsKoqQCxVp4IkXl2gZAGmy'
base_url = 'http://197.248.86.122:801/'

#access token
@mpesa_bp.route('/access_token')
def token():
    data = ac_token()
    return data

#register urls
@mpesa_bp.route('/register_urls')
def register():
    mpesa_endpoint = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    headers = {"Authorization":"Bearer %s" % ac_token()}
    req_body = {
            "ShortCode":"174379",
            "ResponseType":"Completed",
            "ConfirmationURL":base_url + "/c2b/confirm",
            "ValidationURL":base_url + "/c2b/validation"
        }

    response_data = requests.post(
        mpesa_endpoint,
        json = req_body,
        headers = headers
    )

    return response_data.json()

@mpesa_bp.route('/c2b/confirm')
def confirm():
    #get data
    data = request.get_json()
    #write to file
    file = open('confirm.json','a')
    file.write(data)
    file.close()

@mpesa_bp.route('/c2b/validation')    
def validate():
    #get data
    data = request.get_json()
    #write to file
    file = open('confirm.json','a')
    file.write(data)
    file.close()




def ac_token():
    mpesa_auth_url='https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    
    data=(requests.get(mpesa_auth_url,auth = HTTPBasicAuth(consumer_key,consumer_secret))).json()
    return data['access_token']    
