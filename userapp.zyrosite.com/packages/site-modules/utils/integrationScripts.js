// Facebook messenger.
const facebookMessengerScript = ({
    version,
    locale,
}) => `window.fbAsyncInit = function() {
			FB.init({
				xfbml            : true,
				version          : 'v${version}'
			});
		};
	
		(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = 'https://connect.facebook.net/${locale}/sdk/xfbml.customerchat.js';
		fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));`;

// Facebook pixel
const facebookPixelScript = (facebookPixelId) => `!function(f,b,e,v,n,t,s)
	{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window, document,'script',
	'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', '${facebookPixelId}');
	fbq('track', 'PageView');`;

const facebookPixelNoScript = (facebookPixelId) => `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1"/>`;

// Google tag manager
// If gtmQuery is present, we are inside builder and setting up Zyro specific GTM account.
const googleTagManagerScript = ({
    containerId,
    gtmQuery = '',
} = {}) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl${gtmQuery};f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','${containerId}');`;

const googleTagManagerNoScript = ({
    containerId,
    gtmQuery = '',
} = {}) => `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}${gtmQuery}"
		height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

// Google analytics
const googleAnalyticsScript = ({
    containerId
}) => `window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', '${containerId}');`;

const googleAnalyticsScriptAsync = (analyticsId) => `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;

// Hotjar
const hotjarScript = (hotjarId) => `(function(h,o,t,j,a,r){
		h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
		h._hjSettings={hjid:${hotjarId},hjsv:6};
		a=o.getElementsByTagName('head')[0];
		r=o.createElement('script');r.async=1;
		r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
		a.appendChild(r);
	})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

// JivoChat
const jivoChatScriptAsync = (widgetId) => `https://code-eu1.jivosite.com/widget/${widgetId}`;

export {
    facebookMessengerScript,
    facebookPixelScript,
    facebookPixelNoScript,
    googleTagManagerScript,
    googleTagManagerNoScript,
    googleAnalyticsScript,
    googleAnalyticsScriptAsync,
    hotjarScript,
    jivoChatScriptAsync,
};