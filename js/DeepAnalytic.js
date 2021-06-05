var ObjectMerge=ObjectMerge||{};ObjectMerge.merge=function(array,options){function isMergeableObject(val){var nonNullObject=val&&typeof val==='object';return nonNullObject&&Object.prototype.toString.call(val)!=='[object RegExp]'&&Object.prototype.toString.call(val)!=='[object Date]'}
function emptyTarget(val){return Array.isArray(val)?[]:{}}
function cloneIfNecessary(value,optionsArgument){var clone=optionsArgument&&optionsArgument.clone===true;return(clone&&isMergeableObject(value))?deepmerge(emptyTarget(value),value,optionsArgument):value}
function defaultArrayMerge(target,source,optionsArgument){var destination=target.slice();source.forEach(function(e,i){if(typeof destination[i]==='undefined'){destination[i]=cloneIfNecessary(e,optionsArgument)}else if(isMergeableObject(e)){destination[i]=deepmerge(target[i],e,optionsArgument)}else if(target.indexOf(e)===-1){destination.push(cloneIfNecessary(e,optionsArgument))}});return destination}
function mergeObject(target,source,optionsArgument){var destination={};if(isMergeableObject(target)){Object.keys(target).forEach(function(key){destination[key]=cloneIfNecessary(target[key],optionsArgument)})}
Object.keys(source).forEach(function(key){if(!isMergeableObject(source[key])||!target[key]){destination[key]=cloneIfNecessary(source[key],optionsArgument)}else{destination[key]=deepmerge(target[key],source[key],optionsArgument)}});return destination}
function deepmerge(target,source,optionsArgument){var array=Array.isArray(source);var options=optionsArgument||{arrayMerge:defaultArrayMerge};var arrayMerge=options.arrayMerge||defaultArrayMerge;if(array){return Array.isArray(target)?arrayMerge(target,source,optionsArgument):cloneIfNecessary(source,optionsArgument)}else{return mergeObject(target,source,optionsArgument)}}
if(!Array.isArray(array)){throw new Error('first argument should be an array')}
return array.reduce(function(prev,next){return deepmerge(prev,next,options)},{})};
function isEmpty(mixedVar){var undef;var key;var i;var len;var emptyValues=[undef,null,false,0,'','0'];for(i=0,len=emptyValues.length;i<len;i++){if(mixedVar===emptyValues[i]){return true}}
if(typeof mixedVar==='object'){for(key in mixedVar){if(mixedVar.hasOwnProperty(key)){return false}}
return true}
return false}
var dotize=dotize||{};dotize.convert=function(obj,prefix,blacklist,whitelist,dotizeArrays){var newObj={};if(typeof dotizeArrays==='undefined'||dotizeArrays===null){dotizeArrays=false;}
if((!obj||typeof obj!=="object")&&!Array.isArray(obj)){if(prefix){newObj[prefix]=obj;return newObj;}else{return obj;}}
function isNumber(f){return!isNaN(parseInt(f));}
function isEmptyObj(obj){for(var prop in obj){if(Object.hasOwnProperty.call(obj,prop))
return false;}}
function getFieldName(field,prefix,isRoot,isArrayItem,isArray){if(isArray)
return(prefix?prefix:"")+(isNumber(field)?"["+field+"]":(isRoot?"":".")+field);else if(isArrayItem)
return(prefix?prefix:"")+"["+field+"]";else
return(prefix?prefix+".":"")+field;}
function addProp(name,prop){if((typeof whitelist!=='undefined'&&whitelist!==null)&&whitelist.indexOf(name)===-1){return;}
if((typeof blacklist!=='undefined'&&blacklist!==null)&&blacklist.indexOf(name)!==-1){return;}
newObj[name]=prop;}
return function recurse(o,p,isRoot){var isArrayItem=Array.isArray(o);for(var f in o){var currentProp=o[f];if(currentProp&&typeof currentProp==="object"){if(Array.isArray(currentProp)){if(dotizeArrays){newObj=recurse(currentProp,getFieldName(f,p,isRoot,false,true),isArrayItem);}
else{addProp(getFieldName(f,p,isRoot),currentProp);}}else{if(isArrayItem&&isEmptyObj(currentProp)===false){newObj=recurse(currentProp,getFieldName(f,p,isRoot,true));}else if(isEmptyObj(currentProp)===false){newObj=recurse(currentProp,getFieldName(f,p,isRoot));}else{}}}else{if(isArrayItem||isNumber(f)){addProp(getFieldName(f,p,isRoot,true),currentProp);}else{addProp(getFieldName(f,p,isRoot),currentProp);}}}
return newObj;}(obj,prefix,true);};
var StormExternalData=StormExternalData||{};StormExternalData.collector=(function(){var data={};var eventSequence=0;var isDebug=false;function debug(msg){if(isDebug===true){console.log(msg);}}
function checkEmptyString(mixedVar){if(isEmpty(mixedVar)){console.warn("You have to set non-empty variable in StormExternalData.collector");return false;}
if(typeof mixedVar!=="string"){console.warn("Variable provided in StormExternalData.collector must be string");return false;}
return true;}
function _addEntriesObject(scope,entries){debug('------------OBJECT---------------');debug(scope);debug(entries);debug('---------------------------');if(false===checkEmptyString(scope)){return;}
if(isEmpty(entries)){console.warn("Entries provided in StormExternalData.collector.addEntriesObject must not be empty. Scope: "+scope);return;}
if(data.hasOwnProperty(scope)){if(typeof ObjectMerge==='undefined'){Object.assign(data[scope],entries);}
else{data[scope]=ObjectMerge.merge([data[scope],entries],{arrayMerge:'dontMerge'});}}else{data[scope]=entries;}}
function _addEntry(scope,key,value){debug('------------ENTRY---------------');debug(scope);debug(key);debug(value);debug('---------------------------');if(false===checkEmptyString(scope)){return;}
if(false===checkEmptyString(key)){return;}
if(true===isEmpty(value)){console.warn("Value of entry provided in StormExternalData.collector._addEntry must not be empty. Scope: "+scope);return;}
var tmpObject={};tmpObject[key]=value;if(data.hasOwnProperty(scope)){Object.assign(data[scope],tmpObject);}else{data[scope]=tmpObject;}}
function _parseStormCollectorDataLayer(){if(isEmpty(StormCollectorDataLayer)){return;}
for(var i in StormCollectorDataLayer){if(StormCollectorDataLayer[i].hasOwnProperty('scope')&&StormCollectorDataLayer[i].hasOwnProperty('key')&&StormCollectorDataLayer[i].hasOwnProperty('value')){_addEntry(StormCollectorDataLayer[i].scope,StormCollectorDataLayer[i].key,StormCollectorDataLayer[i].value);}
else if(StormCollectorDataLayer[i].hasOwnProperty('scope')&&StormCollectorDataLayer[i].hasOwnProperty('data')){_addEntriesObject(StormCollectorDataLayer[i].scope,StormCollectorDataLayer[i].data);}else{console.warn("Unsupported entries object in StormExternalData.collector");console.warn(StormCollectorDataLayer[i])}}
StormCollectorDataLayer=[];}
if(typeof StormCollectorDataLayer!=='undefined'){_parseStormCollectorDataLayer();}
return{addEntry:function(scope,key,value){_addEntry(scope,key,value);},addEntriesObject:function(scope,entries){_addEntriesObject(scope,entries)},removeEntry:function(scope,key){if(false===checkEmptyString(scope)){return;}
if(false===checkEmptyString(key)){return;}
_parseStormCollectorDataLayer();delete data[scope][key];},removeScope:function(scope){if(false===checkEmptyString(scope)){return;}
_parseStormCollectorDataLayer();delete data[scope];},getEntry:function(scope,key){if(false===checkEmptyString(scope)){return;}
if(false===checkEmptyString(key)){return;}
_parseStormCollectorDataLayer();return data[scope][key];},getScopeEntries:function(scope){if(false===checkEmptyString(scope)){return;}
_parseStormCollectorDataLayer();return data[scope];},getEntries:function(){_parseStormCollectorDataLayer();return data;},sendData:function(type){if(typeof type==="undefined"){type=''}
var event=new CustomEvent('StormExternalDataSend',{detail:{eventType:type,eventSequence:eventSequence,collectorData:this.getEntries()}});document.body.dispatchEvent(event);eventSequence++;}}})();
var DeepExternalData=DeepExternalData||{};DeepExternalData.consumer=function(){var isDebug=false,isPaywallDataSent=false,isArticle=false,blacklist=['user.email'],datoToProcess=[];function debug(msg){if(isDebug===true){console.log('[Deep consumer] '+msg);}}
function isSafariBrowser(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent);}
function getDateFromString(value){if(isEmpty(value)){return'';}
if(!isSafariBrowser()){return new Date(value);}
return new Date(value.replace(/-/g,"/"));}
function addISODateFromValue(value){if(isEmpty(value)){return'';}
return getDateFromString(value).toISOString();}
function addUserPaywallData(collectorData){if(collectorData.hasOwnProperty('user')===false){debug('We have no user info');return collectorData;}
if(collectorData.user.hasOwnProperty('subscription')===false){debug('We have no user subscription info');return collectorData;}
if(collectorData.user.hasOwnProperty('state')!==true||'signed_in'!==collectorData.user.state){debug('User is not signed_in');return collectorData;}
var userCreatedAt='';if(collectorData.user.hasOwnProperty('user_cretaed_at')){userCreatedAt=collectorData.user.user_cretaed_at}
if(collectorData.user.hasOwnProperty('user_created_at')){userCreatedAt=collectorData.user.user_created_at}
var paywallData={'central-user-id':collectorData.user.central_user_id,'is-logged':(collectorData.user.central_user_id>0),'has-access':collectorData.user.subscription.active,'remaining-days':collectorData.user.subscription.remaining_days,'subscriber':(collectorData.user.subscription.remaining_days>0),'subscribed-until.date':addISODateFromValue(collectorData.user.subscription.subscribed_until),'auto-renewable':collectorData.user.subscription.auto_renewable,'active-products':collectorData.user.subscription.active_products,'old-piano-recurrence':collectorData.user.subscription.old_piano_recurrence,'user-registered-from.date':addISODateFromValue(userCreatedAt),'pay-method_id':collectorData.user.subscription.pay_method_id,'pay-method':collectorData.user.subscription.pay_method,'subscription-ordered-at.date':addISODateFromValue(collectorData.user.subscription.order_created_at),'price-no-vat':collectorData.user.subscription.price_no_vat,'subscribed-from.date':addISODateFromValue(collectorData.user.subscription.subscribed_from),'refs-url':collectorData.user.subscription.refs_url,'first-subscribed-from.date':addISODateFromValue(collectorData.user.subscription.first_subscribed_from),};Object.assign(collectorData['user'],{'paywall':paywallData});isPaywallDataSent=true;return collectorData;}
function transformDates(){if(isArticle){stormDeepClass.transformDate({dateSplit:{fromField:'sme.article.published_date',toField:'sme.article.published',mode:'merge',parts:'all'}});}
if(isPaywallDataSent){stormDeepClass.transformDate({dateSplit:{fromField:"sme.user.paywall.subscribed-until.date",toField:"sme.user.paywall.subscribed-until",mode:"merge"}});stormDeepClass.transformDate({dateSplit:{fromField:"sme.user.paywall.user-registered-from.date",toField:"sme.user.paywall.user-registered-from",mode:"merge"}});stormDeepClass.transformDate({dateSplit:{fromField:"sme.user.paywall.subscription-ordered-at.date",toField:"sme.user.paywall.subscription-ordered-at",mode:"merge"}});stormDeepClass.transformDate({dateSplit:{fromField:"sme.user.paywall.subscribed-from.date",toField:"sme.user.paywall.subscribed-from",mode:"merge"}});stormDeepClass.transformDate({dateSplit:{fromField:"sme.user.paywall.first-subscribed-from.date",toField:"sme.user.paywall.first-subscribed-from",mode:"merge"}});}}
function isDeepAvailable(){return stormDeepClass.initialized||false;}
function sendToDeepHandler(data){if(isDeepAvailable()){stormDeepClass.collectData(data);transformDates();return true;}
datoToProcess.push(data);}
function process(){if(datoToProcess.length==0){return;}
var lengthData=datoToProcess.length;for(var i=0;i<lengthData;i++){stormDeepClass.collectData(datoToProcess[i]);transformDates();}}
return{consume:function(ExternalDataEvent){debug('DeepExternalData consumer running');var collectorData=ExternalDataEvent.detail.collectorData;var serializedData=dotize.convert(collectorData,null,blacklist);if(isEmpty(collectorData)){return}
collectorData=addUserPaywallData(collectorData);if(collectorData.hasOwnProperty('article')===true){isArticle=true;}
if(serializedData.hasOwnProperty('page.version.project-name')===false){debug('We have no page info');return;}
collectorData={'sme':serializedData};debug(ExternalDataEvent.detail);serializedData=dotize.convert(collectorData,null,blacklist);sendToDeepHandler(serializedData);},process:process}}();document.body.addEventListener('StormExternalDataSend',function(e){DeepExternalData.consumer.consume(e);});
var GoogleTagManagerExternalData=GoogleTagManagerExternalData||{};dataLayer=window.dataLayer||[];GoogleTagManagerExternalData.consumer=function(){var isDebug=false;function debug(msg){if(isDebug===true){console.log(msg);}}
return{consume:function(ExternalDataEvent){var collectorData=ExternalDataEvent.detail.collectorData;if(isEmpty(collectorData)){return;}
debug('GoogleTagManagerExternalData');debug(collectorData);dataLayer.push(collectorData);}}}();document.body.addEventListener('StormExternalDataSend',function(e){GoogleTagManagerExternalData.consumer.consume(e);});
var ComposerExternalData=ComposerExternalData||{};if(typeof tp===typeof undefined){tp=window.tp||[];}
ComposerExternalData.consumer=function(){var isDataSent=false,serializedData,isDebug=false,blacklist=['user.email'];function debug(msg){if(isDebug===true){console.log(msg);}}
function pickOne(key){if(isEmpty(serializedData)){console.error('Variable serializedData is empty');}
if(false===serializedData.hasOwnProperty(key)){return'';}
var tmpProperty=serializedData[key];delete serializedData[key];return tmpProperty;}
function sanitizeData(data){if(data===null&&typeof data==="object"){return String(data);}
if(!isNaN(data)){return data.toString();}
if(Array.isArray(data)){return data.map(String);}
return data;}
return{consume:function(ExternalDataEvent){var collectorData=ExternalDataEvent.detail.collectorData;serializedData=dotize.convert(collectorData,null,blacklist);debug(serializedData);if(isEmpty(serializedData)){return}
if(serializedData.hasOwnProperty('user.state')===false){debug('We have no user info');return;}
if(isDataSent){debug('Data have been sent');return;}
tp.push(["setZone",pickOne('page.zone')]);tp.push(["setContentSection",pickOne('page.content-section')]);tp.push(["setContentAuthor",pickOne('author.name')]);tp.push(["setTags",['type:'+pickOne('page.type'),pickOne('article.keyword.tags')]]);tp.push(["setContentCreated",pickOne('article.published_date')]);tp.push(["setContentIsNative",false]);for(var propertyName in serializedData){var data=sanitizeData(serializedData[propertyName]);tp.push(["setCustomVariable",propertyName,data]);tp.push(["setCustomParam",propertyName,data]);}
tp.push(["init",function(){tp.experience.init()}]);isDataSent=true;}}}();document.body.addEventListener('StormExternalDataSend',function(e){ComposerExternalData.consumer.consume(e);});
var stormDeepClass=stormDeepClass||{},StormAnalyticDeepTracker=StormAnalyticDeepTracker||{};stormDeepClass.bufferCollectData=[];stormDeepClass.bufferRegisterEvent=[];stormDeepClass.registerEvent=function(eventType,data,tracker){if(typeof StormAnalyticDeepTracker!=='undefined'){tracker=StormAnalyticDeepTracker;}
if(typeof(tracker)!=='function'){this.bufferRegisterEvent.push({'eventType':eventType,'data':data});}else{if(data){tracker.event({'event.type':'sme-'+eventType,'sme':data});}else{tracker.event({'event.type':'sme-'+eventType});}}};stormDeepClass.collectData=function(data,tracker){if(typeof StormAnalyticDeepTracker!=='undefined'){tracker=StormAnalyticDeepTracker;}
if(typeof(tracker)!=='function'){this.bufferCollectData.push(data);}else{tracker(data);}};stormDeepClass.flush=function(){var lengthData=this.bufferCollectData.length;for(var i=0;i<lengthData;i++){var oneCollectData=this.bufferCollectData.shift();this.collectData(oneCollectData);}
var lengthEvent=this.bufferRegisterEvent.length;for(var i=0;i<lengthEvent;i++){var oneEvent=this.bufferRegisterEvent.shift();this.registerEvent(oneEvent.eventType,oneEvent.data);}};stormDeepClass.transformDate=function(datas,tracker){if(typeof StormAnalyticDeepTracker!=='undefined'){tracker=StormAnalyticDeepTracker;}
if(typeof(tracker)!=='undefined'){tracker.transform(datas);}};document.body.addEventListener('SmeDeepLibInitialized',function(e){if(e.detail.state==1){if(window.hasOwnProperty("deepTracker")&&window.deepTracker&&window.deepTracker.isInitialized()){var event=new CustomEvent('SmeDeepLibInitialized',{detail:{state:2,version:3,error:0}});document.body.dispatchEvent(event);}else{console.log("[deepTracker] is not initialized properly.");}}else if(e.detail.state==2){initStormAnalyticDeepTracker();}});function initStormAnalyticDeepTracker(){StormAnalyticDeepTracker=deepTracker.track(stormDeepKeys.streamKey,stormDeepKeys.writeKey)();stormDeepClass.initialized=true;StormAnalyticDeepTracker.options.trackconsent=true;stormDeepClass.flush();DeepExternalData.consumer.process();StormAnalyticDeepTracker.options.media=(typeof stormDeepConfig!='undefined'&&stormDeepConfig.options.media);if(typeof'undefined'!=stormDeepConfig&&stormDeepConfig.options.scrolldepth){StormAnalyticDeepTracker.options.scrolldepth={elements:[{"type":"article"},{"type":"body"},]};StormAnalyticDeepTracker.addElements([{"type":"article","selector":"article"},{"type":"body","selector":"body"}]);}
var event=new CustomEvent('SmeDeepLibInitialized',{detail:{state:3,version:3,error:0}});document.body.dispatchEvent(event);}
"use strict";!function(){for(var t,e;!(t=window.document.getElementsByTagName("head")[0]);)
window.document.getElementsByTagName("html")[0].appendChild(window.document.createElement("head"));"function"!=typeof window.document.querySelectorAll&&((e=window.document.createElement("script")).type="text/javascript",e.charset="utf-8",e.setAttribute("crossorigin","anonymous"),e.async=!0,e.src=(window.document.location.protocol||"https:")+"//api.deep.bi/v3/sizzle.js",t.appendChild(e)),(e=window.document.createElement("script")).type="text/javascript",e.onload=function(){var event=new CustomEvent('SmeDeepLibInitialized',{detail:{state:1,version:3,error:0}});document.body.dispatchEvent(event);},e.charset="utf-8",e.setAttribute("crossorigin","anonymous"),e.async=!0,e.src=(window.document.location.protocol||"https:")+"//api.deep.bi/v3/init.js",t.appendChild(e)}();