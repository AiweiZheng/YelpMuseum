/*!
Dirty Forms jQuery Plugin | v2.0.0 | github.com/snikch/jquery.dirtyforms
(c) 2010-2015 Mal Curtis
License MIT
*/
!function(e,t,i,r){e.fn.on||(e.fn.on=function(e,t,i,r){return this.delegate(t,e,i,r)}),e.fn.dirtyForms=function(t){return n[t]?n[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist on jQuery.dirtyForms"):n.init.apply(this,arguments)};var n={init:function(r){var n={};return a.initialized||(e.extend(!0,e.DirtyForms,r),e(i).trigger("bind.dirtyforms",[u]),u.bind(t,i,n),a.initialized=!0),this.filter("form").not(":dirtylistening").each(function(){var t=e(this);t.find(e.DirtyForms.fieldSelector).each(function(){m(e(this))}),t.trigger("scan.dirtyforms"),u.bindForm(t,n)}),this},isDirty:function(t){var i=p(),r=e.DirtyForms.dirtyClass,n=!1;return this.each(function(o){var a=e(this),s=b(a,i);return a.hasClass(r)&&!s?(n=!0,!1):(a.find("."+r).each(function(){return b(e(this),i)?void 0:(n=!0,!1)}),n?!1:s||t||(e.each(e.DirtyForms.helpers,function(e,t){return t.isDirty&&t.isDirty(a,o)?(n=!0,!1):void 0}),!n)?void 0:!1)}),n},setClean:function(t,i){var r=function(){var t=e(this);m(t),C(t,!1)};return g(this,e.DirtyForms.fieldSelector,t).each(r).parents("form").trigger("setclean.dirtyforms",[t]),i?this:y(this,"setClean",t,p())},rescan:function(t,i){var r=function(){var t=e(this);v(t)||m(t),C(t,F(t))};return g(this,e.DirtyForms.fieldSelector,t).each(r).parents("form").trigger("rescan.dirtyforms",[t]),i?this:y(this,"rescan",t,p())}};e.extend(e.expr[":"],{dirty:function(t){var i=e(t);return i.hasClass(e.DirtyForms.dirtyClass)&&!i.is(":dirtyignored")},dirtylistening:function(t){return e(t).hasClass(e.DirtyForms.listeningClass)},dirtyignored:function(t){return b(e(t),!1)}}),e.DirtyForms={message:"You've made changes on this page which aren't saved. If you leave you will lose these changes.",dirtyClass:"dirty",listeningClass:"dirtylisten",ignoreClass:"dirtyignore",ignoreSelector:"",fieldSelector:"input:not([type='button'],[type='image'],[type='submit'],[type='reset'],[type='file'],[type='search']),select,textarea",helpers:[],dialog:!1};var o,a={initialized:!1,formStash:!1,dialogStash:!1,deciding:!1,decidingEvent:!1},s=function(e){return e.data.bindEscKey&&27==e.which||e.data.bindEnterKey&&13==e.which?f(e,!1):void 0},d=function(t){var r=t.staySelector,n=t.proceedSelector;""!==r&&e(r).unbind("click",f).click(f),""!==n&&e(n).unbind("click",l).click(l),(t.bindEscKey||t.bindEnterKey)&&e(i).unbind("keydown",s).keydown(t,s)},c=function(t,i){e.isFunction(e.DirtyForms.dialog.close)&&e.DirtyForms.dialog.close(t,i)},l=function(e){return f(e,!0)},f=function(t,r){if(a.deciding){if(t.preventDefault(),r===!0){var n=a.decidingEvent;e(i).trigger("proceed.dirtyforms",[n]),u.clearUnload(),c(r,!1),E(n)}else{e(i).trigger("stay.dirtyforms");var o=e.DirtyForms.dialog!==!1&&a.dialogStash!==!1&&e.isFunction(e.DirtyForms.dialog.unstash);c(r,o),o&&e.DirtyForms.dialog.unstash(a.dialogStash,t),e(i).trigger("afterstay.dirtyforms")}return a.deciding=a.decidingEvent=a.dialogStash=a.formStash=!1,!1}},u={bind:function(t,i,r){e(t).bind("beforeunload",r,u.onBeforeUnload),e(i).on("click",'a:not([target="_blank"])',r,u.onAnchorClick).on("submit","form",r,u.onSubmit)},bindForm:function(t,r){var n=e.DirtyForms,o="onpropertychange"in i.createElement("input"),a="change input"+(o?" keyup selectionchange cut paste":"");t.addClass(n.listeningClass).on("focus keydown",n.fieldSelector,r,u.onFocus).on(a,n.fieldSelector,r,u.onFieldChange).bind("reset",r,u.onReset)},onFocus:function(t){var i=e(t.target);v(i)||m(i)},onFieldChange:function(t){var i=e(t.target);"change"!==t.type?S(function(){D(i)},100):D(i)},onReset:function(t){var i=e(t.target).closest("form");setTimeout(function(){i.dirtyForms("setClean")},100)},onAnchorClick:function(e){k(e)},onSubmit:function(e){k(e)},onBeforeUnload:function(e){var t=k(e);return t&&a.doubleunloadfix!==!0&&(a.deciding=!1),a.doubleunloadfix=!0,setTimeout(function(){a.doubleunloadfix=!1},200),"string"==typeof t?(e.returnValue=t,t):void 0},onRefireClick:function(t){var i=new e.Event("click");e(t.target).trigger(i),i.isDefaultPrevented()||u.onRefireAnchorClick(t)},onRefireAnchorClick:function(i){var n=e(i.target).closest("a[href]").attr("href");n!==r&&(t.location.href=n)},clearUnload:function(){e(t).unbind("beforeunload",u.onBeforeUnload),t.onbeforeunload=null,e(i).trigger("beforeunload.dirtyforms")}},g=function(e,t,i){var r=e.filter(t).add(e.find(t));return i&&(r=r.not(":dirtyignored")),r},y=function(t,i,r,n){return t.each(function(t){var o=e(this);r&&b(o,n)||e.each(e.DirtyForms.helpers,function(e,n){n[i]&&n[i](o,t,r)})})},h=function(t){var i;return t.is("select")?(i="",t.find("option").each(function(){var t=e(this);t.is(":selected")&&(i.length>0&&(i+=","),i+=t.val())})):i=t.is(":checkbox,:radio")?t.is(":checked"):t.val(),i},m=function(e){e.data("df-orig",h(e));var t=e.data("df-orig")===r;e.data("df-empty",t)},v=function(e){return e.data("df-orig")!==r||e.data("df-empty")===!0},p=function(){var t=e.DirtyForms,i=t.ignoreSelector;return e.each(t.helpers,function(e,t){"ignoreSelector"in t&&(i.length>0&&(i+=","),i+=t.ignoreSelector)}),i},b=function(t,i){return i||(i=p()),t.is(i)||t.closest("."+e.DirtyForms.ignoreClass).length>0},F=function(e,t){return!v(e)||b(e,t)?!1:h(e)!=e.data("df-orig")},D=function(t,i){if(!b(t,i))if(t.is(":radio[name]")){var r=t.attr("name"),n=t.parents("form");n.find(":radio[name='"+r+"']").each(function(){var t=e(this);C(t,F(t,i))})}else C(t,F(t,i))},C=function(t,i){var r=e.DirtyForms.dirtyClass,n=t.parents("form");t.toggleClass(r,i);var o=i!==(n.hasClass(r)&&0===n.find(":dirty").length);o&&(n.toggleClass(r,i),i&&n.trigger("dirty.dirtyforms"),i||n.trigger("clean.dirtyforms"))},S=function(){var e=0;return function(t,i){clearTimeout(e),e=setTimeout(t,i)}}(),k=function(t){var r=e(t.target),n=t.type,s=e.DirtyForms;if(t.isDefaultPrevented())return!1;if("beforeunload"==n&&a.doubleunloadfix)return a.doubleunloadfix=!1,!1;if(r.is(":dirtyignored"))return u.clearUnload(),!1;if(a.deciding)return!1;if(!e("form:dirtylistening").dirtyForms("isDirty"))return u.clearUnload(),!1;if("submit"==n&&r.dirtyForms("isDirty"))return u.clearUnload(),!0;if(e(i).trigger("defer.dirtyforms"),"beforeunload"==n)return s.message;if(s.dialog){t.preventDefault(),t.stopImmediatePropagation(),a.deciding=!0,a.decidingEvent=t,e.isFunction(s.dialog.stash)&&(a.dialogStash=s.dialog.stash());var c=s.dialog.stashSelector;"string"==typeof c&&r.is("form")&&r.parents(c).length>0?a.formStash=r.clone(!0).hide():a.formStash=!1,o={proceed:!1,commit:function(e){return f(e,o.proceed)},bindEscKey:!0,bindEnterKey:!1,proceedSelector:"",staySelector:""},s.dialog.open(o,s.message,s.ignoreClass),d(o)}},E=function(t){if("click"===t.type)u.onRefireClick(t);else{var i;a.formStash?(i=a.formStash,e("body").append(i)):i=e(t.target).closest("form"),i.trigger(t.type)}}}(jQuery,window,document);
//# sourceMappingURL=jquery.dirtyforms.min.js.map