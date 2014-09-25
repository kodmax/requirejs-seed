define(['./hash-matcher', './navigator', './controller-driver', './standard-not-found-controller'], function(HashMatcher, Navigator, ControllerDriver, standardNotFoundController) {
	'use strict';

	/**
	 * @namespace app-router
	 */
	
	/**
	 * Application Router.
	 * @class app-router.AppRouter
	 */
	var AppRouter = function (options) {
		var patterns = [];
		var hashMatcher = new HashMatcher(patterns);

		/**
		 * @callback app-router.route-controller
		 * @this app-router.ControllerContext
		 */
		
		/**
		 * @method app-router.AppRouter#addRoute
		 * @param pattern
		 * @param {app-router.route-controller} controller
		 * @returns app-router.AppRouter
		 */
		this.addRoute = function (pattern, controller) {
			patterns.push({pattern: pattern, controller: controller, options: { trivialController: true }});
			return this;
		};
		
		/**
		 * @method app-router.AppRouter#addController
		 * @param pattern
		 * @param {app-router.route-controller} controller
		 * @returns app-router.AppRouter
		 */
		this.addController = function (pattern, controller) {
			patterns.push({pattern: pattern, controller: controller});
			return this;
		};
		
		/**
		 * @method app-router.AppRouter#setNotFoundRoute
		 * @param {app-router.route-controller} controller
		 * @returns app-router.AppRouter
		 */
		this.setNotFoundRoute = function (controller) {
			notFoundController = controller;
			return this;
		};
	
		
		var navigator;
		/**
		 * @method app-router.AppRouter#start
		 * @returns app-router.AppRouter
		 */
		this.start = function () {
			if (!navigator) {
				navigator = new Navigator({
					
					create: function (hash) {
						var match = hashMatcher.match(hash);
						if (match) {
							return new ControllerDriver(hash, match.controller, match.params, match.options);
							
						} else {
							return new ControllerDriver(hash, standardNotFoundController);
						}
					},
					
					navin: function (driver) {
						driver.navin();
					},
					
					navout: function (driver) {
						driver.navout();
					},
					
					dispose: function (driver) {
						driver.dispose();
					}
					
				});
			}
			return this;
		};
	};
	
	return AppRouter;
});