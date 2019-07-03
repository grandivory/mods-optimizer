def handler(event, context):
    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 400,
            'body': 'Invalid Http Method'
        }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Cache-control': 'no-store',
            'Content-type': 'text',
            'X-Content-Type-Options': 'nosniff'
        },
        'body': 'REACT_APP_VERSION'
    }
