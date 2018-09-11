'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};var plugins=null;document.addEventListener('DOMContentLoaded',function(event){fetch('https://plugins.dita-ot.org/_all.json').then(function(response){return response.json();}).then(init).catch(function(err){console.error('Failed to fetch plugins: '+err);});});function init(json){plugins=json;window.onpopstate=function(event){show(location.hash);};show(location.hash);}function show(hash){if(!!hash){var plugin=plugins[hash.substr(1)];details(plugin);}else{list(plugins);}}function list(json){var ul=document.createElement('ul');Object.values(json).filter(function(plugin){return!!plugin;}).sort(function(a,b){return a[0].name.localeCompare(b[0].name);}).forEach(function(plugin){var first=plugin[0];var li=document.createElement('li');var a=document.createElement('a');a.setAttribute('href','#'+first.name);a.setAttribute('style','font-weight:bold');a.appendChild(document.createTextNode(first.name));li.appendChild(a);var desc=document.createElement('p');desc.setAttribute('class','small');desc.appendChild(document.createTextNode(first.description));li.appendChild(desc);ul.appendChild(li);});var wrapper=document.getElementById('plugins');clear(wrapper);wrapper.appendChild(ul);}function details(vs){var versions=vs.slice().sort(compareVersion);var first=versions[versions.length-1];var div=document.createElement('div');var h2=document.createElement('h2');h2.appendChild(document.createTextNode(first.name));div.appendChild(h2);if(!!first.description){div.appendChild(elem('h3',{},'Keywords'));div.appendChild(elem('p',{},first.description));}if(!!first.keywords&&first.keywords.length!==0){div.appendChild(elem('h3',{},'Keywords'));div.appendChild(elem('p',{},first.keywords.join(', ')));}if(!!first.homepage){div.appendChild(elem('h3',{},'Homepage'));div.appendChild(elem('p',{},[elem('a',{href:first.homepage},getDomain(first.homepage))]));}div.appendChild(elem('h3',{},'Install'));div.appendChild(elem('p',{class:'small'},'DITA-OT 3.1 and newer'));div.appendChild(elem('pre',{},'dita --install '+first.name));div.appendChild(elem('p',{class:'small'},'DITA-OT 3.0 and older'));div.appendChild(elem('pre',{},'dita --install '+first.url));div.appendChild(elem('h3',{},'Versions'));div.appendChild(elem('ul',{},versions.map(function(version){return elem('li',{},version.vers);})));var wrapper=document.getElementById('plugins');clear(wrapper);append(wrapper,div);}function elem(name,attrs,content){var installBlock=document.createElement(name);Object.keys(attrs).forEach(function(key){installBlock.setAttribute(key,attrs[key]);});append(installBlock,content);return installBlock;}function append(parent,content){switch(typeof content==='undefined'?'undefined':_typeof(content)){case'string':parent.appendChild(document.createTextNode(content));break;case'object':if(Array.isArray(content)){content.forEach(function(c){parent.appendChild(c);});break;}default:parent.appendChild(content);}}function getDomain(homepage){return homepage.replace(/^\w+:\/\/([^\/]+?)(\/.*)?$/,'$1');}function clear(myNode){while(myNode.firstChild){myNode.removeChild(myNode.firstChild);}}function compareVersion(a,b){function parse(v){return v.split('.').map(function(v){return Number.parseInt(v);});}function compare(){var a=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var b=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;if(a===b){return 0;}else if(a<b){return 1;}else{return-1;}}function zip(as,bs){return as.map(function(e,i){return[e,bs[i]];});}try{var as=parse(a);var bs=parse(b);console.log(as,bs);console.log(zip(as,bs));console.log(zip(as,bs).map(function(pair){return compare(pair[0],pair[1]);}));return zip(as,bs).map(function(pair){return compare(pair[0],pair[1]);}).reduce(function(acc,curr){return acc!==0?acc:curr;},0);}catch(e){return 0;}}