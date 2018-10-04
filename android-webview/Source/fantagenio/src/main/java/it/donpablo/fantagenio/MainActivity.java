package it.donpablo.fantagenio;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebChromeClient;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.widget.ProgressBar;

import it.donpablo.sibillo.webview.AdvancedWebView;

public class MainActivity extends Activity implements AdvancedWebView.Listener {

	private static final String PAGE_URL = "https://www.fantagenio.net/";
	private AdvancedWebView mWebView;
	private ProgressBar loader;
	private Stack history;

	@Override
	protected void onCreate(Bundle savedInstanceState) {

		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		mWebView = (AdvancedWebView) findViewById(R.id.webview);
		loader = (ProgressBar) findViewById(R.id.loader);
		history = new Stack();
		history.push(PAGE_URL);

		mWebView.setListener(this, this);
		mWebView.setGeolocationEnabled(false);
		mWebView.setMixedContentAllowed(true);
		mWebView.setCookiesEnabled(true);
		mWebView.setThirdPartyCookiesEnabled(true);
		//mWebView.setWebViewClient(new WebViewClient());

		mWebView.setWebViewClient(new WebViewClient() {
			@Override
			public boolean shouldOverrideUrlLoading(WebView view, String url) {
				history.push(url);
				mWebView.loadUrl(url);
				return true;
			}
		});

		mWebView.setWebChromeClient(new WebChromeClient());
		mWebView.addHttpHeader("X-Requested-With", "");
		mWebView.loadUrl(PAGE_URL);
	}

	@SuppressLint("NewApi")
	@Override
	protected void onResume() {
		super.onResume();
		mWebView.onResume();
		// ...
	}

	@SuppressLint("NewApi")
	@Override
	protected void onPause() {
		mWebView.onPause();
		// ...
		super.onPause();
	}

	@Override
	protected void onDestroy() {
		mWebView.onDestroy();
		// ...
		super.onDestroy();
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
		super.onActivityResult(requestCode, resultCode, intent);
		mWebView.onActivityResult(requestCode, resultCode, intent);
		// ...
	}

	@Override
	public void onBackPressed() {
		//if (!mWebView.onBackPressed()) { return; }
		history.pop();
		if (history.isEmpty()) {
			super.onBackPressed();
		} else {
			String prevUrl = (String) history.peek();
			mWebView.loadUrl(prevUrl);
		}
		//super.onBackPressed();
	}

	@Override
	public void onPageStarted(String url, Bitmap favicon) {
		mWebView.setVisibility(View.VISIBLE);
		loader.setVisibility(View.VISIBLE);
	}

	@Override
	public void onPageFinished(String url) {
		//mWebView.setVisibility(View.VISIBLE);
		loader.setVisibility(View.GONE);

	}

	@Override
	public void onPageError(int errorCode, String description, String failingUrl) {
		Toast.makeText(MainActivity.this, "onPageError(errorCode = "+errorCode+",  description = "+description+",  failingUrl = "+failingUrl+")", Toast.LENGTH_SHORT).show();
	}

	@Override
	public void onDownloadRequested(String url, String suggestedFilename, String mimeType, long contentLength, String contentDisposition, String userAgent) {
		Toast.makeText(MainActivity.this, "onDownloadRequested(url = "+url+",  suggestedFilename = "+suggestedFilename+",  mimeType = "+mimeType+",  contentLength = "+contentLength+",  contentDisposition = "+contentDisposition+",  userAgent = "+userAgent+")", Toast.LENGTH_LONG).show();

		/*if (AdvancedWebView.handleDownload(this, url, suggestedFilename)) {
			// download successfully handled
		}
		else {
			// download couldn't be handled because user has disabled download manager app on the device
		}*/
	}

	@Override
	public void onExternalPageRequest(String url) {
		Toast.makeText(MainActivity.this, "onExternalPageRequest(url = "+url+")", Toast.LENGTH_SHORT).show();
	}

}
