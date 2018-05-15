module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./components/Header.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_next_link__ = __webpack_require__("next/link");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_next_link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_next_link__);
var _jsxFileName = "/Users/liuxin/iCloud \u4E91\u76D8\uFF08\u5F52\u6863\uFF09/Desktop/Test/hello-next/components/Header.js";



var linkStyle = {
  marginRight: 15
};

var Header = function Header() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    "div",
    {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 8
      }
    },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_1_next_link___default.a,
      { href: "/", __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "a",
        { style: linkStyle, __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        },
        "Home"
      )
    ),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_1_next_link___default.a,
      { href: "/about", __source: {
          fileName: _jsxFileName,
          lineNumber: 12
        }
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "a",
        { style: linkStyle, __source: {
            fileName: _jsxFileName,
            lineNumber: 13
          }
        },
        "About"
      )
    )
  );
};

/* harmony default export */ __webpack_exports__["a"] = (Header);

/***/ }),

/***/ "./components/MyLayout.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Header__ = __webpack_require__("./components/Header.js");
var _jsxFileName = '/Users/liuxin/iCloud \u4E91\u76D8\uFF08\u5F52\u6863\uFF09/Desktop/Test/hello-next/components/MyLayout.js';



var layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

var Layout = function Layout(props) {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'div',
    { style: layoutStyle, __source: {
        fileName: _jsxFileName,
        lineNumber: 10
      }
    },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__Header__["a" /* default */], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 11
      }
    }),
    props.children
  );
};

/* harmony default export */ __webpack_exports__["a"] = (Layout);

/***/ }),

/***/ "./pages/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_styled_jsx_style__ = __webpack_require__("styled-jsx/style");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_styled_jsx_style___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_styled_jsx_style__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_next_link__ = __webpack_require__("next/link");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_next_link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_next_link__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Header__ = __webpack_require__("./components/Header.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_MyLayout_js__ = __webpack_require__("./components/MyLayout.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_isomorphic_unfetch__ = __webpack_require__("isomorphic-unfetch");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_isomorphic_unfetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_isomorphic_unfetch__);

var _jsxFileName = '/Users/liuxin/iCloud \u4E91\u76D8\uFF08\u5F52\u6863\uFF09/Desktop/Test/hello-next/pages/index.js';



function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }






var PostLink = function PostLink(props) {
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        'li',
        {
            __source: {
                fileName: _jsxFileName,
                lineNumber: 7
            }
        },
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_3_next_link___default.a,
            { as: '/p/' + props.id, href: '/post?title=' + props.title, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 8
                }
            },
            __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
                'a',
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 9
                    }
                },
                props.title
            )
        )
    );
};

var Index = function Index(props) {
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5__components_MyLayout_js__["a" /* default */],
        {
            __source: {
                fileName: _jsxFileName,
                lineNumber: 15
            }
        },
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
            'h1',
            {
                className: 'jsx-2407821997',
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 16
                }
            },
            'Batman TV Shows'
        ),
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
            'ul',
            {
                className: 'jsx-2407821997',
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 17
                }
            },
            props.shows.map(function (_ref) {
                var show = _ref.show;
                return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
                    'li',
                    { key: show.id, className: 'jsx-2407821997',
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 19
                        }
                    },
                    __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_3_next_link___default.a,
                        { as: '/p/' + show.name,
                            href: '/post?title=' + show.name, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 20
                            }
                        },
                        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
                            'a',
                            {
                                className: 'jsx-2407821997',
                                __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 22
                                }
                            },
                            show.name
                        )
                    )
                );
            })
        ),
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_styled_jsx_style___default.a, {
            styleId: '2407821997',
            css: 'h1.jsx-2407821997,a.jsx-2407821997{font-family:"Arial";}ul.jsx-2407821997{padding:0;}li.jsx-2407821997{list-style:none;margin:5px 0;}a.jsx-2407821997{text-decoration:none;color:blue;}a.jsx-2407821997:hover{opacity:0.6;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTJCb0IsQUFHaUMsQUFHVixBQUdNLEFBSUssQUFJVCxVQVZoQixFQVdBLElBUmlCLElBTmpCLENBVWUsUUFIZixHQUlBIiwiZmlsZSI6InBhZ2VzL2luZGV4LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9saXV4aW4vaUNsb3VkIOS6keebmO+8iOW9kuaho++8iS9EZXNrdG9wL1Rlc3QvaGVsbG8tbmV4dCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XG5pbXBvcnQgSGVhZGVyIGZyb20gJy4uL2NvbXBvbmVudHMvSGVhZGVyJztcbmltcG9ydCBMYXlvdXQgZnJvbSAnLi4vY29tcG9uZW50cy9NeUxheW91dC5qcyc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy11bmZldGNoJztcblxuY29uc3QgUG9zdExpbmsgPSAocHJvcHMpID0+IChcbiAgICA8bGk+XG4gICAgICAgIDxMaW5rIGFzPXtgL3AvJHtwcm9wcy5pZH1gfSBocmVmPXtgL3Bvc3Q/dGl0bGU9JHtwcm9wcy50aXRsZX1gfT5cbiAgICAgICAgICAgIDxhPntwcm9wcy50aXRsZX08L2E+XG4gICAgICAgIDwvTGluaz5cbiAgICA8L2xpPlxuKVxuXG5jb25zdCBJbmRleCA9IChwcm9wcykgPT4gKFxuICAgIDxMYXlvdXQ+XG4gICAgICAgIDxoMT5CYXRtYW4gVFYgU2hvd3M8L2gxPlxuICAgICAgICA8dWw+XG4gICAgICAgIHtwcm9wcy5zaG93cy5tYXAoKHtzaG93fSkgPT4gKFxuICAgICAgICAgICAgPGxpIGtleT17c2hvdy5pZH0+XG4gICAgICAgICAgICA8TGluayBhcz17YC9wLyR7c2hvdy5uYW1lfWB9IFxuICAgICAgICAgICAgICAgIGhyZWY9e2AvcG9zdD90aXRsZT0ke3Nob3cubmFtZX1gfT5cbiAgICAgICAgICAgICAgICA8YT57c2hvdy5uYW1lfTwvYT5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuXG4gICAgICAgIDxzdHlsZSBqc3g+e2BcbiAgICAgICAgaDEsIGEge1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IFwiQXJpYWxcIjtcbiAgICAgICAgfVxuICAgICAgICB1bCB7XG4gICAgICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICB9XG4gICAgICAgIGxpIHtcbiAgICAgICAgICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgICAgICAgICBtYXJnaW46IDVweCAwO1xuICAgICAgICB9XG4gICAgICAgIGEge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICAgICAgY29sb3I6IGJsdWU7XG4gICAgICAgIH1cbiAgICAgICAgYTpob3ZlciB7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjY7XG4gICAgICAgIH1cbiAgICAgICAgYH08L3N0eWxlPlxuICAgIDwvTGF5b3V0PlxuKVxuXG5JbmRleC5nZXRJbml0aWFsUHJvcHMgPSBhc3luYyBmdW5jdGlvbigpIHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkudHZtYXplLmNvbS9zZWFyY2gvc2hvd3M/cT1iYXRtYW4nKVxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXG5cbiAgICBjb25zb2xlLmxvZyhgU2hvdyBkYXRhIGZldGNoZWQuIENvdW50OiAke2RhdGEubGVuZ3RofWApXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzaG93czogZGF0YVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5kZXg7Il19 */\n/*@ sourceURL=pages/index.js */'
        })
    );
};

Index.getInitialProps = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
    var res, data;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return __WEBPACK_IMPORTED_MODULE_6_isomorphic_unfetch___default()('https://api.tvmaze.com/search/shows?q=batman');

                case 2:
                    res = _context.sent;
                    _context.next = 5;
                    return res.json();

                case 5:
                    data = _context.sent;


                    console.log('Show data fetched. Count: ' + data.length);

                    return _context.abrupt('return', {
                        shows: data
                    });

                case 8:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}));

/* harmony default export */ __webpack_exports__["default"] = (Index);

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./pages/index.js");


/***/ }),

/***/ "babel-runtime/regenerator":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),

/***/ "isomorphic-unfetch":
/***/ (function(module, exports) {

module.exports = require("isomorphic-unfetch");

/***/ }),

/***/ "next/link":
/***/ (function(module, exports) {

module.exports = require("next/link");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "styled-jsx/style":
/***/ (function(module, exports) {

module.exports = require("styled-jsx/style");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map