/**
 * Included in development builds built with Make.
 */
Config = (window.Config || {});

// Enables logging and determines how to handle errors.
Config.DEBUG = true;

// URL to a valid Critic REST API endpoint.
// If it's not a relative URL, the server has to give CORS access.
// As a temporary work-around for CORS Chromium-based browsers, give the flag
// --disable-web-security when starting your browser.
Config.API_ROOT = "https://critic-review.org/api/v1/";
