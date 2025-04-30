"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Odata = void 0;

// Import axios for HTTP requests - better maintained and more reliable
const axios = require("axios");
// Import n8n error classes for proper error handling
const { NodeApiError, NodeOperationError } = require("n8n-workflow");

class Odata {
    constructor() {
        this.description = {
            displayName: 'Odata Node',
            name: 'Odata',
            group: ['transform'],
            version: 1,
            description: 'Fetch a specific reource from a Odata API',
            defaults: {
                name: 'Odata Node',
                color: '#772244',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'httpBasicAuth',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'basicAuth',
                            ],
                        },
                    },
                },
                {
                    name: 'httpHeaderAuth',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'headerAuth',
                            ],
                        },
                    },
                },
                {
                    name: 'oAuth2Api',
                    required: false,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Basic Auth',
                            value: 'basicAuth',
                        },
                        {
                            name: 'Header Auth',
                            value: 'headerAuth',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                        {
                            name: 'None',
                            value: 'none',
                        },
                    ],
                    default: 'none',
                    description: 'The way to authenticate.',
                },
                {
                    displayName: 'HTTP Method',
                    name: 'requestMethod',
                    type: 'options',
                    options: [
                        {
                            name: 'DELETE',
                            value: 'DELETE',
                        },
                        {
                            name: 'GET',
                            value: 'GET',
                        },
                        {
                            name: 'PATCH',
                            value: 'PATCH',
                        },
                        {
                            name: 'POST',
                            value: 'POST',
                        },
                    ],
                    default: 'GET',
                    description: 'The HTTP method to execute.',
                },
                // Node properties which the user gets displayed and
                // can change on the node.
                {
                    displayName: 'odata base url',
                    name: 'baseUrl',
                    type: 'string',
                    default: '',
                    placeholder: 'https://username:password@localhost/path/to/service/',
                    description: 'The base url of the Odata service (eg. https://services.odata.org/TripPinRESTierService)',
                    required: true,
                },
                {
                    displayName: 'requestType',
                    name: 'requestType',
                    type: 'options',
                    options: [
                        {
                            name: 'query',
                            value: 'query',
                        },
                        {
                            name: 'get List of entities',
                            value: 'listEntitySet',
                        },
                        {
                            name: 'get Single Entity',
                            value: 'singleEntity',
                        },
                        {
                            name: 'get entity Property value',
                            value: 'singleEntityPropertyValue',
                        },
                        {
                            name: 'Invoke function or action',
                            value: 'invokeFunction',
                        },
                    ],
                    required: true,
                    default: 'listEntitySet',
                    description: 'How to fetch resources',
                    displayOptions: {
                        show: {
                            requestMethod: [
                                'GET',
                            ],
                        },
                    },
                },
                {
                    displayName: 'requestType',
                    name: 'requestType',
                    type: 'options',
                    options: [
                        {
                            name: 'Invoke function or action',
                            value: 'invokeFunction',
                        },
                        {
                            name: 'Create an entity',
                            value: 'createEntity',
                        },
                    ],
                    default: 'invokeFunction',
                    description: '',
                    displayOptions: {
                        show: {
                            requestMethod: [
                                'POST',
                            ],
                        },
                    },
                },
                {
                    displayName: 'requestType',
                    name: 'requestType',
                    type: 'options',
                    options: [
                        {
                            name: 'Update an entity',
                            value: 'updateEntity',
                        },
                    ],
                    default: 'updateEntity',
                    description: '',
                    displayOptions: {
                        show: {
                            requestMethod: [
                                'PATCH',
                            ],
                        },
                    },
                },
                {
                    displayName: 'requestType',
                    name: 'requestType',
                    type: 'options',
                    options: [
                        {
                            name: 'Delete an entity',
                            value: 'deleteEntity',
                        },
                    ],
                    default: 'deleteEntity',
                    description: '',
                    displayOptions: {
                        show: {
                            requestMethod: [
                                'DELETE',
                            ],
                        },
                    },
                },
                {
                    displayName: 'request Body',
                    name: 'requestBody',
                    type: 'string',
                    default: '',
                    placeholder: '{}',
                    description: 'The body to send (eg. {name: "Frederik"})',
                    displayOptions: {
                        show: {
                            requestType: [
                                'createEntity',
                                'updateEntity',
                            ],
                            requestMethod: [
                                'POST',
                                'PATCH',
                            ],
                        },
                    },
                },
                {
                    displayName: 'path',
                    name: 'path',
                    type: 'string',
                    default: '',
                    placeholder: 'path',
                    description: 'The base url of the Odata service (eg. People)',
                    displayOptions: {
                        show: {
                            requestType: [
                                'createEntity',
                                'deleteEntity',
                                'updateEntity',
                                'query',
                                'listEntitySet',
                                'singleEntity',
                                'singleEntityPropertyValue',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Odata Object Id',
                    name: 'OdataObjectId',
                    type: 'string',
                    default: '',
                    placeholder: 'id',
                    description: 'The id of a specific object (eg. "russellwhyte" )',
                    displayOptions: {
                        show: {
                            requestType: [
                                'deleteEntity',
                                'updateEntity',
                                'singleEntity',
                                'singleEntityPropertyValue',
                            ],
                            requestMethod: [
                                'GET',
                                'DELETE',
                                'PATCH',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Odata property name',
                    name: 'OdataObjectPropertyName',
                    type: 'string',
                    default: '',
                    placeholder: 'propertyname',
                    description: 'The id of a specific property (eg. "Name" )',
                    displayOptions: {
                        show: {
                            requestType: [
                                'singleEntityPropertyValue',
                            ],
                            requestMethod: [
                                'GET',
                            ],
                        },
                    },
                },
                {
                    displayName: 'extra query params',
                    name: 'OdataObjectqueryparams',
                    type: 'string',
                    default: '',
                    placeholder: 'queryparams',
                    description: 'Extra queryparams to add (eg. "$filter=FirstName eq \'Scott\'" )',
                    required: false,
                    displayOptions: {
                        show: {
                            requestMethod: [
                                'GET',
                            ],
                            requestType: [
                                'query',
                                'listEntitySet',
                                'singleEntity',
                                'singleEntityPropertyValue',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Odata function name',
                    name: 'OdataFunctionName',
                    type: 'string',
                    default: '',
                    placeholder: 'function name',
                    description: 'The odata function name (eg. "GetNearestAirport" )',
                    displayOptions: {
                        show: {
                            requestType: [
                                'invokeFunction',
                            ],
                            requestMethod: [
                                'GET',
                                'POST',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Odata function params',
                    name: 'OdataFunctionParams',
                    type: 'string',
                    default: '',
                    placeholder: 'function params',
                    description: 'The odata function params (eg. "lat = 33, lon = -118" )',
                    displayOptions: {
                        show: {
                            requestType: [
                                'invokeFunction',
                            ],
                            requestMethod: [
                                'GET',
                            ],
                        },
                    },
                },
            ]
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnItems = [];
        
        try {
            // Get node parameters
            const requestMethod = this.getNodeParameter('requestMethod', 0);
            const requestType = this.getNodeParameter('requestType', 0);
            const baseUrl = this.getNodeParameter('baseUrl', 0);
            
            // Get the selected authentication method
            const authenticationType = this.getNodeParameter('authentication', 0);
            
            // Initialize credential variables
            let httpBasicAuth;
            let httpHeaderAuth;
            let oAuth2Api;
            
            // Only get credentials if the corresponding authentication method is selected
            if (authenticationType === 'basicAuth') {
                httpBasicAuth = this.getCredentials('httpBasicAuth');
            } else if (authenticationType === 'headerAuth') {
                httpHeaderAuth = this.getCredentials('httpHeaderAuth');
            } else if (authenticationType === 'oAuth2') {
                oAuth2Api = this.getCredentials('oAuth2Api');
            }
            // No credentials needed if 'none' is selected
            
            // Build the OData path based on the request type
            let path = '';
            
            // 1. Determine the path based on request type
            if (requestType === 'listEntitySet' || requestType === 'createEntity') {
                // For entity set listings or creation, just use the path as is
                path = this.getNodeParameter('path', 0);
            } 
            else if (requestType === 'singleEntity' || requestType === 'deleteEntity' || requestType === 'updateEntity') {
                // For operations on a specific entity, append the ID in OData format
                path = this.getNodeParameter('path', 0);
                const odataObjectId = this.getNodeParameter('OdataObjectId', 0);
                if (odataObjectId !== '') {
                    path = `${path}('${odataObjectId}')`;
                }
            } 
            else if (requestType === 'singleEntityPropertyValue') {
                // For getting a specific property of an entity
                path = this.getNodeParameter('path', 0);
                const odataObjectId = this.getNodeParameter('OdataObjectId', 0);
                const odataObjectPropertyName = this.getNodeParameter('OdataObjectPropertyName', 0);
                if (odataObjectId !== '' && odataObjectPropertyName !== '') {
                    path = `${path}('${odataObjectId}')/${odataObjectPropertyName}`;
                }
            } 
            else if (requestType === 'invokeFunction') {
                // For invoking OData functions
                const odataFunctionName = this.getNodeParameter('OdataFunctionName', 0);
                if (requestMethod === 'GET') {
                    const odataFunctionParams = this.getNodeParameter('OdataFunctionParams', 0);
                    if (odataFunctionParams !== '') {
                        path = `${odataFunctionName}(${odataFunctionParams})`;
                    } else {
                        path = odataFunctionName;
                    }
                } else {
                    path = odataFunctionName;
                }
            }
            
            // 2. Setup request configuration (URL, headers, query params, etc.)
            // Construct the full URL
            const url = `${baseUrl}/${path}`;
            
            // Setup headers with OData specific headers
            const headers = {
                'Accept': 'application/json',
            };
            
            // Setup content type headers for POST/PATCH operations
            if (requestMethod === 'PATCH' || requestMethod === 'POST') {
                // Use JSON content type for OData compatibility
                headers['Content-Type'] = 'application/json';
            }
            
            // Setup authentication
            let auth = undefined;
            
            // Add auth headers/config based on the authentication method
            if (httpBasicAuth !== undefined) {
                // For Basic Auth, use axios auth configuration
                auth = {
                    username: httpBasicAuth.user,
                    password: httpBasicAuth.password,
                };
            }
            
            if (httpHeaderAuth !== undefined) {
                // For custom header auth, add the specified header
                headers[httpHeaderAuth.name] = httpHeaderAuth.value;
            }
            
            if (oAuth2Api !== undefined) {
                // For OAuth2, add the bearer token
                const token = await this.getCredentials('oAuth2Api');
                headers['Authorization'] = `Bearer ${token.access_token}`;
            }
            
            // Configure axios request
            const config = {
                method: requestMethod.toLowerCase(),
                url,
                headers,
                auth,
            };
            
            // Handle query parameters for GET requests
            if (requestMethod === 'GET' && 
                ['query', 'listEntitySet', 'singleEntity', 'singleEntityPropertyValue'].includes(requestType)) {
                const queryParams = this.getNodeParameter('OdataObjectqueryparams', 0, '');
                if (queryParams) {
                    // Parse OData query parameters and add to axios params
                    config.params = parseQueryParams(queryParams);
                }
            }
            
            // Handle request body for POST/PATCH
            if ((requestMethod === 'POST' || requestMethod === 'PATCH') && 
                ['createEntity', 'updateEntity', 'invokeFunction'].includes(requestType)) {
                const requestBody = this.getNodeParameter('requestBody', 0, '{}');
                try {
                    config.data = JSON.parse(requestBody);
                } catch (e) {
                    // If parsing fails, use the string as is
                    console.log('Failed to parse request body as JSON, using as-is');
                    config.data = requestBody;
                }
            }
            
            // Add OData standard query parameters for formatting
            if (!config.params) {
                config.params = {};
            }
            
            // Add $format=json to ensure JSON response
            if (!config.params.$format) {
                config.params.$format = 'json';
            }
            
            // 3. Log request details for debugging
            console.log(`OData Request: ${config.method.toUpperCase()} ${url}`);
            console.log(`Headers:`, headers);
            if (config.params) {
                console.log(`Query Parameters:`, config.params);
            }
            if (config.data) {
                console.log(`Request Body:`, config.data);
            }
            
            // 4. Execute the request
            try {
                // Make the request with axios
                const response = await axios(config);
                
                // Process the response
                console.log(`OData response received successfully with status: ${response.status}`);
                
                // Extract the data from the response
                const result = response.data;
                
                // Add the result to returnItems
                returnItems.push({ json: result });
                
            } catch (error) {
                // Handle errors from the axios request
                console.error('OData request failed:', error.message);
                
                // Extract relevant error information
                const errorDetails = {
                    message: error.message,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                };
                
                if (this.continueOnFail()) {
                    // Return the error as part of the flow if continueOnFail is enabled
                    returnItems.push({
                        json: {
                            error: error.message,
                            details: errorDetails,
                        },
                    });
                } else {
                    // Throw a proper n8n error to halt the workflow
                    throw new NodeApiError(this.getNode(), error, {
                        message: `OData request failed: ${error.message}`,
                        description: `Error occurred while executing ${requestMethod.toUpperCase()} request to ${url}`,
                        httpCode: error.response?.status,
                    });
                }
            }
            
        } catch (error) {
            // Handle general errors in the node execution
            console.error('Error in OData node execution:', error.message);
            
            if (this.continueOnFail()) {
                returnItems.push({
                    json: {
                        error: error.message || 'Unknown error occurred',
                    },
                });
            } else {
                throw new NodeOperationError(this.getNode(), error);
            }
        }
        
        return this.prepareOutputData(returnItems);
    }
}

/**
 * Helper function to parse OData query parameters from string format to object
 * @param queryString The query string in OData format
 * @returns An object with parsed query parameters
 */
function parseQueryParams(queryString) {
    const result = {};
    
    // Simple parser for OData query parameters
    // In a real implementation, this would need more sophisticated handling
    // Split by space only if not within quotes
    const parts = queryString.match(/(?:[^\s'"]+|['"][^'"]*['"])+/g) || [];
    
    for (const part of parts) {
        if (part.includes('=')) {
            const [key, ...valueParts] = part.split('=');
            const value = valueParts.join('=');
            
            // Remove quotes if present
            const cleanValue = value.replace(/^['"]|['"]$/g, '');
            result[key.trim()] = cleanValue.trim();
        }
    }
    
    return result;
}
exports.Odata = Odata;
//# sourceMappingURL=Odata.node.js.map
