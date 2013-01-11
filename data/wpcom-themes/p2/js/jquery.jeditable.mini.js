
(function($){$.fn.editable=function(target,options){var settings={target:target,name:'value',id:'id',type:'text',width:'auto',height:'auto',event:'click',onblur:'cancel',loadtype:'GET',loadtext:'Loading...',placeholder:'Click to edit',loaddata:{},submitdata:{}};if(options){$.extend(settings,options);}
var plugin=$.editable.types[settings.type].plugin||function(){};var submit=$.editable.types[settings.type].submit||function(){};var buttons=$.editable.types[settings.type].buttons||$.editable.types['defaults'].buttons;var content=$.editable.types[settings.type].content||$.editable.types['defaults'].content;var element=$.editable.types[settings.type].element||$.editable.types['defaults'].element;var reset=$.editable.types[settings.type].reset||$.editable.types['defaults'].reset;var callback=settings.callback||function(){};if(!$.isFunction($(this)[settings.event])){$.fn[settings.event]=function(fn){return fn?this.bind(settings.event,fn):this.trigger(settings.event);}}
$(this).attr('title',settings.tooltip);settings.autowidth='auto'==settings.width;settings.autoheight='auto'==settings.height;return this.each(function(){var self=this;var savedwidth=$(self).width();var savedheight=$(self).height();if(!$.trim($(this).html())){$(this).html(settings.placeholder);}
$(this)[settings.event](function(e){if(self.editing){return;}
if(0==$(self).width()){settings.width=savedwidth;settings.height=savedheight;}else{if(settings.width!='none'){settings.width=settings.autowidth?$(self).width():settings.width;}
if(settings.height!='none'){settings.height=settings.autoheight?$(self).height():settings.height;}}
if($(this).html().toLowerCase().replace(/;/,'')==settings.placeholder.toLowerCase().replace(/;/,'')){$(this).html('');}
self.editing=true;self.revert=$(self).html();$(self).html('');var form=$('<form/>');if(settings.cssclass){if('inherit'==settings.cssclass){form.attr('class',$(self).attr('class'));}else{form.attr('class',settings.cssclass);}}
if(settings.style){if('inherit'==settings.style){form.attr('style',$(self).attr('style'));form.css('display',$(self).css('display'));}else{form.attr('style',settings.style);}}
var input=element.apply(form,[settings,self]);var input_content;if(settings.loadurl){var t=setTimeout(function(){input.disabled=true;content.apply(form,[settings.loadtext,settings,self]);},100);var loaddata={};loaddata[settings.id]=self.id;if($.isFunction(settings.loaddata)){$.extend(loaddata,settings.loaddata.apply(self,[self.revert,settings]));}else{$.extend(loaddata,settings.loaddata);}
$.ajax({type:settings.loadtype,url:settings.loadurl,data:loaddata,async:false,success:function(result){window.clearTimeout(t);input_content=result;input.disabled=false;}});}else if(settings.data){input_content=settings.data;if($.isFunction(settings.data)){input_content=settings.data.apply(self,[self.revert,settings]);}}else{input_content=self.revert;}
content.apply(form,[input_content,settings,self]);input.attr('name',settings.name);buttons.apply(form,[settings,self]);$(self).append(form);plugin.apply(form,[settings,self]);$(':input:visible:enabled:first',form).focus();if(settings.select){input.select();}
input.keydown(function(e){if(e.keyCode==27){e.preventDefault();reset.apply(form,[settings,self]);}});var t;if('cancel'==settings.onblur){input.blur(function(e){t=setTimeout(function(){reset.apply(form,[settings,self]);},500);});}else if('submit'==settings.onblur){input.blur(function(e){form.submit();});}else if($.isFunction(settings.onblur)){input.blur(function(e){settings.onblur.apply(self,[input.val(),settings]);});}else{input.blur(function(e){});}
form.submit(function(e){if(t){clearTimeout(t);}
e.preventDefault();if(false!==submit.apply(form,[settings,self])){if($.isFunction(settings.target)){var str=settings.target.apply(self,[input.val(),settings]);$(self).html(str);self.editing=false;callback.apply(self,[self.innerHTML,settings]);if(!$.trim($(self).html())){$(self).html(settings.placeholder);}}else{var submitdata={};submitdata[settings.name]=input.val();submitdata[settings.id]=self.id;if($.isFunction(settings.submitdata)){$.extend(submitdata,settings.submitdata.apply(self,[self.revert,settings]));}else{$.extend(submitdata,settings.submitdata);}
if('PUT'==settings.method){submitdata['_method']='put';}
$(self).html(settings.indicator);$.post(settings.target,submitdata,function(str){$(self).html(str);self.editing=false;callback.apply(self,[self.innerHTML,settings]);if(!$.trim($(self).html())){$(self).html(settings.placeholder);}});}}
return false;});});this.reset=function(){$(self).html(self.revert);self.editing=false;if(!$.trim($(self).html())){$(self).html(settings.placeholder);}}});};$.editable={types:{defaults:{element:function(settings,original){var input=$('<input type="hidden">');$(this).append(input);return(input);},content:function(string,settings,original){$(':input:first',this).val(string);},reset:function(settings,original){original.reset();},buttons:function(settings,original){var form=this;if(settings.submit){if(settings.submit.match(/>$/)){var submit=$(settings.submit).click(function(){if(submit.attr("type")!="submit"){form.submit();}});}else{var submit=$('<button type="submit">');submit.html(settings.submit);}
$(this).append(submit);}
if(settings.cancel){if(settings.cancel.match(/>$/)){var cancel=$(settings.cancel);}else{var cancel=$('<button type="cancel">');cancel.html(settings.cancel);}
$(this).append(cancel);$(cancel).click(function(event){if($.isFunction($.editable.types[settings.type].reset)){var reset=$.editable.types[settings.type].reset;}else{var reset=$.editable.types['defaults'].reset;}
reset.apply(form,[settings,original]);return false;});}}},text:{element:function(settings,original){var input=$('<input>');if(settings.width!='none'){input.width(settings.width);}
if(settings.height!='none'){input.height(settings.height);}
input.attr('autocomplete','off');$(this).append(input);return(input);}},textarea:{element:function(settings,original){var textarea=$('<textarea>');if(settings.rows){textarea.attr('rows',settings.rows);}else{textarea.height(settings.height);}
if(settings.cols){textarea.attr('cols',settings.cols);}else{textarea.width(settings.width);}
$(this).append(textarea);return(textarea);}},select:{element:function(settings,original){var select=$('<select>');$(this).append(select);return(select);},content:function(string,settings,original){if(String==string.constructor){eval('var json = '+string);for(var key in json){if(!json.hasOwnProperty(key)){continue;}
if('selected'==key){continue;}
var option=$('<option>').val(key).append(json[key]);$('select',this).append(option);}}
$('select',this).children().each(function(){if($(this).val()==json['selected']||$(this).text()==original.revert){$(this).attr('selected','selected');};});}}},addInputType:function(name,input){$.editable.types[name]=input;}};})(jQuery);