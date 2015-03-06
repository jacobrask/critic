/**
 * Included in production (installed) builds.
 */
Config = (window.Config || {});

// Enables logging and determines how to handle errors.
Config.DEBUG = false;

// URL to valid Critic REST API endpoint.
// If it's not a relative URL, the server has to give CORS access.
Config.API_ROOT = "/api/v1/";
