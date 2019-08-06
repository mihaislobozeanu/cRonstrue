!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.cronstrue=t():e.cronstrue=t()}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=n(2),o=Object.prototype.toString,s=function(){function e(t,n){this.expression=t,this.options=n,this.expressionParts=new Array(5),this.parsedExpression={},e.locales[n.locale]?this.i18n=e.locales[n.locale]:(console.warn("Locale '"+n.locale+"' could not be found; falling back to 'en'."),this.i18n=e.locales.en),void 0===n.use24HourTimeFormat&&(n.use24HourTimeFormat=this.i18n.use24HourTimeFormatByDefault())}return e.toString=function(t,n){var r=void 0===n?{}:n,i=r.throwExceptionOnParseError,o=void 0===i||i,s=r.verbose,a=void 0!==s&&s,u=r.dayOfWeekStartIndexZero,c=void 0===u||u,p=r.use24HourTimeFormat,f=r.locale;return new e(t,{throwExceptionOnParseError:o,verbose:a,dayOfWeekStartIndexZero:c,use24HourTimeFormat:p,locale:void 0===f?"en":f}).getFullDescription()},e.parse=function(t,n){var r=void 0===n?{}:n,i=r.throwExceptionOnParseError,o=void 0===i||i,s=r.verbose,a=void 0!==s&&s,u=r.dayOfWeekStartIndexZero,c=void 0===u||u,p=r.use24HourTimeFormat,f=r.locale,h=new e(t,{throwExceptionOnParseError:o,verbose:a,dayOfWeekStartIndexZero:c,use24HourTimeFormat:p,locale:void 0===f?"en":f});return{description:h.getFullDescription(),parsed:h.parsedExpression}},e.stringifyField=function(e){switch(e.type){case"every":return"*";case"everyX":return e.end?e.start+"-"+e.end+"/"+e.value:e.start+"/"+e.value;case"specific":return e.value.map(function(e){return"[object Object]"===o.call(e)?e.start+"-"+e.end:e}).join(",");case"between":return e.start+"-"+e.end;case"xthY":return e.value+"#"+e.xth;case"lastDayOfWeek":return e.value+"L";case"lastDay":return"L";case"lastWeekDay":return"LW";case"nearestWeekDay":return e.start+"W";case"beforeLastDay":return"L-"+e.value}return"?"},e.stringify=function(t){var n="",r="";return"none"!=t.seconds.type&&(n+=r+e.stringifyField(t.seconds),r=" "),n+=r+e.stringifyField(t.minutes),n+=(r=" ")+e.stringifyField(t.hours),n+=r+e.stringifyField(t.daysOfMonth),n+=r+e.stringifyField(t.months),n+=r+e.stringifyField(t.daysOfWeek),"none"!=t.years.type&&(n+=r+e.stringifyField(t.years)),n},e.initialize=function(t){e.specialCharacters=["/","-",",","*"],t.load(e.locales)},e.prototype.getFullDescription=function(){var e="";try{var t=new i.CronParser(this.expression,this.options.dayOfWeekStartIndexZero);this.expressionParts=t.parse();var n=this.getTimeOfDayDescription(),r=this.getDayOfMonthDescription(),o=this.getMonthDescription();e+=n+r+this.getDayOfWeekDescription()+o+this.getYearDescription(),e=(e=this.transformVerbosity(e,this.options.verbose)).charAt(0).toLocaleUpperCase()+e.substr(1)}catch(t){if(this.options.throwExceptionOnParseError)throw""+t;e=this.i18n.anErrorOccuredWhenGeneratingTheExpressionD()}return e},e.prototype.getTimeOfDayDescription=function(){var t=this.expressionParts[0],n=this.parsedExpression.seconds={},i=this.expressionParts[1],o=this.parsedExpression.minutes={},s=this.expressionParts[2],a=this.parsedExpression.hours={},u="";if(r.StringUtilities.containsAny(i,e.specialCharacters)||r.StringUtilities.containsAny(s,e.specialCharacters)||r.StringUtilities.containsAny(t,e.specialCharacters))if(t||!(i.indexOf("-")>-1)||i.indexOf(",")>-1||i.indexOf("/")>-1||r.StringUtilities.containsAny(s,e.specialCharacters))if(!t&&s.indexOf(",")>-1&&-1==s.indexOf("-")&&-1==s.indexOf("/")&&!r.StringUtilities.containsAny(i,e.specialCharacters)){var c=s.split(",");u+=this.i18n.at(),n.type="none",o.type="specific",o.value=[parseInt(i)],a.type="specific",a.value=[];for(var p=0;p<c.length;p++)u+=" ",a.value.push(parseInt(c[p])),u+=this.formatTime(c[p],i,""),p<c.length-2&&(u+=","),p==c.length-2&&(u+=this.i18n.spaceAnd())}else{var f=this.getSecondsDescription(n),h=this.getMinutesDescription(o),y=this.getHoursDescription(a);(u+=f).length>0&&h.length>0&&(u+=", "),(u+=h).length>0&&y.length>0&&(u+=", "),u+=y}else{var l=i.split("-");n.type="none",o.type="everyX",o.value=1,o.start=parseInt(l[0]),o.end=parseInt(l[1]),a.type="specific",a.value=[parseInt(s)],u+=r.StringUtilities.format(this.i18n.everyMinuteBetweenX0AndX1(),this.formatTime(s,l[0],""),this.formatTime(s,l[1],""))}else t?(n.type="specific",n.value=[parseInt(t)]):n.type="none",o.type="specific",o.value=[parseInt(i)],a.type="specific",a.value=[parseInt(s)],u+=this.i18n.atSpace()+this.formatTime(s,i,t);return u},e.prototype.getSecondsDescription=function(e){var t=this;return this.getSegmentDescription(this.expressionParts[0],this.i18n.everySecond(),function(e){return e},function(e){return r.StringUtilities.format(t.i18n.everyX0Seconds(),e)},function(e){return t.i18n.secondsX0ThroughX1PastTheMinute()},function(e){return"0"==e?"":parseInt(e)<20?t.i18n.atX0SecondsPastTheMinute():t.i18n.atX0SecondsPastTheMinuteGt20()||t.i18n.atX0SecondsPastTheMinute()},e)},e.prototype.getMinutesDescription=function(e){var t=this,n=this.expressionParts[0],i=this.expressionParts[2];return this.getSegmentDescription(this.expressionParts[1],this.i18n.everyMinute(),function(e){return e},function(e){return r.StringUtilities.format(t.i18n.everyX0Minutes(),e)},function(e){return t.i18n.minutesX0ThroughX1PastTheHour()},function(e){try{return"0"==e&&-1==i.indexOf("/")&&""==n?t.i18n.everyHour():parseInt(e)<20?t.i18n.atX0MinutesPastTheHour():t.i18n.atX0MinutesPastTheHourGt20()||t.i18n.atX0MinutesPastTheHour()}catch(e){return t.i18n.atX0MinutesPastTheHour()}},e)},e.prototype.getHoursDescription=function(e){var t=this,n=this.expressionParts[2];return this.getSegmentDescription(n,this.i18n.everyHour(),function(e){return t.formatTime(e,"0","")},function(e){return r.StringUtilities.format(t.i18n.everyX0Hours(),e)},function(e){return t.i18n.betweenX0AndX1()},function(e){return t.i18n.atX0()},e)},e.prototype.getDayOfWeekDescription=function(){var e=this,t=this.parsedExpression.daysOfWeek={},n=this.i18n.daysOfTheWeek(),i=null;return"*"==this.expressionParts[5]?(t.type="every",i=""):i=this.getSegmentDescription(this.expressionParts[5],this.i18n.commaEveryDay(),function(e){var r=e;return e.indexOf("#")>-1?(t.type="xthY",r=e.substr(0,e.indexOf("#")),t.value=parseInt(r)):e.indexOf("L")>-1&&(t.type="lastDayOfWeek",r=r.replace("L",""),t.value=parseInt(r)),n[parseInt(r)]},function(t){return 1==parseInt(t)?"":r.StringUtilities.format(e.i18n.commaEveryX0DaysOfTheWeek(),t)},function(t){return e.i18n.commaX0ThroughX1()},function(n){var r=null;if(n.indexOf("#")>-1){var i=null;switch(t.xth=n.substring(n.indexOf("#")+1)){case"1":i=e.i18n.first();break;case"2":i=e.i18n.second();break;case"3":i=e.i18n.third();break;case"4":i=e.i18n.fourth();break;case"5":i=e.i18n.fifth()}r=e.i18n.commaOnThe()+i+e.i18n.spaceX0OfTheMonth()}else if(n.indexOf("L")>-1)r=e.i18n.commaOnTheLastX0OfTheMonth();else{r="*"!=e.expressionParts[3]?e.i18n.commaAndOnX0():e.i18n.commaOnlyOnX0()}return r},t),i},e.prototype.getMonthDescription=function(){var e=this,t=this.parsedExpression.months={},n=this.i18n.monthsOfTheYear();return this.getSegmentDescription(this.expressionParts[4],"",function(e){return n[parseInt(e)-1]},function(t){return 1==parseInt(t)?"":r.StringUtilities.format(e.i18n.commaEveryX0Months(),t)},function(t){return e.i18n.commaMonthX0ThroughMonthX1()||e.i18n.commaX0ThroughX1()},function(t){return e.i18n.commaOnlyInX0()},t)},e.prototype.getDayOfMonthDescription=function(){var e=this,t=this.parsedExpression.daysOfMonth={},n=null,i=this.expressionParts[3];switch(i){case"L":t.type="lastDay",n=this.i18n.commaOnTheLastDayOfTheMonth();break;case"WL":case"LW":t.type="lastWeekDay",n=this.i18n.commaOnTheLastWeekdayOfTheMonth();break;default:var o=i.match(/(\d{1,2}W)|(W\d{1,2})/);if(o){t.type="nearestWeekDay";var s=t.start=parseInt(o[0].replace("W","")),a=1==s?this.i18n.firstWeekday():r.StringUtilities.format(this.i18n.weekdayNearestDayX0(),s.toString());n=r.StringUtilities.format(this.i18n.commaOnTheX0OfTheMonth(),a);break}var u=i.match(/L-(\d{1,2})/);if(u){t.type="beforeLastDay";var c=t.value=u[1];n=r.StringUtilities.format(this.i18n.commaDaysBeforeTheLastDayOfTheMonth(),c);break}if("*"==i&&"*"!=this.expressionParts[5])return t.type="every","";n=this.getSegmentDescription(i,this.i18n.commaEveryDay(),function(t){return"L"==t?e.i18n.lastDay():t},function(t){return"1"==t?e.i18n.commaEveryDay():e.i18n.commaEveryX0Days()},function(t){return e.i18n.commaBetweenDayX0AndX1OfTheMonth()},function(t){return e.i18n.commaOnDayX0OfTheMonth()},t)}return n},e.prototype.getYearDescription=function(){var e=this,t=this.parsedExpression.years={};return this.getSegmentDescription(this.expressionParts[6],"",function(e){return/^\d+$/.test(e)?new Date(parseInt(e),1).getFullYear().toString():e},function(t){return r.StringUtilities.format(e.i18n.commaEveryX0Years(),t)},function(t){return e.i18n.commaYearX0ThroughYearX1()||e.i18n.commaX0ThroughX1()},function(t){return e.i18n.commaOnlyInX0()},t)},e.prototype.getSegmentDescription=function(e,t,n,i,o,s,a){var u=this,c=null,p=a||{};if(e)if("*"===e)p.type="every",c=t;else if(r.StringUtilities.containsAny(e,["/","-",","]))if(e.indexOf("/")>-1){var f=e.split("/");if(p.type="everyX",p.value=parseInt(f[1]),p.start=parseInt("*"==f[0]?"0":f[0]),c=r.StringUtilities.format(i(f[1]),n(f[1])),f[0].indexOf("-")>-1)0!=(d=this.generateBetweenSegmentDescription(f[0],o,n,p)).indexOf(", ")&&(c+=", "),c+=d;else if(!r.StringUtilities.containsAny(f[0],["*",","])){var h=r.StringUtilities.format(s(f[0]),n(f[0]));h=h.replace(", ",""),c+=r.StringUtilities.format(this.i18n.commaStartingX0(),h)}}else if(e.indexOf(",")>-1){f=e.split(",");p.type="specific",p.value=[];for(var y="",l=0;l<f.length;l++)if(l>0&&f.length>2&&(y+=",",l<f.length-1&&(y+=" ")),l>0&&f.length>1&&(l==f.length-1||2==f.length)&&(y+=this.i18n.spaceAnd()+" "),f[l].indexOf("-")>-1){var d,m={};p.value.push(m),y+=d=(d=this.generateBetweenSegmentDescription(f[l],function(e){return u.i18n.commaX0ThroughX1()},n,m)).replace(", ","")}else p.value.push(parseInt(f[l])),y+=n(f[l]);c=r.StringUtilities.format(s(e),y)}else e.indexOf("-")>-1&&(p.type="between",c=this.generateBetweenSegmentDescription(e,o,n,p),p.start==p.end&&(p.type="specific",p.value=[p.start],delete p.start,delete p.end));else p.type="specific",p.value=[parseInt(e)],c=r.StringUtilities.format(s(e),n(e));else c="",p.type="none";return c},e.prototype.generateBetweenSegmentDescription=function(e,t,n,i){var o="",s=i||{},a=e.split("-"),u=n(a[0]);s.start=parseInt(a[0]);var c=n(a[1]);s.end=parseInt(a[1]),c=c.replace(":00",":59");var p=t(e);return o+=r.StringUtilities.format(p,u,c)},e.prototype.formatTime=function(e,t,n){var r=parseInt(e),i="",o=!1;this.options.use24HourTimeFormat||(i=(o=this.i18n.setPeriodBeforeTime&&this.i18n.setPeriodBeforeTime())?this.getPeriod(r)+" ":" "+this.getPeriod(r),r>12&&(r-=12),0===r&&(r=12));var s=t,a="";return n&&(a=":"+("00"+n).substring(n.length)),""+(o?i:"")+("00"+r.toString()).substring(r.toString().length)+":"+("00"+s.toString()).substring(s.toString().length)+a+(o?"":i)},e.prototype.transformVerbosity=function(e,t){return t||(e=(e=(e=(e=e.replace(new RegExp(", "+this.i18n.everyMinute(),"g"),"")).replace(new RegExp(", "+this.i18n.everyHour(),"g"),"")).replace(new RegExp(this.i18n.commaEveryDay(),"g"),"")).replace(/\, ?$/,"")),e},e.prototype.getPeriod=function(e){return e>=12?this.i18n.pm&&this.i18n.pm()||"PM":this.i18n.am&&this.i18n.am()||"AM"},e.locales={},e}();t.ExpressionDescriptor=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){}return e.format=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return e.replace(/%s/g,function(){return t.shift()})},e.containsAny=function(e,t){return t.some(function(t){return e.indexOf(t)>-1})},e}();t.StringUtilities=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){void 0===t&&(t=!0),this.expression=e,this.dayOfWeekStartIndexZero=t}return e.prototype.parse=function(){var e=this.extractParts(this.expression);return this.normalize(e),this.validate(e),e},e.prototype.extractParts=function(e){if(!this.expression)throw new Error("Expression is empty");var t=e.trim().split(/[ ]+/);if(t.length<5)throw new Error("Expression has only "+t.length+" part"+(1==t.length?"":"s")+". At least 5 parts are required.");if(5==t.length)t.unshift(""),t.push("");else if(6==t.length)/\d{4}$/.test(t[5])?t.unshift(""):t.push("");else if(t.length>7)throw new Error("Expression has "+t.length+" parts; too many!");return t},e.prototype.normalize=function(e){var t=this;if(e[3]=e[3].replace("?","*"),e[5]=e[5].replace("?","*"),e[2]=e[2].replace("?","*"),0==e[0].indexOf("0/")&&(e[0]=e[0].replace("0/","*/")),0==e[1].indexOf("0/")&&(e[1]=e[1].replace("0/","*/")),0==e[2].indexOf("0/")&&(e[2]=e[2].replace("0/","*/")),0==e[3].indexOf("1/")&&(e[3]=e[3].replace("1/","*/")),0==e[4].indexOf("1/")&&(e[4]=e[4].replace("1/","*/")),0==e[5].indexOf("1/")&&(e[5]=e[5].replace("1/","*/")),0==e[6].indexOf("1/")&&(e[6]=e[6].replace("1/","*/")),e[5]=e[5].replace(/(^\d)|([^#\/\s]\d)/g,function(e){var n=e.replace(/\D/,""),r=n;return t.dayOfWeekStartIndexZero?"7"==n&&(r="0"):r=(parseInt(n)-1).toString(),e.replace(n,r)}),"L"==e[5]&&(e[5]="6"),"?"==e[3]&&(e[3]="*"),e[3].indexOf("W")>-1&&(e[3].indexOf(",")>-1||e[3].indexOf("-")>-1))throw new Error("The 'W' character can be specified only when the day-of-month is a single day, not a range or list of days.");var n={SUN:0,MON:1,TUE:2,WED:3,THU:4,FRI:5,SAT:6};for(var r in n)e[5]=e[5].replace(new RegExp(r,"gi"),n[r].toString());var i={JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12};for(var o in i)e[4]=e[4].replace(new RegExp(o,"gi"),i[o].toString());"0"==e[0]&&(e[0]=""),/\*|\-|\,|\//.test(e[2])||!/\*|\//.test(e[1])&&!/\*|\//.test(e[0])||(e[2]+="-"+e[2]);for(var s=0;s<e.length;s++)if("*/1"==e[s]&&(e[s]="*"),e[s].indexOf("/")>-1&&!/^\*|\-|\,/.test(e[s])){var a=null;switch(s){case 4:a="12";break;case 5:a="6";break;case 6:a="9999";break;default:a=null}if(null!=a){var u=e[s].split("/");e[s]=u[0]+"-"+a+"/"+u[1]}}},e.prototype.validate=function(e){this.assertNoInvalidCharacters("DOW",e[5]),this.assertNoInvalidCharacters("DOM",e[3])},e.prototype.assertNoInvalidCharacters=function(e,t){var n=t.match(/[A-KM-VX-Z]+/gi);if(n&&n.length)throw new Error(e+" part contains invalid values: '"+n.toString()+"'")},e}();t.CronParser=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){}return e.prototype.atX0SecondsPastTheMinuteGt20=function(){return null},e.prototype.atX0MinutesPastTheHourGt20=function(){return null},e.prototype.commaMonthX0ThroughMonthX1=function(){return null},e.prototype.commaYearX0ThroughYearX1=function(){return null},e.prototype.use24HourTimeFormatByDefault=function(){return!1},e.prototype.anErrorOccuredWhenGeneratingTheExpressionD=function(){return"An error occured when generating the expression description.  Check the cron expression syntax."},e.prototype.everyMinute=function(){return"every minute"},e.prototype.everyHour=function(){return"every hour"},e.prototype.atSpace=function(){return"At "},e.prototype.everyMinuteBetweenX0AndX1=function(){return"Every minute between %s and %s"},e.prototype.at=function(){return"At"},e.prototype.spaceAnd=function(){return" and"},e.prototype.everySecond=function(){return"every second"},e.prototype.everyX0Seconds=function(){return"every %s seconds"},e.prototype.secondsX0ThroughX1PastTheMinute=function(){return"seconds %s through %s past the minute"},e.prototype.atX0SecondsPastTheMinute=function(){return"at %s seconds past the minute"},e.prototype.everyX0Minutes=function(){return"every %s minutes"},e.prototype.minutesX0ThroughX1PastTheHour=function(){return"minutes %s through %s past the hour"},e.prototype.atX0MinutesPastTheHour=function(){return"at %s minutes past the hour"},e.prototype.everyX0Hours=function(){return"every %s hours"},e.prototype.betweenX0AndX1=function(){return"between %s and %s"},e.prototype.atX0=function(){return"at %s"},e.prototype.commaEveryDay=function(){return", every day"},e.prototype.commaEveryX0DaysOfTheWeek=function(){return", every %s days of the week"},e.prototype.commaX0ThroughX1=function(){return", %s through %s"},e.prototype.first=function(){return"first"},e.prototype.second=function(){return"second"},e.prototype.third=function(){return"third"},e.prototype.fourth=function(){return"fourth"},e.prototype.fifth=function(){return"fifth"},e.prototype.commaOnThe=function(){return", on the "},e.prototype.spaceX0OfTheMonth=function(){return" %s of the month"},e.prototype.lastDay=function(){return"the last day"},e.prototype.commaOnTheLastX0OfTheMonth=function(){return", on the last %s of the month"},e.prototype.commaOnlyOnX0=function(){return", only on %s"},e.prototype.commaAndOnX0=function(){return", and on %s"},e.prototype.commaEveryX0Months=function(){return", every %s months"},e.prototype.commaOnlyInX0=function(){return", only in %s"},e.prototype.commaOnTheLastDayOfTheMonth=function(){return", on the last day of the month"},e.prototype.commaOnTheLastWeekdayOfTheMonth=function(){return", on the last weekday of the month"},e.prototype.commaDaysBeforeTheLastDayOfTheMonth=function(){return", %s days before the last day of the month"},e.prototype.firstWeekday=function(){return"first weekday"},e.prototype.weekdayNearestDayX0=function(){return"weekday nearest day %s"},e.prototype.commaOnTheX0OfTheMonth=function(){return", on the %s of the month"},e.prototype.commaEveryX0Days=function(){return", every %s days"},e.prototype.commaBetweenDayX0AndX1OfTheMonth=function(){return", between day %s and %s of the month"},e.prototype.commaOnDayX0OfTheMonth=function(){return", on day %s of the month"},e.prototype.commaEveryHour=function(){return", every hour"},e.prototype.commaEveryX0Years=function(){return", every %s years"},e.prototype.commaStartingX0=function(){return", starting %s"},e.prototype.daysOfTheWeek=function(){return["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},e.prototype.monthsOfTheYear=function(){return["January","February","March","April","May","June","July","August","September","October","November","December"]},e}();t.en=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),i=n(5);r.ExpressionDescriptor.initialize(new i.enLocaleLoader),t.default=r.ExpressionDescriptor;var o=r.ExpressionDescriptor.toString;t.toString=o;var s=r.ExpressionDescriptor.parse;t.parse=s;var a=r.ExpressionDescriptor.stringify;t.stringify=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(3),i=function(){function e(){}return e.prototype.load=function(e){e.en=new r.en},e}();t.enLocaleLoader=i}])});