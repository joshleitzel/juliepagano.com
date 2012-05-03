var GitHubTimelineApi,__bind=function(e,a){return function(){return e.apply(a,arguments)}};
GitHubTimelineApi=function(){function e(){}e.prototype._strongify=function(a){return"<strong>"+a+"</strong>"};e.prototype.formatAsTimeAgo=function(a){var b;b=((new Date).getTime()-a.getTime())/1E3;a=Math.floor(b/86400);if(isNaN(a)||a<0)return null;if(a===0)if(b<60)return"just now";else if(b<120)return"1 minute ago";else if(b<3600)return""+Math.floor(b/60)+" minutes ago";else if(b<7200)return"1 hour ago";else{if(b<86400)return""+Math.floor(b/3600)+" hours ago"}else return a===1?"Yesterday":a<7?""+
a+" days ago":""+Math.ceil(a/7)+" weeks ago"};e.prototype._parseGitHubEvent=function(a){var b,c,d,f,e;e=(a.url!=null?a.url:void 0)||(((f=a.payload)!=null?f.url:void 0)!=null?a.payload.url:void 0)||"https://github.com";e=e.replace("github.com//","github.com/");f=(new Date((a.created_at!=null?a.created_at:void 0)||0)).valueOf();a.repository!=null&&(c=this._strongify(""+a.repository.owner+"/"+a.repository.name));switch(a.type){case "CreateEvent":b="https://github.com/images/modules/dashboard/news/create.png";
switch(a.payload.object){case "repository":d="created repo "+c;break;case "tag":d="created tag "+this._strongify(a.payload.object_name)+" at "+c;break;case "branch":d="created branch "+this._strongify(a.payload.object_name)+" at "+c}break;case "MemberEvent":switch(a.payload.action){case "added":b="https://github.com/images/modules/dashboard/news/member_add.png",d="added "+this._strongify(a.payload.member)+" to "+c}break;case "PushEvent":a=a.payload.ref.substr(a.payload.ref.lastIndexOf("/")+1);b="https://github.com/images/modules/dashboard/news/push.png";
d="pushed to "+this._strongify(a)+" at "+c;break;case "ForkApplyEvent":b="https://github.com/images/modules/dashboard/news/merge.png";d="merged to "+c;break;case "ForkEvent":b="https://github.com/images/modules/dashboard/news/fork.png";d="forked "+c;break;case "WatchEvent":switch(a.payload.action){case "started":b="https://github.com/images/modules/dashboard/news/watch_started.png";d="started watching "+c;break;case "stopped":b="https://github.com/images/modules/dashboard/news/watch_stopped.png",
d="stopped watching "+c}break;case "FollowEvent":d=null;break;case "IssuesEvent":case "PullRequestEvent":switch(a.payload.action){case "opened":case "reopened":b="https://github.com/images/modules/dashboard/news/issues_opened.png";d="opened issued on "+c;break;case "closed":b="https://github.com/images/modules/dashboard/news/issues_closed.png",d="closed issue on "+c}break;case "GistEvent":b="https://github.com/images/modules/dashboard/news/gist.png";switch(a.payload.action){case "create":d="created "+
this._strongify(a.payload.name);break;case "update":d="updated "+this._strongify(a.payload.name);break;case "fork":d="forked "+this._strongify(a.payload.name)}break;case "WikiEvent":case "GollumEvent":b="https://github.com/images/modules/dashboard/news/wiki.png";switch(a.payload.action){case "created":d="created a wiki page on "+c;break;case "edited":d="edited a wiki page on "+c}break;case "CommitCommentEvent":b="https://github.com/images/modules/dashboard/news/comment.png";d="commented on "+c;break;
case "DeleteEvent":b="https://github.com/images/modules/dashboard/news/delete.png";switch(a.payload.ref_type){case "branch":d="deleted branch "+this._strongify(a.payload.ref)+" at "+c}break;case "PublicEvent":b="https://github.com/images/modules/dashboard/news/public.png";d="open sourced "+c;break;case "DownloadEvent":d=null}return d!=null?[e,b,f,d]:[]};e.prototype._parseGitHubTimeline=function(a,b){var c,d,e,g;d=[];e=0;for(g=a.length;e<g;e++)c=a[e],c=this._parseGitHubEvent(c),c.length&&d.push(c);
return b(d)};e.prototype.getTimelineForUser=function(a,b){jQuery.ajaxSetup({cache:!0});return jQuery.getJSON("https://github.com/"+a+".json?callback=?",__bind(function(a){return this._parseGitHubTimeline(a,b)},this))};e.prototype.getUserIdForUser=function(a,b){jQuery.ajaxSetup({cache:!0});return jQuery.getJSON("https://github.com/api/v2/json/user/show/"+a+"?callback=?",__bind(function(a){return b(a.user.id)},this))};return e}();
jQuery.fn.githubTimelineWidget=function(e){var a,b,c,d,f,g,i;a={username:"timeline",limit:5,user_id:!0};d=document.getElementsByTagName("script");f=0;for(g=d.length;f<g;f++)if(b=d[f],(i=b.src)!=null&&i.match(/github-timeline-widget\.js/)){c=b.src.replace(/github-timeline-widget\.js.*$/,"");break}c!=null&&jQuery("<link/>").attr("rel","stylesheet").attr("type","text/css").attr("href",c+"github-timeline-widget.css").prependTo("head");return this.each(function(){var b,d,c,f;c=this;b=jQuery(this);c.opts=
jQuery.extend({},a,e);jQuery("<a>").attr("class","github-timeline-header").attr("href","https://github.com/"+c.opts.username).text(""+c.opts.username+" on GitHub").appendTo(b);f=jQuery("<ul>").attr("class","github-timeline-events").appendTo(b);d=new GitHubTimelineApi;d.getTimelineForUser(c.opts.username,function(a){var e,h,g,i,l,j,k,m;i=c.opts.limit;k=0;for(m=a.length;k<m;k++){h=a[k];if(i--===0)break;g=h[0];e=h[1];j=h[2];l=h[3];h=jQuery("<li>").attr("class","github-timeline-event").appendTo(f);g=
jQuery("<a>").attr("href",g);e&&jQuery("<img>").attr("src",e).appendTo(h).wrap(jQuery("<div>").attr("class","github-timeline-event-icon")).wrap(g);e=jQuery("<div>").attr("class","github-timeline-event-text").html(l).appendTo(h).wrapInner(g);j&&(j=d.formatAsTimeAgo(new Date(j)))&&jQuery("<div>").attr("class","github-timeline-event-time").text(j).appendTo(e)}return jQuery("<a>").attr("class","github-timeline-source-link").attr("href","https://github.com/alindeman/github-timeline-widget").text("GitHub Timeline Widget").appendTo(b)});
if(c.opts.user_id)return d.getUserIdForUser(c.opts.username,function(a){jQuery("<br/>").appendTo(".github-timeline-header");return jQuery("<span>").attr("class","github-timeline-header-user-id").text("(user #"+a+")").appendTo(".github-timeline-header")})})};
