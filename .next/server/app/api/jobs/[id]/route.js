"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/jobs/[id]/route";
exports.ids = ["app/api/jobs/[id]/route"];
exports.modules = {

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2F%5Bid%5D%2Froute&page=%2Fapi%2Fjobs%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2F%5Bid%5D%2Froute.ts&appDir=D%3A%5CWorkspace%5CWorkspace%5CCareers%5Ccareers-rookie-ninja-frontend%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CWorkspace%5CWorkspace%5CCareers%5Ccareers-rookie-ninja-frontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2F%5Bid%5D%2Froute&page=%2Fapi%2Fjobs%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2F%5Bid%5D%2Froute.ts&appDir=D%3A%5CWorkspace%5CWorkspace%5CCareers%5Ccareers-rookie-ninja-frontend%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CWorkspace%5CWorkspace%5CCareers%5Ccareers-rookie-ninja-frontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Workspace_Workspace_Careers_careers_rookie_ninja_frontend_src_app_api_jobs_id_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/jobs/[id]/route.ts */ \"(rsc)/./src/app/api/jobs/[id]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/jobs/[id]/route\",\n        pathname: \"/api/jobs/[id]\",\n        filename: \"route\",\n        bundlePath: \"app/api/jobs/[id]/route\"\n    },\n    resolvedPagePath: \"D:\\\\Workspace\\\\Workspace\\\\Careers\\\\careers-rookie-ninja-frontend\\\\src\\\\app\\\\api\\\\jobs\\\\[id]\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Workspace_Workspace_Careers_careers_rookie_ninja_frontend_src_app_api_jobs_id_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/jobs/[id]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZqb2JzJTJGJTVCaWQlNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmpvYnMlMkYlNUJpZCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmpvYnMlMkYlNUJpZCU1RCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDV29ya3NwYWNlJTVDV29ya3NwYWNlJTVDQ2FyZWVycyU1Q2NhcmVlcnMtcm9va2llLW5pbmphLWZyb250ZW5kJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1EJTNBJTVDV29ya3NwYWNlJTVDV29ya3NwYWNlJTVDQ2FyZWVycyU1Q2NhcmVlcnMtcm9va2llLW5pbmphLWZyb250ZW5kJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNxRDtBQUNsSTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2NhcmVlcnMtcm9va2llLW5pbmphLz8xZmNlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXFdvcmtzcGFjZVxcXFxXb3Jrc3BhY2VcXFxcQ2FyZWVyc1xcXFxjYXJlZXJzLXJvb2tpZS1uaW5qYS1mcm9udGVuZFxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxqb2JzXFxcXFtpZF1cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2pvYnMvW2lkXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2pvYnMvW2lkXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvam9icy9baWRdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcV29ya3NwYWNlXFxcXFdvcmtzcGFjZVxcXFxDYXJlZXJzXFxcXGNhcmVlcnMtcm9va2llLW5pbmphLWZyb250ZW5kXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGpvYnNcXFxcW2lkXVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvam9icy9baWRdL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2F%5Bid%5D%2Froute&page=%2Fapi%2Fjobs%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2F%5Bid%5D%2Froute.ts&appDir=D%3A%5CWorkspace%5CWorkspace%5CCareers%5Ccareers-rookie-ninja-frontend%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CWorkspace%5CWorkspace%5CCareers%5Ccareers-rookie-ninja-frontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/jobs/[id]/route.ts":
/*!****************************************!*\
  !*** ./src/app/api/jobs/[id]/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PATCH: () => (/* binding */ PATCH)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./src/lib/mongodb.ts\");\n/* harmony import */ var _models_Job__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/models/Job */ \"(rsc)/./src/models/Job.ts\");\n\n\n\n\n\nasync function GET(_, { params }) {\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__.connectDB)();\n    const job = await _models_Job__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findById(params.id).lean();\n    if (!job) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Not found\"\n    }, {\n        status: 404\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(job);\n}\nasync function PATCH(req, { params }) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session || session.user.role !== \"hr\") {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__.connectDB)();\n    const body = await req.json();\n    const job = await _models_Job__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findByIdAndUpdate(params.id, body, {\n        new: true\n    });\n    if (!job) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Not found\"\n    }, {\n        status: 404\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(job);\n}\nasync function DELETE(_, { params }) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session || session.user.role !== \"hr\") {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__.connectDB)();\n    await _models_Job__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findByIdAndDelete(params.id);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9qb2JzL1tpZF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQXVEO0FBQ1g7QUFDSjtBQUNDO0FBQ1g7QUFFdkIsZUFBZUssSUFBSUMsQ0FBYyxFQUFFLEVBQUVDLE1BQU0sRUFBOEI7SUFDOUUsTUFBTUosdURBQVNBO0lBQ2YsTUFBTUssTUFBTSxNQUFNSixtREFBR0EsQ0FBQ0ssUUFBUSxDQUFDRixPQUFPRyxFQUFFLEVBQUVDLElBQUk7SUFDOUMsSUFBSSxDQUFDSCxLQUFLLE9BQU9SLHFEQUFZQSxDQUFDWSxJQUFJLENBQUM7UUFBRUMsT0FBTztJQUFZLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBQ3pFLE9BQU9kLHFEQUFZQSxDQUFDWSxJQUFJLENBQUNKO0FBQzNCO0FBRU8sZUFBZU8sTUFBTUMsR0FBZ0IsRUFBRSxFQUFFVCxNQUFNLEVBQThCO0lBQ2xGLE1BQU1VLFVBQVUsTUFBTWhCLDJEQUFnQkEsQ0FBQ0Msa0RBQVdBO0lBQ2xELElBQUksQ0FBQ2UsV0FBVyxRQUFTQyxJQUFJLENBQVNDLElBQUksS0FBSyxNQUFNO1FBQ25ELE9BQU9uQixxREFBWUEsQ0FBQ1ksSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBZSxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNwRTtJQUVBLE1BQU1YLHVEQUFTQTtJQUNmLE1BQU1pQixPQUFPLE1BQU1KLElBQUlKLElBQUk7SUFDM0IsTUFBTUosTUFBTSxNQUFNSixtREFBR0EsQ0FBQ2lCLGlCQUFpQixDQUFDZCxPQUFPRyxFQUFFLEVBQUVVLE1BQU07UUFBRUUsS0FBSztJQUFLO0lBQ3JFLElBQUksQ0FBQ2QsS0FBSyxPQUFPUixxREFBWUEsQ0FBQ1ksSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBWSxHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUN6RSxPQUFPZCxxREFBWUEsQ0FBQ1ksSUFBSSxDQUFDSjtBQUMzQjtBQUVPLGVBQWVlLE9BQU9qQixDQUFjLEVBQUUsRUFBRUMsTUFBTSxFQUE4QjtJQUNqRixNQUFNVSxVQUFVLE1BQU1oQiwyREFBZ0JBLENBQUNDLGtEQUFXQTtJQUNsRCxJQUFJLENBQUNlLFdBQVcsUUFBU0MsSUFBSSxDQUFTQyxJQUFJLEtBQUssTUFBTTtRQUNuRCxPQUFPbkIscURBQVlBLENBQUNZLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQWUsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDcEU7SUFFQSxNQUFNWCx1REFBU0E7SUFDZixNQUFNQyxtREFBR0EsQ0FBQ29CLGlCQUFpQixDQUFDakIsT0FBT0csRUFBRTtJQUNyQyxPQUFPVixxREFBWUEsQ0FBQ1ksSUFBSSxDQUFDO1FBQUVhLFNBQVM7SUFBSztBQUMzQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhcmVlcnMtcm9va2llLW5pbmphLy4vc3JjL2FwcC9hcGkvam9icy9baWRdL3JvdXRlLnRzP2FkYzkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xyXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJ1xyXG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGgnXHJcbmltcG9ydCB7IGNvbm5lY3REQiB9IGZyb20gJ0AvbGliL21vbmdvZGInXHJcbmltcG9ydCBKb2IgZnJvbSAnQC9tb2RlbHMvSm9iJ1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChfOiBOZXh0UmVxdWVzdCwgeyBwYXJhbXMgfTogeyBwYXJhbXM6IHsgaWQ6IHN0cmluZyB9IH0pIHtcclxuICBhd2FpdCBjb25uZWN0REIoKVxyXG4gIGNvbnN0IGpvYiA9IGF3YWl0IEpvYi5maW5kQnlJZChwYXJhbXMuaWQpLmxlYW4oKVxyXG4gIGlmICgham9iKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ05vdCBmb3VuZCcgfSwgeyBzdGF0dXM6IDQwNCB9KVxyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihqb2IpXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQQVRDSChyZXE6IE5leHRSZXF1ZXN0LCB7IHBhcmFtcyB9OiB7IHBhcmFtczogeyBpZDogc3RyaW5nIH0gfSkge1xyXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKVxyXG4gIGlmICghc2Vzc2lvbiB8fCAoc2Vzc2lvbi51c2VyIGFzIGFueSkucm9sZSAhPT0gJ2hyJykge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0sIHsgc3RhdHVzOiA0MDEgfSlcclxuICB9XHJcblxyXG4gIGF3YWl0IGNvbm5lY3REQigpXHJcbiAgY29uc3QgYm9keSA9IGF3YWl0IHJlcS5qc29uKClcclxuICBjb25zdCBqb2IgPSBhd2FpdCBKb2IuZmluZEJ5SWRBbmRVcGRhdGUocGFyYW1zLmlkLCBib2R5LCB7IG5ldzogdHJ1ZSB9KVxyXG4gIGlmICgham9iKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ05vdCBmb3VuZCcgfSwgeyBzdGF0dXM6IDQwNCB9KVxyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihqb2IpXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBERUxFVEUoXzogTmV4dFJlcXVlc3QsIHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGlkOiBzdHJpbmcgfSB9KSB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpXHJcbiAgaWYgKCFzZXNzaW9uIHx8IChzZXNzaW9uLnVzZXIgYXMgYW55KS5yb2xlICE9PSAnaHInKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KVxyXG4gIH1cclxuXHJcbiAgYXdhaXQgY29ubmVjdERCKClcclxuICBhd2FpdCBKb2IuZmluZEJ5SWRBbmREZWxldGUocGFyYW1zLmlkKVxyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IHRydWUgfSlcclxufSJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJjb25uZWN0REIiLCJKb2IiLCJHRVQiLCJfIiwicGFyYW1zIiwiam9iIiwiZmluZEJ5SWQiLCJpZCIsImxlYW4iLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJQQVRDSCIsInJlcSIsInNlc3Npb24iLCJ1c2VyIiwicm9sZSIsImJvZHkiLCJmaW5kQnlJZEFuZFVwZGF0ZSIsIm5ldyIsIkRFTEVURSIsImZpbmRCeUlkQW5kRGVsZXRlIiwic3VjY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/jobs/[id]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mongodb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mongodb */ \"(rsc)/./src/lib/mongodb.ts\");\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/models/User */ \"(rsc)/./src/models/User.ts\");\n\n\n\n\nconst authOptions = {\n    session: {\n        strategy: \"jwt\"\n    },\n    pages: {\n        signIn: \"/auth/login\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) return null;\n                await (0,_mongodb__WEBPACK_IMPORTED_MODULE_2__.connectDB)();\n                const user = await _models_User__WEBPACK_IMPORTED_MODULE_3__[\"default\"].findOne({\n                    email: credentials.email.toLowerCase()\n                });\n                if (!user) return null;\n                const valid = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(credentials.password, user.password);\n                if (!valid) return null;\n                return {\n                    id: user._id.toString(),\n                    name: user.name,\n                    email: user.email,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.role = user.role;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.id = token.id;\n                session.user.role = token.role;\n            }\n            return session;\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ2lFO0FBQ3BDO0FBQ1E7QUFDTDtBQUV6QixNQUFNSSxjQUErQjtJQUMxQ0MsU0FBUztRQUFFQyxVQUFVO0lBQU07SUFDM0JDLE9BQU87UUFDTEMsUUFBUTtJQUNWO0lBQ0FDLFdBQVc7UUFDVFQsMkVBQW1CQSxDQUFDO1lBQ2xCVSxNQUFNO1lBQ05DLGFBQWE7Z0JBQ1hDLE9BQVU7b0JBQUVDLE9BQU87b0JBQVlDLE1BQU07Z0JBQVE7Z0JBQzdDQyxVQUFVO29CQUFFRixPQUFPO29CQUFZQyxNQUFNO2dCQUFXO1lBQ2xEO1lBQ0EsTUFBTUUsV0FBVUwsV0FBVztnQkFDekIsSUFBSSxDQUFDQSxhQUFhQyxTQUFTLENBQUNELGFBQWFJLFVBQVUsT0FBTztnQkFFMUQsTUFBTWIsbURBQVNBO2dCQUNmLE1BQU1lLE9BQU8sTUFBTWQsb0RBQUlBLENBQUNlLE9BQU8sQ0FBQztvQkFBRU4sT0FBT0QsWUFBWUMsS0FBSyxDQUFDTyxXQUFXO2dCQUFHO2dCQUN6RSxJQUFJLENBQUNGLE1BQU0sT0FBTztnQkFFbEIsTUFBTUcsUUFBUSxNQUFNbkIsdURBQWMsQ0FBQ1UsWUFBWUksUUFBUSxFQUFFRSxLQUFLRixRQUFRO2dCQUN0RSxJQUFJLENBQUNLLE9BQU8sT0FBTztnQkFFbkIsT0FBTztvQkFDTEUsSUFBT0wsS0FBS00sR0FBRyxDQUFDQyxRQUFRO29CQUN4QmQsTUFBT08sS0FBS1AsSUFBSTtvQkFDaEJFLE9BQU9LLEtBQUtMLEtBQUs7b0JBQ2pCYSxNQUFPUixLQUFLUSxJQUFJO2dCQUNsQjtZQUNGO1FBQ0Y7S0FDRDtJQUNGQyxXQUFXO1FBQ1YsTUFBTUMsS0FBSSxFQUFFQyxLQUFLLEVBQUVYLElBQUksRUFBRTtZQUN2QixJQUFJQSxNQUFNO2dCQUNSVyxNQUFNTixFQUFFLEdBQUtMLEtBQUtLLEVBQUU7Z0JBQ3BCTSxNQUFNSCxJQUFJLEdBQUcsS0FBY0EsSUFBSTtZQUNqQztZQUNBLE9BQU9HO1FBQ1Q7UUFDQSxNQUFNdkIsU0FBUSxFQUFFQSxPQUFPLEVBQUV1QixLQUFLLEVBQUU7WUFDOUIsSUFBSXZCLFFBQVFZLElBQUksRUFBRTtnQkFDZlosUUFBUVksSUFBSSxDQUFTSyxFQUFFLEdBQUtNLE1BQU1OLEVBQUU7Z0JBQ25DakIsUUFBUVksSUFBSSxDQUFTUSxJQUFJLEdBQUdHLE1BQU1ILElBQUk7WUFDMUM7WUFDQSxPQUFPcEI7UUFDVDtJQUNGO0FBQ0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhcmVlcnMtcm9va2llLW5pbmphLy4vc3JjL2xpYi9hdXRoLnRzPzY2OTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJ1xyXG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzJ1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJ1xyXG5pbXBvcnQgeyBjb25uZWN0REIgfSBmcm9tICcuL21vbmdvZGInXHJcbmltcG9ydCBVc2VyIGZyb20gJ0AvbW9kZWxzL1VzZXInXHJcblxyXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcclxuICBzZXNzaW9uOiB7IHN0cmF0ZWd5OiAnand0JyB9LFxyXG4gIHBhZ2VzOiB7XHJcbiAgICBzaWduSW46ICcvYXV0aC9sb2dpbicsXHJcbiAgfSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xyXG4gICAgICBuYW1lOiAnQ3JlZGVudGlhbHMnLFxyXG4gICAgICBjcmVkZW50aWFsczoge1xyXG4gICAgICAgIGVtYWlsOiAgICB7IGxhYmVsOiAnRW1haWwnLCAgICB0eXBlOiAnZW1haWwnIH0sXHJcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6ICdQYXNzd29yZCcsIHR5cGU6ICdwYXNzd29yZCcgfSxcclxuICAgICAgfSxcclxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscz8uZW1haWwgfHwgIWNyZWRlbnRpYWxzPy5wYXNzd29yZCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgICAgYXdhaXQgY29ubmVjdERCKClcclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHsgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLnRvTG93ZXJDYXNlKCkgfSlcclxuICAgICAgICBpZiAoIXVzZXIpIHJldHVybiBudWxsXHJcblxyXG4gICAgICAgIGNvbnN0IHZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpXHJcbiAgICAgICAgaWYgKCF2YWxpZCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlkOiAgICB1c2VyLl9pZC50b1N0cmluZygpLFxyXG4gICAgICAgICAgbmFtZTogIHVzZXIubmFtZSxcclxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICAgcm9sZTogIHVzZXIucm9sZSxcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gY2FsbGJhY2tzOiB7XHJcbiAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xyXG4gICAgaWYgKHVzZXIpIHtcclxuICAgICAgdG9rZW4uaWQgICA9IHVzZXIuaWRcclxuICAgICAgdG9rZW4ucm9sZSA9ICh1c2VyIGFzIGFueSkucm9sZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRva2VuXHJcbiAgfSxcclxuICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xyXG4gICAgaWYgKHNlc3Npb24udXNlcikge1xyXG4gICAgICAoc2Vzc2lvbi51c2VyIGFzIGFueSkuaWQgICA9IHRva2VuLmlkIGFzIHN0cmluZ1xyXG4gICAgICA7KHNlc3Npb24udXNlciBhcyBhbnkpLnJvbGUgPSB0b2tlbi5yb2xlIGFzIHN0cmluZ1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNlc3Npb25cclxuICB9LFxyXG59LFxyXG59Il0sIm5hbWVzIjpbIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJiY3J5cHQiLCJjb25uZWN0REIiLCJVc2VyIiwiYXV0aE9wdGlvbnMiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJwYWdlcyIsInNpZ25JbiIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJ1c2VyIiwiZmluZE9uZSIsInRvTG93ZXJDYXNlIiwidmFsaWQiLCJjb21wYXJlIiwiaWQiLCJfaWQiLCJ0b1N0cmluZyIsInJvbGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/mongodb.ts":
/*!****************************!*\
  !*** ./src/lib/mongodb.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectDB: () => (/* binding */ connectDB)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) throw new Error(\"Please define MONGODB_URI in .env.local\");\nlet cached = global._mongoose ?? {\n    conn: null,\n    promise: null\n};\nglobal._mongoose = cached;\nasync function connectDB() {\n    if (cached.conn) return cached.conn;\n    if (!cached.promise) {\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, {\n            bufferCommands: false\n        });\n    }\n    cached.conn = await cached.promise;\n    return cached.conn;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL21vbmdvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQStCO0FBRS9CLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVztBQUUzQyxJQUFJLENBQUNBLGFBQWEsTUFBTSxJQUFJRyxNQUFNO0FBTWxDLElBQUlDLFNBQVNDLE9BQU9DLFNBQVMsSUFBSTtJQUFFQyxNQUFNO0lBQU1DLFNBQVM7QUFBSztBQUM3REgsT0FBT0MsU0FBUyxHQUFHRjtBQUVaLGVBQWVLO0lBQ3BCLElBQUlMLE9BQU9HLElBQUksRUFBRSxPQUFPSCxPQUFPRyxJQUFJO0lBRW5DLElBQUksQ0FBQ0gsT0FBT0ksT0FBTyxFQUFFO1FBQ25CSixPQUFPSSxPQUFPLEdBQUdULHVEQUFnQixDQUFDQyxhQUFhO1lBQUVXLGdCQUFnQjtRQUFNO0lBQ3pFO0lBRUFQLE9BQU9HLElBQUksR0FBRyxNQUFNSCxPQUFPSSxPQUFPO0lBQ2xDLE9BQU9KLE9BQU9HLElBQUk7QUFDcEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYXJlZXJzLXJvb2tpZS1uaW5qYS8uL3NyYy9saWIvbW9uZ29kYi50cz81M2MyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSdcclxuXHJcbmNvbnN0IE1PTkdPREJfVVJJID0gcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkkhXHJcblxyXG5pZiAoIU1PTkdPREJfVVJJKSB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBkZWZpbmUgTU9OR09EQl9VUkkgaW4gLmVudi5sb2NhbCcpXHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgdmFyIF9tb25nb29zZTogeyBjb25uOiB0eXBlb2YgbW9uZ29vc2UgfCBudWxsOyBwcm9taXNlOiBQcm9taXNlPHR5cGVvZiBtb25nb29zZT4gfCBudWxsIH1cclxufVxyXG5cclxubGV0IGNhY2hlZCA9IGdsb2JhbC5fbW9uZ29vc2UgPz8geyBjb25uOiBudWxsLCBwcm9taXNlOiBudWxsIH1cclxuZ2xvYmFsLl9tb25nb29zZSA9IGNhY2hlZFxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbm5lY3REQigpIHtcclxuICBpZiAoY2FjaGVkLmNvbm4pIHJldHVybiBjYWNoZWQuY29ublxyXG5cclxuICBpZiAoIWNhY2hlZC5wcm9taXNlKSB7XHJcbiAgICBjYWNoZWQucHJvbWlzZSA9IG1vbmdvb3NlLmNvbm5lY3QoTU9OR09EQl9VUkksIHsgYnVmZmVyQ29tbWFuZHM6IGZhbHNlIH0pXHJcbiAgfVxyXG5cclxuICBjYWNoZWQuY29ubiA9IGF3YWl0IGNhY2hlZC5wcm9taXNlXHJcbiAgcmV0dXJuIGNhY2hlZC5jb25uXHJcbn0iXSwibmFtZXMiOlsibW9uZ29vc2UiLCJNT05HT0RCX1VSSSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsImNhY2hlZCIsImdsb2JhbCIsIl9tb25nb29zZSIsImNvbm4iLCJwcm9taXNlIiwiY29ubmVjdERCIiwiY29ubmVjdCIsImJ1ZmZlckNvbW1hbmRzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/mongodb.ts\n");

/***/ }),

/***/ "(rsc)/./src/models/Job.ts":
/*!***************************!*\
  !*** ./src/models/Job.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst JobSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    title: {\n        type: String,\n        required: true,\n        trim: true\n    },\n    department: {\n        type: String,\n        required: true,\n        trim: true\n    },\n    location: {\n        type: String,\n        required: true,\n        trim: true\n    },\n    type: {\n        type: String,\n        enum: [\n            \"Full-time\",\n            \"Part-time\",\n            \"Contract\",\n            \"Internship\"\n        ],\n        required: true\n    },\n    remote: {\n        type: Boolean,\n        default: false\n    },\n    salaryMin: {\n        type: Number\n    },\n    salaryMax: {\n        type: Number\n    },\n    currency: {\n        type: String,\n        default: \"AED\"\n    },\n    description: {\n        type: String,\n        required: true\n    },\n    responsibilities: [\n        {\n            type: String\n        }\n    ],\n    requirements: [\n        {\n            type: String\n        }\n    ],\n    niceToHave: [\n        {\n            type: String\n        }\n    ],\n    status: {\n        type: String,\n        enum: [\n            \"open\",\n            \"closed\"\n        ],\n        default: \"open\"\n    },\n    postedBy: {\n        type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,\n        ref: \"User\",\n        required: true\n    }\n}, {\n    timestamps: true\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0__.models.Job || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)(\"Job\", JobSchema));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbW9kZWxzL0pvYi50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBb0U7QUFxQnBFLE1BQU1HLFlBQVksSUFBSUgsNENBQU1BLENBQzFCO0lBQ0VJLE9BQWtCO1FBQUVDLE1BQU1DO1FBQVFDLFVBQVU7UUFBTUMsTUFBTTtJQUFLO0lBQzdEQyxZQUFrQjtRQUFFSixNQUFNQztRQUFRQyxVQUFVO1FBQU1DLE1BQU07SUFBSztJQUM3REUsVUFBa0I7UUFBRUwsTUFBTUM7UUFBUUMsVUFBVTtRQUFNQyxNQUFNO0lBQUs7SUFDN0RILE1BQWtCO1FBQUVBLE1BQU1DO1FBQVFLLE1BQU07WUFBQztZQUFhO1lBQWE7WUFBWTtTQUFhO1FBQUVKLFVBQVU7SUFBSztJQUM3R0ssUUFBa0I7UUFBRVAsTUFBTVE7UUFBU0MsU0FBUztJQUFNO0lBQ2xEQyxXQUFrQjtRQUFFVixNQUFNVztJQUFPO0lBQ2pDQyxXQUFrQjtRQUFFWixNQUFNVztJQUFPO0lBQ2pDRSxVQUFrQjtRQUFFYixNQUFNQztRQUFRUSxTQUFTO0lBQU07SUFDakRLLGFBQWtCO1FBQUVkLE1BQU1DO1FBQVFDLFVBQVU7SUFBSztJQUNqRGEsa0JBQWtCO1FBQUM7WUFBRWYsTUFBTUM7UUFBTztLQUFFO0lBQ3BDZSxjQUFrQjtRQUFDO1lBQUVoQixNQUFNQztRQUFPO0tBQUU7SUFDcENnQixZQUFrQjtRQUFDO1lBQUVqQixNQUFNQztRQUFPO0tBQUU7SUFDcENpQixRQUFrQjtRQUFFbEIsTUFBTUM7UUFBUUssTUFBTTtZQUFDO1lBQVE7U0FBUztRQUFFRyxTQUFTO0lBQU87SUFDNUVVLFVBQWtCO1FBQUVuQixNQUFNTCw0Q0FBTUEsQ0FBQ3lCLEtBQUssQ0FBQ0MsUUFBUTtRQUFFQyxLQUFLO1FBQVFwQixVQUFVO0lBQUs7QUFDL0UsR0FDQTtJQUFFcUIsWUFBWTtBQUFLO0FBR3JCLGlFQUFlM0IsNENBQU1BLENBQUM0QixHQUFHLElBQUkzQiwrQ0FBS0EsQ0FBTyxPQUFPQyxVQUFVQSxFQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FyZWVycy1yb29raWUtbmluamEvLi9zcmMvbW9kZWxzL0pvYi50cz9kYTI5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSwgeyBTY2hlbWEsIERvY3VtZW50LCBtb2RlbHMsIG1vZGVsIH0gZnJvbSAnbW9uZ29vc2UnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElKb2IgZXh0ZW5kcyBEb2N1bWVudCB7XHJcbiAgdGl0bGU6IHN0cmluZ1xyXG4gIGRlcGFydG1lbnQ6IHN0cmluZ1xyXG4gIGxvY2F0aW9uOiBzdHJpbmdcclxuICB0eXBlOiAnRnVsbC10aW1lJyB8ICdQYXJ0LXRpbWUnIHwgJ0NvbnRyYWN0JyB8ICdJbnRlcm5zaGlwJ1xyXG4gIHJlbW90ZTogYm9vbGVhblxyXG4gIHNhbGFyeU1pbj86IG51bWJlclxyXG4gIHNhbGFyeU1heD86IG51bWJlclxyXG4gIGN1cnJlbmN5OiBzdHJpbmdcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgcmVzcG9uc2liaWxpdGllczogc3RyaW5nW11cclxuICByZXF1aXJlbWVudHM6IHN0cmluZ1tdXHJcbiAgbmljZVRvSGF2ZT86IHN0cmluZ1tdXHJcbiAgc3RhdHVzOiAnb3BlbicgfCAnY2xvc2VkJ1xyXG4gIHBvc3RlZEJ5OiBtb25nb29zZS5UeXBlcy5PYmplY3RJZFxyXG4gIGNyZWF0ZWRBdDogRGF0ZVxyXG4gIHVwZGF0ZWRBdDogRGF0ZVxyXG59XHJcblxyXG5jb25zdCBKb2JTY2hlbWEgPSBuZXcgU2NoZW1hPElKb2I+KFxyXG4gIHtcclxuICAgIHRpdGxlOiAgICAgICAgICAgIHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdHJpbTogdHJ1ZSB9LFxyXG4gICAgZGVwYXJ0bWVudDogICAgICAgeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB0cmltOiB0cnVlIH0sXHJcbiAgICBsb2NhdGlvbjogICAgICAgICB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHRyaW06IHRydWUgfSxcclxuICAgIHR5cGU6ICAgICAgICAgICAgIHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbJ0Z1bGwtdGltZScsICdQYXJ0LXRpbWUnLCAnQ29udHJhY3QnLCAnSW50ZXJuc2hpcCddLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgcmVtb3RlOiAgICAgICAgICAgeyB0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZSB9LFxyXG4gICAgc2FsYXJ5TWluOiAgICAgICAgeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgIHNhbGFyeU1heDogICAgICAgIHsgdHlwZTogTnVtYmVyIH0sXHJcbiAgICBjdXJyZW5jeTogICAgICAgICB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJ0FFRCcgfSxcclxuICAgIGRlc2NyaXB0aW9uOiAgICAgIHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgcmVzcG9uc2liaWxpdGllczogW3sgdHlwZTogU3RyaW5nIH1dLFxyXG4gICAgcmVxdWlyZW1lbnRzOiAgICAgW3sgdHlwZTogU3RyaW5nIH1dLFxyXG4gICAgbmljZVRvSGF2ZTogICAgICAgW3sgdHlwZTogU3RyaW5nIH1dLFxyXG4gICAgc3RhdHVzOiAgICAgICAgICAgeyB0eXBlOiBTdHJpbmcsIGVudW06IFsnb3BlbicsICdjbG9zZWQnXSwgZGVmYXVsdDogJ29wZW4nIH0sXHJcbiAgICBwb3N0ZWRCeTogICAgICAgICB7IHR5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnVXNlcicsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgfSxcclxuICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb2RlbHMuSm9iIHx8IG1vZGVsPElKb2I+KCdKb2InLCBKb2JTY2hlbWEpIl0sIm5hbWVzIjpbIlNjaGVtYSIsIm1vZGVscyIsIm1vZGVsIiwiSm9iU2NoZW1hIiwidGl0bGUiLCJ0eXBlIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJ0cmltIiwiZGVwYXJ0bWVudCIsImxvY2F0aW9uIiwiZW51bSIsInJlbW90ZSIsIkJvb2xlYW4iLCJkZWZhdWx0Iiwic2FsYXJ5TWluIiwiTnVtYmVyIiwic2FsYXJ5TWF4IiwiY3VycmVuY3kiLCJkZXNjcmlwdGlvbiIsInJlc3BvbnNpYmlsaXRpZXMiLCJyZXF1aXJlbWVudHMiLCJuaWNlVG9IYXZlIiwic3RhdHVzIiwicG9zdGVkQnkiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwidGltZXN0YW1wcyIsIkpvYiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/models/Job.ts\n");

/***/ }),

/***/ "(rsc)/./src/models/User.ts":
/*!****************************!*\
  !*** ./src/models/User.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst UserSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    name: {\n        type: String,\n        required: true,\n        trim: true\n    },\n    email: {\n        type: String,\n        required: true,\n        unique: true,\n        lowercase: true,\n        trim: true\n    },\n    password: {\n        type: String,\n        required: true\n    },\n    role: {\n        type: String,\n        enum: [\n            \"seeker\",\n            \"hr\"\n        ],\n        default: \"seeker\"\n    },\n    phone: {\n        type: String,\n        default: null\n    },\n    linkedIn: {\n        type: String,\n        default: null\n    },\n    resumeUrl: {\n        type: String,\n        default: null\n    }\n}, {\n    timestamps: true\n});\n// Force re-compile — clears cached model\ndelete (mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).User;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)(\"User\", UserSchema));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbW9kZWxzL1VzZXIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQW9FO0FBYXBFLE1BQU1HLGFBQWEsSUFBSUYsNENBQU1BLENBQzNCO0lBQ0VHLE1BQVc7UUFBRUMsTUFBTUM7UUFBUUMsVUFBVTtRQUFNQyxNQUFNO0lBQUs7SUFDdERDLE9BQVc7UUFBRUosTUFBTUM7UUFBUUMsVUFBVTtRQUFNRyxRQUFRO1FBQU1DLFdBQVc7UUFBTUgsTUFBTTtJQUFLO0lBQ3JGSSxVQUFXO1FBQUVQLE1BQU1DO1FBQVFDLFVBQVU7SUFBSztJQUMxQ00sTUFBVztRQUFFUixNQUFNQztRQUFRUSxNQUFNO1lBQUM7WUFBVTtTQUFLO1FBQUVDLFNBQVM7SUFBUztJQUNyRUMsT0FBVztRQUFFWCxNQUFNQztRQUFRUyxTQUFTO0lBQUs7SUFDekNFLFVBQVc7UUFBRVosTUFBTUM7UUFBUVMsU0FBUztJQUFLO0lBQ3pDRyxXQUFXO1FBQUViLE1BQU1DO1FBQVFTLFNBQVM7SUFBSztBQUMzQyxHQUNBO0lBQUVJLFlBQVk7QUFBSztBQUdyQix5Q0FBeUM7QUFDekMsT0FBTyx3REFBd0IsQ0FBQ0UsSUFBSTtBQUNwQyxpRUFBZW5CLCtDQUFLQSxDQUFRLFFBQVFDLFdBQVdBLEVBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYXJlZXJzLXJvb2tpZS1uaW5qYS8uL3NyYy9tb2RlbHMvVXNlci50cz8wOTZkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSwgeyBTY2hlbWEsIERvY3VtZW50LCBtb2RlbHMsIG1vZGVsIH0gZnJvbSAnbW9uZ29vc2UnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyIGV4dGVuZHMgRG9jdW1lbnQge1xyXG4gIG5hbWU6IHN0cmluZ1xyXG4gIGVtYWlsOiBzdHJpbmdcclxuICBwYXNzd29yZDogc3RyaW5nXHJcbiAgcm9sZTogJ3NlZWtlcicgfCAnaHInXHJcbiAgcGhvbmU/OiBzdHJpbmdcclxuICBsaW5rZWRJbj86IHN0cmluZ1xyXG4gIHJlc3VtZVVybD86IHN0cmluZ1xyXG4gIGNyZWF0ZWRBdDogRGF0ZVxyXG59XHJcblxyXG5jb25zdCBVc2VyU2NoZW1hID0gbmV3IFNjaGVtYTxJVXNlcj4oXHJcbiAge1xyXG4gICAgbmFtZTogICAgICB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHRyaW06IHRydWUgfSxcclxuICAgIGVtYWlsOiAgICAgeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWUsIGxvd2VyY2FzZTogdHJ1ZSwgdHJpbTogdHJ1ZSB9LFxyXG4gICAgcGFzc3dvcmQ6ICB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgIHJvbGU6ICAgICAgeyB0eXBlOiBTdHJpbmcsIGVudW06IFsnc2Vla2VyJywgJ2hyJ10sIGRlZmF1bHQ6ICdzZWVrZXInIH0sXHJcbiAgICBwaG9uZTogICAgIHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBudWxsIH0sXHJcbiAgICBsaW5rZWRJbjogIHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBudWxsIH0sXHJcbiAgICByZXN1bWVVcmw6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBudWxsIH0sXHJcbiAgfSxcclxuICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pXHJcblxyXG4vLyBGb3JjZSByZS1jb21waWxlIOKAlCBjbGVhcnMgY2FjaGVkIG1vZGVsXHJcbmRlbGV0ZSAobW9uZ29vc2UgYXMgYW55KS5tb2RlbHMuVXNlclxyXG5leHBvcnQgZGVmYXVsdCBtb2RlbDxJVXNlcj4oJ1VzZXInLCBVc2VyU2NoZW1hKSJdLCJuYW1lcyI6WyJtb25nb29zZSIsIlNjaGVtYSIsIm1vZGVsIiwiVXNlclNjaGVtYSIsIm5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJ0cmltIiwiZW1haWwiLCJ1bmlxdWUiLCJsb3dlcmNhc2UiLCJwYXNzd29yZCIsInJvbGUiLCJlbnVtIiwiZGVmYXVsdCIsInBob25lIiwibGlua2VkSW4iLCJyZXN1bWVVcmwiLCJ0aW1lc3RhbXBzIiwibW9kZWxzIiwiVXNlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/models/User.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2F%5Bid%5D%2Froute&page=%2Fapi%2Fjobs%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2F%5Bid%5D%2Froute.ts&appDir=D%3A%5CWorkspace%5CWorkspace%5CCareers%5Ccareers-rookie-ninja-frontend%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CWorkspace%5CWorkspace%5CCareers%5Ccareers-rookie-ninja-frontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();