/**
* Google Apps Script Library for the dialogflow API
* 
* Documentation can be found: 
* https://cloud.google.com/dialogflow-enterprise/
* 
* OAuth2 Scopes
* https://www.googleapis.com/auth/cloud-platform
*/

var BASEURL_="https://dialogflow.googleapis.com/";
var tokenService_;

/*
* Stores the function passed that is invoked to get a OAuth2 token;
* @param {function} service The function used to get the OAuth2 token;
*
*/
function setTokenService(service){
  tokenService_ = service;
}

/*
* Returns an OAuth2 token from your TokenService as a test
* @return {string} An OAuth2 token
*
*/
function testTokenService(){
 return tokenService_();
}

/**
 * Performs a Fetch
 * @param {string} url The endpoint for the URL with parameters
 * @param {Object.<string, string>} options Options to override default fetch options
 * @returns {Object.<string,string>} the fetch results
 * @private
 */
function CALL_(path,options){
  var fetchOptions = {method:"",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer "+tokenService_()}}
  var url = BASEURL_ + path;
  
  for(option in options){
    fetchOptions[option] = options[option];
  }
  
  var response = UrlFetchApp.fetch(url, fetchOptions)
  if(response.getResponseCode() != 200){
    throw new Error(response.getContentText())
  }else{
    return JSON.parse(response.getContentText());
  }
}

/**
 * Performs a Fetch and accumulation using pageToken parameter of the returned results
 * @param {string} url The endpoint for the URL with parameters
 * @param {Object.<string, string>} options Options to override default fetch options
 * @param {string} returnParamPath The path of the parameter to be accumulated
 * @returns {Array.Object.<string,string>} An array of objects
 * @private
 */
function CALLPAGE_(path,options, returnParamPath){
  var fetchOptions = {method:"",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer "+tokenService_()}}
  for(option in options){
    fetchOptions[option] = options[option];
  }
  var url = BASEURL_ + path;  
  var returnArray = [];
  var nextPageToken;
  do{
    if(nextPageToken){
      url = buildUrl_(url, {pageToken:nextPageToken});
    }
    var results = UrlFetchApp.fetch(url, fetchOptions);
    if(results.getResponseCode() != 200){
      throw new Error(results.getContentText());
    }else{
      var resp = JSON.parse(results.getContentText())
      nextPageToken = resp.nextPageToken;
      returnArray  = returnArray.concat(resp[returnParamPath])
    }
    url = BASEURL_ + path;
  }while(nextPageToken);
  return returnArray;
}

/**
 * Builds a complete URL from a base URL and a map of URL parameters. Written by Eric Koleda in the OAuth2 library
 * @param {string} url The base URL.
 * @param {Object.<string, string>} params The URL parameters and values.
 * @returns {string} The complete URL.
 * @private
 */
function buildUrl_(url, params) {
  var params = params || {}; //allow for NULL options
  var paramString = Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;  
}


/**
* Retrieves the specified agent.
*
* @param {string} parent Required. The project that the agent to fetch is associated with.Format: `projects/<Project ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2AgentResource object
*/
function projectsGetAgent(parent,options){
  var path = buildUrl_("v2/"+parent+"/agent",options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2AgentResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2AgentResource;
}

/**
* Gets the latest state of a long-running operation.  Clients can use this
method to poll the operation result at intervals as recommended by the API
service.
*
* @param {string} name The name of the operation resource.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsOperationsGet(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"GET"};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Imports the specified agent from a ZIP file.

Uploads new intents and entity types without deleting the existing ones.
Intents and entity types with the same name are replaced with the new
versions from ImportAgentRequest.

Operation <response: google.protobuf.Empty,
           metadata: google.protobuf.Struct>
*
* @param {string} parent Required. The project that the agent to import is associated with.Format: `projects/<Project ID>`.
* @param {object} GoogleCloudDialogflowV2ImportAgentRequestResource An object containing the GoogleCloudDialogflowV2ImportAgentRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentImport(parent,GoogleCloudDialogflowV2ImportAgentRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/agent:import",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2ImportAgentRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Returns the list of agents.

Since there is at most one conversational agent per project, this method is
useful primarily for listing all agents across projects the caller has
access to. One can achieve that with a wildcard project collection id "-".
Refer to [List
Sub-Collections](https://cloud.google.com/apis/design/design_patterns#list_sub-collections).
*
* @param {string} parent Required. The project to list agents from.Format: `projects/<Project ID or '-'>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2SearchAgentsResponseResource object
*/
function projectsAgentSearch(parent,options){
  var path = buildUrl_("v2/"+parent+"/agent:search",options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2SearchAgentsResponseItems = CALLPAGE_(path,callOptions,"items");
  return GoogleCloudDialogflowV2SearchAgentsResponseItems;
}

/**
* Trains the specified agent.

Operation <response: google.protobuf.Empty,
           metadata: google.protobuf.Struct>
*
* @param {string} parent Required. The project that the agent to train is associated with.Format: `projects/<Project ID>`.
* @param {object} GoogleCloudDialogflowV2TrainAgentRequestResource An object containing the GoogleCloudDialogflowV2TrainAgentRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentTrain(parent,GoogleCloudDialogflowV2TrainAgentRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/agent:train",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2TrainAgentRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Exports the specified agent to a ZIP file.

Operation <response: ExportAgentResponse,
           metadata: google.protobuf.Struct>
*
* @param {string} parent Required. The project that the agent to export is associated with.Format: `projects/<Project ID>`.
* @param {object} GoogleCloudDialogflowV2ExportAgentRequestResource An object containing the GoogleCloudDialogflowV2ExportAgentRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentExport(parent,GoogleCloudDialogflowV2ExportAgentRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/agent:export",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2ExportAgentRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Restores the specified agent from a ZIP file.

Replaces the current agent version with a new one. All the intents and
entity types in the older version are deleted.

Operation <response: google.protobuf.Empty,
           metadata: google.protobuf.Struct>
*
* @param {string} parent Required. The project that the agent to restore is associated with.Format: `projects/<Project ID>`.
* @param {object} GoogleCloudDialogflowV2RestoreAgentRequestResource An object containing the GoogleCloudDialogflowV2RestoreAgentRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentRestore(parent,GoogleCloudDialogflowV2RestoreAgentRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/agent:restore",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2RestoreAgentRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Updates/Creates multiple entity types in the specified agent.

Operation <response: BatchUpdateEntityTypesResponse,
           metadata: google.protobuf.Struct>
*
* @param {string} parent Required. The name of the agent to update or create entity types in.Format: `projects/<Project ID>/agent`.
* @param {object} GoogleCloudDialogflowV2BatchUpdateEntityTypesRequestResource An object containing the GoogleCloudDialogflowV2BatchUpdateEntityTypesRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentEntityTypesBatchUpdate(parent,GoogleCloudDialogflowV2BatchUpdateEntityTypesRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/entityTypes:batchUpdate",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2BatchUpdateEntityTypesRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Deletes the specified entity type.
*
* @param {string} name Required. The name of the entity type to delete.Format: `projects/<Project ID>/agent/entityTypes/<EntityType ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleProtobufEmptyResource object
*/
function projectsAgentEntityTypesDelete(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"DELETE"};
  var GoogleProtobufEmptyResource = CALL_(path,callOptions);
  return GoogleProtobufEmptyResource;
}

/**
* Returns the list of all entity types in the specified agent.
*
* @param {string} parent Required. The agent to list all entity types from.Format: `projects/<Project ID>/agent`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2ListEntityTypesResponseResource object
*/
function projectsAgentEntityTypesList(parent,options){
  var path = buildUrl_("v2/"+parent+"/entityTypes",options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2ListEntityTypesResponseItems = CALLPAGE_(path,callOptions,"items");
  return GoogleCloudDialogflowV2ListEntityTypesResponseItems;
}

/**
* Creates an entity type in the specified agent.
*
* @param {string} parent Required. The agent to create a entity type for.Format: `projects/<Project ID>/agent`.
* @param {object} GoogleCloudDialogflowV2EntityTypeResource An object containing the GoogleCloudDialogflowV2EntityTypeResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2EntityTypeResource object
*/
function projectsAgentEntityTypesCreate(parent,GoogleCloudDialogflowV2EntityTypeResource,options){
  var path = buildUrl_("v2/"+parent+"/entityTypes",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2EntityTypeResource)};
  var GoogleCloudDialogflowV2EntityTypeResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2EntityTypeResource;
}

/**
* Deletes entity types in the specified agent.

Operation <response: google.protobuf.Empty,
           metadata: google.protobuf.Struct>
*
* @param {string} parent Required. The name of the agent to delete all entities types for. Format:`projects/<Project ID>/agent`.
* @param {object} GoogleCloudDialogflowV2BatchDeleteEntityTypesRequestResource An object containing the GoogleCloudDialogflowV2BatchDeleteEntityTypesRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentEntityTypesBatchDelete(parent,GoogleCloudDialogflowV2BatchDeleteEntityTypesRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/entityTypes:batchDelete",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2BatchDeleteEntityTypesRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Retrieves the specified entity type.
*
* @param {string} name Required. The name of the entity type.Format: `projects/<Project ID>/agent/entityTypes/<EntityType ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2EntityTypeResource object
*/
function projectsAgentEntityTypesGet(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2EntityTypeResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2EntityTypeResource;
}

/**
* Updates the specified entity type.
*
* @param {string} name Required for all methods except `create` (`create` populates the nameautomatically.The unique identifier of the entity type. Format:`projects/<Project ID>/agent/entityTypes/<Entity Type ID>`.
* @param {object} GoogleCloudDialogflowV2EntityTypeResource An object containing the GoogleCloudDialogflowV2EntityTypeResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2EntityTypeResource object
*/
function projectsAgentEntityTypesPatch(name,GoogleCloudDialogflowV2EntityTypeResource,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"PATCH",payload:JSON.stringify(GoogleCloudDialogflowV2EntityTypeResource)};
  var GoogleCloudDialogflowV2EntityTypeResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2EntityTypeResource;
}

/**
* Updates entities in the specified entity type (replaces the existing
collection of entries).

Operation <response: google.protobuf.Empty,
           metadata: google.protobuf.Struct>
*
* @param {string} parent Required. The name of the entity type to update the entities in. Format:`projects/<Project ID>/agent/entityTypes/<Entity Type ID>`.
* @param {object} GoogleCloudDialogflowV2BatchUpdateEntitiesRequestResource An object containing the GoogleCloudDialogflowV2BatchUpdateEntitiesRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentEntityTypesEntitiesBatchUpdate(parent,GoogleCloudDialogflowV2BatchUpdateEntitiesRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/entities:batchUpdate",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2BatchUpdateEntitiesRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Deletes entities in the specified entity type.

Operation <response: google.protobuf.Empty,
           metadata: google.protobuf.Struct>
*
* @param {string} parent Required. The name of the entity type to delete entries for. Format:`projects/<Project ID>/agent/entityTypes/<Entity Type ID>`.
* @param {object} GoogleCloudDialogflowV2BatchDeleteEntitiesRequestResource An object containing the GoogleCloudDialogflowV2BatchDeleteEntitiesRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentEntityTypesEntitiesBatchDelete(parent,GoogleCloudDialogflowV2BatchDeleteEntitiesRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/entities:batchDelete",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2BatchDeleteEntitiesRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Creates multiple new entities in the specified entity type (extends the
existing collection of entries).

Operation <response: google.protobuf.Empty>
*
* @param {string} parent Required. The name of the entity type to create entities in. Format:`projects/<Project ID>/agent/entityTypes/<Entity Type ID>`.
* @param {object} GoogleCloudDialogflowV2BatchCreateEntitiesRequestResource An object containing the GoogleCloudDialogflowV2BatchCreateEntitiesRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentEntityTypesEntitiesBatchCreate(parent,GoogleCloudDialogflowV2BatchCreateEntitiesRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/entities:batchCreate",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2BatchCreateEntitiesRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Deletes the specified intent.
*
* @param {string} name Required. The name of the intent to delete.Format: `projects/<Project ID>/agent/intents/<Intent ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleProtobufEmptyResource object
*/
function projectsAgentIntentsDelete(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"DELETE"};
  var GoogleProtobufEmptyResource = CALL_(path,callOptions);
  return GoogleProtobufEmptyResource;
}

/**
* Returns the list of all intents in the specified agent.
*
* @param {string} parent Required. The agent to list all intents from.Format: `projects/<Project ID>/agent`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2ListIntentsResponseResource object
*/
function projectsAgentIntentsList(parent,options){
  var path = buildUrl_("v2/"+parent+"/intents",options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2ListIntentsResponseItems = CALLPAGE_(path,callOptions,"items");
  return GoogleCloudDialogflowV2ListIntentsResponseItems;
}

/**
* Creates an intent in the specified agent.
*
* @param {string} parent Required. The agent to create a intent for.Format: `projects/<Project ID>/agent`.
* @param {object} GoogleCloudDialogflowV2IntentResource An object containing the GoogleCloudDialogflowV2IntentResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2IntentResource object
*/
function projectsAgentIntentsCreate(parent,GoogleCloudDialogflowV2IntentResource,options){
  var path = buildUrl_("v2/"+parent+"/intents",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2IntentResource)};
  var GoogleCloudDialogflowV2IntentResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2IntentResource;
}

/**
* Deletes intents in the specified agent.

Operation <response: google.protobuf.Empty>
*
* @param {string} parent Required. The name of the agent to delete all entities types for. Format:`projects/<Project ID>/agent`.
* @param {object} GoogleCloudDialogflowV2BatchDeleteIntentsRequestResource An object containing the GoogleCloudDialogflowV2BatchDeleteIntentsRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentIntentsBatchDelete(parent,GoogleCloudDialogflowV2BatchDeleteIntentsRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/intents:batchDelete",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2BatchDeleteIntentsRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Retrieves the specified intent.
*
* @param {string} name Required. The name of the intent.Format: `projects/<Project ID>/agent/intents/<Intent ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2IntentResource object
*/
function projectsAgentIntentsGet(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2IntentResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2IntentResource;
}

/**
* Updates the specified intent.
*
* @param {string} name Required for all methods except `create` (`create` populates the nameautomatically.The unique identifier of this intent.Format: `projects/<Project ID>/agent/intents/<Intent ID>`.
* @param {object} GoogleCloudDialogflowV2IntentResource An object containing the GoogleCloudDialogflowV2IntentResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2IntentResource object
*/
function projectsAgentIntentsPatch(name,GoogleCloudDialogflowV2IntentResource,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"PATCH",payload:JSON.stringify(GoogleCloudDialogflowV2IntentResource)};
  var GoogleCloudDialogflowV2IntentResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2IntentResource;
}

/**
* Updates/Creates multiple intents in the specified agent.

Operation <response: BatchUpdateIntentsResponse>
*
* @param {string} parent Required. The name of the agent to update or create intents in.Format: `projects/<Project ID>/agent`.
* @param {object} GoogleCloudDialogflowV2BatchUpdateIntentsRequestResource An object containing the GoogleCloudDialogflowV2BatchUpdateIntentsRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleLongrunningOperationResource object
*/
function projectsAgentIntentsBatchUpdate(parent,GoogleCloudDialogflowV2BatchUpdateIntentsRequestResource,options){
  var path = buildUrl_("v2/"+parent+"/intents:batchUpdate",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2BatchUpdateIntentsRequestResource)};
  var GoogleLongrunningOperationResource = CALL_(path,callOptions);
  return GoogleLongrunningOperationResource;
}

/**
* Deletes all active contexts in the specified session.
*
* @param {string} parent Required. The name of the session to delete all contexts from. Format:`projects/<Project ID>/agent/sessions/<Session ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleProtobufEmptyResource object
*/
function projectsAgentSessionsDeleteContexts(parent,options){
  var path = buildUrl_("v2/"+parent+"/contexts",options);
  var callOptions = {method:"DELETE"};
  var GoogleProtobufEmptyResource = CALL_(path,callOptions);
  return GoogleProtobufEmptyResource;
}

/**
* Processes a natural language query and returns structured, actionable data
as a result. This method is not idempotent, because it may cause contexts
and session entity types to be updated, which in turn might affect
results of future queries.
*
* @param {string} session Required. The name of the session this query is sent to. Format:`projects/<Project ID>/agent/sessions/<Session ID>`. It's up to the APIcaller to choose an appropriate session ID. It can be a random number orsome type of user identifier (preferably hashed). The length of the sessionID must not exceed 36 bytes.
* @param {object} GoogleCloudDialogflowV2DetectIntentRequestResource An object containing the GoogleCloudDialogflowV2DetectIntentRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2DetectIntentResponseResource object
*/
function projectsAgentSessionsDetectIntent(session,GoogleCloudDialogflowV2DetectIntentRequestResource,options){
  var path = buildUrl_("v2/"+session+":detectIntent",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2DetectIntentRequestResource)};
  var GoogleCloudDialogflowV2DetectIntentResponseResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2DetectIntentResponseResource;
}

/**
* Deletes the specified session entity type.
*
* @param {string} name Required. The name of the entity type to delete. Format:`projects/<Project ID>/agent/sessions/<Session ID>/entityTypes/<Entity TypeDisplay Name>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleProtobufEmptyResource object
*/
function projectsAgentSessionsEntityTypesDelete(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"DELETE"};
  var GoogleProtobufEmptyResource = CALL_(path,callOptions);
  return GoogleProtobufEmptyResource;
}

/**
* Returns the list of all session entity types in the specified session.
*
* @param {string} parent Required. The session to list all session entity types from.Format: `projects/<Project ID>/agent/sessions/<Session ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2ListSessionEntityTypesResponseResource object
*/
function projectsAgentSessionsEntityTypesList(parent,options){
  var path = buildUrl_("v2/"+parent+"/entityTypes",options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2ListSessionEntityTypesResponseItems = CALLPAGE_(path,callOptions,"items");
  return GoogleCloudDialogflowV2ListSessionEntityTypesResponseItems;
}

/**
* Retrieves the specified session entity type.
*
* @param {string} name Required. The name of the session entity type. Format:`projects/<Project ID>/agent/sessions/<Session ID>/entityTypes/<Entity TypeDisplay Name>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2SessionEntityTypeResource object
*/
function projectsAgentSessionsEntityTypesGet(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2SessionEntityTypeResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2SessionEntityTypeResource;
}

/**
* Updates the specified session entity type.
*
* @param {string} name Required. The unique identifier of this session entity type. Format:`projects/<Project ID>/agent/sessions/<Session ID>/entityTypes/<Entity TypeDisplay Name>`.
* @param {object} GoogleCloudDialogflowV2SessionEntityTypeResource An object containing the GoogleCloudDialogflowV2SessionEntityTypeResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2SessionEntityTypeResource object
*/
function projectsAgentSessionsEntityTypesPatch(name,GoogleCloudDialogflowV2SessionEntityTypeResource,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"PATCH",payload:JSON.stringify(GoogleCloudDialogflowV2SessionEntityTypeResource)};
  var GoogleCloudDialogflowV2SessionEntityTypeResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2SessionEntityTypeResource;
}

/**
* Creates a session entity type.
*
* @param {string} parent Required. The session to create a session entity type for.Format: `projects/<Project ID>/agent/sessions/<Session ID>`.
* @param {object} GoogleCloudDialogflowV2SessionEntityTypeResource An object containing the GoogleCloudDialogflowV2SessionEntityTypeResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2SessionEntityTypeResource object
*/
function projectsAgentSessionsEntityTypesCreate(parent,GoogleCloudDialogflowV2SessionEntityTypeResource,options){
  var path = buildUrl_("v2/"+parent+"/entityTypes",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2SessionEntityTypeResource)};
  var GoogleCloudDialogflowV2SessionEntityTypeResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2SessionEntityTypeResource;
}

/**
* Deletes the specified context.
*
* @param {string} name Required. The name of the context to delete. Format:`projects/<Project ID>/agent/sessions/<Session ID>/contexts/<Context ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleProtobufEmptyResource object
*/
function projectsAgentSessionsContextsDelete(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"DELETE"};
  var GoogleProtobufEmptyResource = CALL_(path,callOptions);
  return GoogleProtobufEmptyResource;
}

/**
* Returns the list of all contexts in the specified session.
*
* @param {string} parent Required. The session to list all contexts from.Format: `projects/<Project ID>/agent/sessions/<Session ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2ListContextsResponseResource object
*/
function projectsAgentSessionsContextsList(parent,options){
  var path = buildUrl_("v2/"+parent+"/contexts",options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2ListContextsResponseItems = CALLPAGE_(path,callOptions,"items");
  return GoogleCloudDialogflowV2ListContextsResponseItems;
}

/**
* Retrieves the specified context.
*
* @param {string} name Required. The name of the context. Format:`projects/<Project ID>/agent/sessions/<Session ID>/contexts/<Context ID>`.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2ContextResource object
*/
function projectsAgentSessionsContextsGet(name,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"GET"};
  var GoogleCloudDialogflowV2ContextResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2ContextResource;
}

/**
* Updates the specified context.
*
* @param {string} name Required. The unique identifier of the context. Format:`projects/<Project ID>/agent/sessions/<Session ID>/contexts/<Context ID>`.
* @param {object} GoogleCloudDialogflowV2ContextResource An object containing the GoogleCloudDialogflowV2ContextResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2ContextResource object
*/
function projectsAgentSessionsContextsPatch(name,GoogleCloudDialogflowV2ContextResource,options){
  var path = buildUrl_("v2/"+name,options);
  var callOptions = {method:"PATCH",payload:JSON.stringify(GoogleCloudDialogflowV2ContextResource)};
  var GoogleCloudDialogflowV2ContextResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2ContextResource;
}

/**
* Creates a context.
*
* @param {string} parent Required. The session to create a context for.Format: `projects/<Project ID>/agent/sessions/<Session ID>`.
* @param {object} GoogleCloudDialogflowV2ContextResource An object containing the GoogleCloudDialogflowV2ContextResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned GoogleCloudDialogflowV2ContextResource object
*/
function projectsAgentSessionsContextsCreate(parent,GoogleCloudDialogflowV2ContextResource,options){
  var path = buildUrl_("v2/"+parent+"/contexts",options);
  var callOptions = {method:"POST",payload:JSON.stringify(GoogleCloudDialogflowV2ContextResource)};
  var GoogleCloudDialogflowV2ContextResource = CALL_(path,callOptions);
  return GoogleCloudDialogflowV2ContextResource;
}
