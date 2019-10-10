(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["demo-demo-module"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/demo/flexbox/flexbox.component.html":
/*!*******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/demo/flexbox/flexbox.component.html ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"flex-container\">  \n    <div class=\"flex-item\"> 1 </div>\n    <div class=\"flex-item\"> 2 </div>\n    <div class=\"flex-item\"> 3 </div>\n    <div class=\"flex-item\"> 4 </div>\n    <div class=\"flex-item\"> 5 </div>\n    <div class=\"flex-item\"> 6 </div>\n</div>"

/***/ }),

/***/ "./src/app/demo/buttons/buttons.component.ts":
/*!***************************************************!*\
  !*** ./src/app/demo/buttons/buttons.component.ts ***!
  \***************************************************/
/*! exports provided: ButtonsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ButtonsComponent", function() { return ButtonsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let ButtonsComponent = class ButtonsComponent {
    constructor() { }
    ngOnInit() {
    }
};
ButtonsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-buttons',
        template: `
  <button mat-button>
  <mat-icon>face</mat-icon>
  Click Me</button>
<mat-checkbox>Click</mat-checkbox>
  `
    })
], ButtonsComponent);



/***/ }),

/***/ "./src/app/demo/demo-routing.module.ts":
/*!*********************************************!*\
  !*** ./src/app/demo/demo-routing.module.ts ***!
  \*********************************************/
/*! exports provided: DemoRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemoRoutingModule", function() { return DemoRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./buttons/buttons.component */ "./src/app/demo/buttons/buttons.component.ts");
/* harmony import */ var _flexbox_flexbox_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flexbox/flexbox.component */ "./src/app/demo/flexbox/flexbox.component.ts");





const routes = [
    { path: 'button', component: _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_3__["ButtonsComponent"] },
    { path: 'flexbox', component: _flexbox_flexbox_component__WEBPACK_IMPORTED_MODULE_4__["FlexboxComponent"] },
    { path: '**', redirectTo: 'button' }
];
let DemoRoutingModule = class DemoRoutingModule {
};
DemoRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], DemoRoutingModule);



/***/ }),

/***/ "./src/app/demo/demo.module.ts":
/*!*************************************!*\
  !*** ./src/app/demo/demo.module.ts ***!
  \*************************************/
/*! exports provided: DemoModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemoModule", function() { return DemoModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm2015/flex-layout.js");
/* harmony import */ var _demo_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./demo-routing.module */ "./src/app/demo/demo-routing.module.ts");
/* harmony import */ var _buttons_buttons_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./buttons/buttons.component */ "./src/app/demo/buttons/buttons.component.ts");
/* harmony import */ var _flexbox_flexbox_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./flexbox/flexbox.component */ "./src/app/demo/flexbox/flexbox.component.ts");
/* harmony import */ var _shared_material_material_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/material/material.module */ "./src/app/shared/material/material.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");









let DemoModule = class DemoModule {
};
DemoModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [_buttons_buttons_component__WEBPACK_IMPORTED_MODULE_5__["ButtonsComponent"], _flexbox_flexbox_component__WEBPACK_IMPORTED_MODULE_6__["FlexboxComponent"]],
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _shared_material_material_module__WEBPACK_IMPORTED_MODULE_7__["MaterialModule"],
            _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__["FlexLayoutModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"],
            _demo_routing_module__WEBPACK_IMPORTED_MODULE_4__["DemoRoutingModule"],
        ]
    })
], DemoModule);



/***/ }),

/***/ "./src/app/demo/flexbox/flexbox.component.scss":
/*!*****************************************************!*\
  !*** ./src/app/demo/flexbox/flexbox.component.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".flex-container {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: space-around;\n}\n\n.flex-item {\n  width: 200px;\n  height: 150px;\n  margin-top: 5px;\n  color: whitesmoke;\n  background: tomato;\n  font-size: 3em;\n  font-weight: bold;\n  line-height: 150px;\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZGVtby9mbGV4Ym94L0Q6XFxBbmd1bGFyXFxBbmd1bGFyIE1hdGVyaWFsXFxBbmd1bGFyTWF0ZXJpYWwxL3NyY1xcYXBwXFxkZW1vXFxmbGV4Ym94XFxmbGV4Ym94LmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9kZW1vL2ZsZXhib3gvZmxleGJveC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUVJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSw2QkFBQTtBQ0FKOztBREVBO0VBRUMsWUFBQTtFQUNBLGFBQUE7RUFDRCxlQUFBO0VBQ0MsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7QUNBRCIsImZpbGUiOiJzcmMvYXBwL2RlbW8vZmxleGJveC9mbGV4Ym94LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmZsZXgtY29udGFpbmVyXHJcbntcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbn1cclxuLmZsZXgtaXRlbVxyXG57XHJcbiB3aWR0aDogMjAwcHg7XHJcbiBoZWlnaHQ6IDE1MHB4O1xyXG5tYXJnaW4tdG9wOiA1cHg7XHJcbiBjb2xvcjogIHdoaXRlc21va2U7XHJcbiBiYWNrZ3JvdW5kOiB0b21hdG87XHJcbiBmb250LXNpemU6IDNlbTtcclxuIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gbGluZS1oZWlnaHQ6IDE1MHB4O1xyXG4gdGV4dC1hbGlnbjogY2VudGVyO1xyXG59IiwiLmZsZXgtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZmxleC13cmFwOiB3cmFwO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbn1cblxuLmZsZXgtaXRlbSB7XG4gIHdpZHRoOiAyMDBweDtcbiAgaGVpZ2h0OiAxNTBweDtcbiAgbWFyZ2luLXRvcDogNXB4O1xuICBjb2xvcjogd2hpdGVzbW9rZTtcbiAgYmFja2dyb3VuZDogdG9tYXRvO1xuICBmb250LXNpemU6IDNlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGxpbmUtaGVpZ2h0OiAxNTBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/demo/flexbox/flexbox.component.ts":
/*!***************************************************!*\
  !*** ./src/app/demo/flexbox/flexbox.component.ts ***!
  \***************************************************/
/*! exports provided: FlexboxComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlexboxComponent", function() { return FlexboxComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let FlexboxComponent = class FlexboxComponent {
    constructor() { }
    ngOnInit() {
    }
};
FlexboxComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-flexbox',
        template: __webpack_require__(/*! raw-loader!./flexbox.component.html */ "./node_modules/raw-loader/index.js!./src/app/demo/flexbox/flexbox.component.html"),
        styles: [__webpack_require__(/*! ./flexbox.component.scss */ "./src/app/demo/flexbox/flexbox.component.scss")]
    })
], FlexboxComponent);



/***/ })

}]);
//# sourceMappingURL=demo-demo-module-es2015.js.map