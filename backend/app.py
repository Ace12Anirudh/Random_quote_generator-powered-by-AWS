import json
import os
import random
import uuid
import boto3
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize the DynamoDB client from environment variables
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Main Lambda handler function.
    Routes requests from API Gateway to the appropriate function.
    """
    logger.info(f"Received event: {json.dumps(event)}")
    
    http_method = event.get('httpMethod')
    path = event.get('path')

    # Default CORS headers for every response
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    }

    try:
        if http_method == 'OPTIONS':
            # Handle CORS preflight requests immediately
            return {'statusCode': 200, 'headers': headers, 'body': ''}
        
        elif http_method == 'GET' and path == '/quotes':
            response = get_random_quote()
        
        elif http_method == 'POST' and path == '/quotes':
            request_body = json.loads(event.get('body', '{}'))
            response = add_quote(request_body)
        
        else:
            response = {'statusCode': 404, 'body': json.dumps({'error': 'Not Found'})}
            
        # Add CORS headers to the final response and return it
        response['headers'] = headers
        return response
            
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal Server Error'})
        }

def get_random_quote():
    """Scans the DynamoDB table and returns a single random quote."""
    response = table.scan(
        ProjectionExpression="quoteId, #qt, author",
        ExpressionAttributeNames={"#qt": "text"} # 'text' is a reserved word
    )
    items = response.get('Items', [])
    
    if not items:
        return {'statusCode': 404, 'body': json.dumps({'error': 'No quotes found in the database.'})}
        
    random_quote = random.choice(items)
    return {'statusCode': 200, 'body': json.dumps(random_quote)}

def add_quote(quote_data):
    """Adds a new quote to the DynamoDB table."""
    text = quote_data.get('text')
    author = quote_data.get('author')

    if not text or not author:
        return {'statusCode': 400, 'body': json.dumps({'error': "Missing 'text' or 'author' field"})}

    quote_id = str(uuid.uuid4())
    table.put_item(Item={'quoteId': quote_id, 'text': text, 'author': author})
    new_quote = {'quoteId': quote_id, 'text': text, 'author': author}
    return {'statusCode': 201, 'body': json.dumps(new_quote)}