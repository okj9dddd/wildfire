"use strict";!function(){var e=firebase.initializeApp(window._wildfire.config.databaseConfig).database();Vue.use(VueFire),Vue.prototype.$i18next=i18next,Vue.prototype.$moment=moment,Vue.component("wf-reply-area",{template:'\n      <div class="wf-form" :class="{ \'wf-reply\': isReply }">\n        <img class="wf-avatar" :src="!user ? \'./static/wildfire-logo.svg\' : user.photoURL">\n        <div class="wf-textarea-wrapper">\n          <span class="wf-textarea-placeholder" :class="{ inactive: !shouldShowPlaceholder }" @click="startEditing">\n            {{$i18next.t(\'textarea/placeholder\')}}\n          </span>\n          <div class="wf-textarea" :class="{ hasContent: !shouldShowPlaceholder || isReply }" :id="\'wf-textarea-\'+_uid" @blur="didEndEditing" contenteditable></div>\n          <div class="wf-post-button-wrapper" :class="{ inactive: shouldShowPlaceholder && !isReply }">\n            <button class="wf-post-button" @click="postComment">{{$i18next.t(\'button/post\')}}</button>\n          </div>\n        </div>\n      </div>\n    ',props:["user","replyToComment","rootComment"],data:function(){return{shouldShowPlaceholder:!0,isReply:!1}},computed:{textarea:function(){return document.getElementById("wf-textarea-"+this._uid)}},created:function(){this.isReply=!!this.replyToComment},methods:{startEditing:function(){this.textarea.focus(),this.shouldShowPlaceholder=!1},didEndEditing:function(){""===this.textarea.textContent&&(this.shouldShowPlaceholder=!0)},postComment:function(){var t=this.textarea.textContent;this.textarea.textContent="";var n=window._wildfire.config,i=n.siteId,s=n.pageURL;if(""!==t.trim()){var o=new Date,a=null===this.user?this.$i18next.t("text/anonymousUser"):this.user.displayName,r=null===this.user?"anonymous":this.user.uid,l=o.toISOString(),c=this.isReply?null:-1*o.getTime(),d=null,m=null,u="";console.log(this.replyToComment),console.log(this.rootComment),this.isReply&&(d=this.replyToComment[".key"],m=this.replyToComment.author),u=this.rootComment?"/sites/"+i+"/"+btoa(s)+"/comments/"+this.rootComment[".key"]+"/replies":this.isReply?"/sites/"+i+"/"+btoa(s)+"/comments/"+this.replyToComment[".key"]+"/replies":"/sites/"+i+"/"+btoa(s)+"/comments";var h={author:a,authorUid:r,date:l,order:c,content:t,replyToId:d,replyToAuthor:m};return console.log(h),void e.ref(u).push().set(h)}}}}),Vue.component("wf-comment-card",{template:'\n      <li class="wf-comment-item" :class="{ reply: comment.parentId !== undefined }">\n        <div class="wf-comment-avatar">\n          <img :src="avatarURL">\n        </div>\n        <div class="wf-comment-body">\n          <header>\n            <div class="header-content">\n              <span class="username"><a href="#">{{authorUsername}}</a></span>\n              <span class="parent-link" v-if="comment.replyToAuthor !== undefined">➦ {{comment.replyToAuthor}}</span>\n              <span class="meta">· {{$moment(comment.date).fromNow()}}</span>\n            </div>\n            <div class="header-menu">\n              <span class="menu-button" \n                :class="{ active: isHeaderMenuShowing }" \n                @click="isHeaderMenuShowing = !isHeaderMenuShowing"\n              >▼</span>\n              <ul class="menu-dropdown" :class="{ inactive: !isHeaderMenuShowing }">\n                <li>\n                  <a href="#">report</a>\n                </li>\n                <li>\n                  <a href="#">ban user</a>\n                </li>\n              </ul>\n            </div>\n          </header>\n          <div class="wf-comment-content">{{comment.content}}</div>\n          <footer>\n            <span class="like-count" :class="{ inactive: likeUserIdList.indexOf(currentUserId) === -1}">\n              {{likeUserIdList.length || \'\'}}\n            </span>\n            <a href="#" \n              :class="{ \n                inactive: likeUserIdList.indexOf(currentUserId) === -1,\n                disabled: !user\n              }"\n              :id="\'like-\'+comment[\'.key\']"\n              @click="toogleLikeComment"\n            > 👍</a>\n            <span class="separator"></span>\n            <span class="dislike-count inactive" :class="{ inactive: dislikeUserIdList.indexOf(currentUserId) === -1}">\n              {{dislikeUserIdList.length || \'\'}}\n            </span>\n            <a href="#"\n              :class="{ \n                inactive: dislikeUserIdList.indexOf(currentUserId) === -1,\n                disabled: !user\n              }"\n              :id="\'dislike-\'+comment[\'.key\']"\n              @click="toogleDislikeComment"\n            >👎</a>\n            <span class="bullet">·</span>\n            <a class="wf-button wf-reply-button" :class="{ active: isReplying }" href="#" @click="isReplying = !isReplying">\n              {{isReplying ? $i18next.t(\'button/cancel\') : $i18next.t(\'button/reply\')}}\n            </a>\n            <template v-if="user && (user.uid === comment.uid)">\n              <span class="bullet">·</span>\n              <a class="wf-button wf-delete-button" href="#">{{$i18next.t(\'button/delete\')}}</a>\n            </template>\n          </footer>\n          <wf-reply-area v-if="!parentComment"\n            v-show="isReplying" \n            :user="user" \n            :reply-to-comment="comment">\n          </wf-reply-area>\n          <wf-reply-area v-if="!!parentComment"\n            v-show="isReplying" \n            :user="user" \n            :reply-to-comment="comment"\n            :root-comment="parentComment">\n          </wf-reply-area>\n        </div>\n      </li>\n    ',props:["comment","parentComment","user"],data:function(){return{isHeaderMenuShowing:!1,isReplying:!1,avatarURL:window._wildfire.config.defaultAvatar,authorUsername:""}},computed:{likeUserIdList:function(){return void 0===this.comment.likes?[]:Object.keys(this.comment.likes)},dislikeUserIdList:function(){return void 0===this.comment.dislikes?[]:Object.keys(this.comment.dislikes)},currentUserId:function(){return this.user?this.user.uid:"null"}},created:function(){this.authorUsername=this.$i18next.t("text/anonymousUser");var e=this.comment.authorUid;if(e!==window._wildfire.config.anonymousUserId){var t=this;window._wildfire.userApp.database().ref("users/"+e).once("value").then(function(e){var n=e.val();n&&(n.photoURL&&(t.avatarURL=n.photoURL),n.displayName&&(t.authorUsername=n.displayName))})}},methods:{toogleLikeComment:function(){if(this.user){this.comment.likes;var t=window._wildfire.config,n=t.siteId,i=t.pageURL,s=this.comment[".key"],o=this.user.uid;if(-1===this.likeUserIdList.indexOf(o)){var a=this.parentComment?"/sites/"+n+"/"+btoa(i)+"/comments/"+this.parentComment[".key"]+"/replies/"+s+"/likes/"+o:"/sites/"+n+"/"+btoa(i)+"/comments/"+this.comment[".key"]+"/likes/"+o;console.log(a);var r=-1!==this.dislikeUserIdList.indexOf(o);e.ref(a).set((new Date).toISOString()).then(function(){r&&document.getElementById("dislike-"+s).click()})}else{var l=this.parentComment?"/sites/"+n+"/"+btoa(i)+"/comments/"+this.parentComment[".key"]+"/replies/"+s+"/likes/"+o:"/sites/"+n+"/"+btoa(i)+"/comments/"+this.comment[".key"]+"/likes/"+o;console.log(l),e.ref(l).remove()}}},toogleDislikeComment:function(){if(this.user){this.comment.dislikes;var t=window._wildfire.config,n=t.siteId,i=t.pageURL,s=this.comment[".key"],o=this.user.uid;if(-1===this.dislikeUserIdList.indexOf(o)){var a=this.parentComment?"/sites/"+n+"/"+btoa(i)+"/comments/"+this.parentComment[".key"]+"/replies/"+s+"/dislikes/"+o:"/sites/"+n+"/"+btoa(i)+"/comments/"+this.comment[".key"]+"/dislikes/"+o,r=-1!==this.likeUserIdList.indexOf(o);e.ref(a).set((new Date).toISOString()).then(function(){r&&document.getElementById("like-"+s).click()})}else{var l=this.parentComment?"/sites/"+n+"/"+btoa(i)+"/comments/"+this.parentComment[".key"]+"/replies/"+s+"/dislikes":"/sites/"+n+"/"+btoa(i)+"/comments/"+this.comment[".key"]+"/dislikes";console.log(l),e.ref(l).remove()}}}}});new Vue({el:"#wild-fire",data:{isLoaded:!1,userApp:null,firebaseGitHubProvider:null,config:null,user:null},computed:{userData:function(){if(!this.user)return null;var e=this.user;return{uid:e.uid,photoURL:e.photoURL,displayName:e.displayName}}},watch:{user:function(e){window._wildfire.currentUser=e}},firebase:function(){return{comments:e.ref("sites/"+window._wildfire.config.siteId+"/"+btoa(window._wildfire.config.pageURL)+"/comments").orderByChild("order")}},created:function(){var e=this;this.config=window._wildfire.config,this.userApp=window._wildfire.userApp,"firebase"===this.config.database&&(this.firebaseGitHubProvider=new firebase.auth.GithubAuthProvider,console.log("Firebase Github Provider Initialized.")),this.userApp.auth().onAuthStateChanged(function(t){t?e.user=t:(e.user=null,console.log("Firebase user sign out."))})},mounted:function(){this.isLoaded=!0,document.getElementById("wf-loading-modal").style.display="none"},methods:{signInWithGitHub:function(){var e=this;this.userApp.auth().signInWithPopup(this.firebaseGitHubProvider).then(function(t){t.credential.accessToken;var n=t.user,i=n.uid,s=n.displayName,o=n.email,a=n.photoURL;e.userApp.database().ref("users/"+i).once("value").then(function(t){console.log("snapshot",t.val());var r=t.val(),l=[];r&&(l=r.sites||[]),e.userApp.database().ref("users/"+i).set({displayName:s,email:o,photoURL:a,sites:l}),e.user=n})}).catch(function(e){e.code;var t=e.message,n=e.email;e.credential;console.log(t),console.log(n)})},signOut:function(){this.user=null,"firebase"===this.config.database&&this.userApp.auth().signOut().then(function(){console.log("Firebase User Sign Out.")}).catch(function(e){console.log(e)})}}})}();