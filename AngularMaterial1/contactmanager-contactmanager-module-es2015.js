(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["contactmanager-contactmanager-module"],{

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.html":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.html ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Add New Contact</h2>\n<mat-dialog-content color=\"primary\">\n        <div class=\"example-container\">\n                <mat-form-field>\n                  <input matInput placeholder=\"Name\" [(ngModel)]=\"user.name\" required>\n                </mat-form-field>\n              \n                <mat-form-field>\n                  <textarea matInput placeholder=\"Bio\" [(ngModel)]=\"user.bio\" required></textarea>\n                </mat-form-field>\n              \n                <mat-form-field>\n                  <mat-select placeholder=\"Select\">\n                    <mat-option value=\"option\">Option</mat-option>\n                  </mat-select>\n                </mat-form-field>\n              </div>\n              \n</mat-dialog-content>\n<mat-dialog-actions>\n  <button mat-button mat-dialog-close (click)=\"dismiss()\" >\n        <mat-icon>cancel</mat-icon> cancel\n    </button>\n  <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->\n  <button mat-button [mat-dialog-close]=\"true\" (click)=\"save()\" >\n    <mat-icon>save</mat-icon>  Save\n    </button>\n</mat-dialog-actions>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/notes/notes.component.html":
/*!************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/contactmanager/components/notes/notes.component.html ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "    <!-- <pre>\r\n        {{notes | json}}\r\n    </pre> -->\r\n    <mat-form-field>\r\n            <input matInput (keyup)=\"applyFilter($event.target.value)\" placeholder=\"Filter\">\r\n    </mat-form-field>\r\n    <div class=\"mat-elevation-z8\">\r\n     <mat-table #table [dataSource]=\"dataSource\" matSort>\r\n        <!-- Position Column -->\r\n        <ng-container matColumnDef=\"position\">\r\n          <mat-header-cell *matHeaderCellDef mat-sort-header> No. </mat-header-cell>\r\n          <mat-cell *matCellDef=\"let note\"> {{note.id}} </mat-cell>\r\n        </ng-container>\r\n      \r\n        <!-- Name Column -->\r\n        <ng-container matColumnDef=\"title\">\r\n          <mat-header-cell *matHeaderCellDef mat-sort-header> Title </mat-header-cell>\r\n          <mat-cell *matCellDef=\"let note\"> {{note.title}} </mat-cell>\r\n        </ng-container>\r\n      \r\n        <!-- Weight Column -->\r\n        <ng-container matColumnDef=\"date\">\r\n          <mat-header-cell *matHeaderCellDef mat-sort-header> Date </mat-header-cell>\r\n          <mat-cell *matCellDef=\"let note\"> {{note.date| date : 'yyyy-MM-dd'}} </mat-cell>\r\n        </ng-container>\r\n      \r\n        <!-- Symbol Column -->\r\n        <!-- <ng-container matColumnDef=\"symbol\">\r\n          <mat-header-cell *matHeaderCellDef> Symbol </mat-header-cell>\r\n          <mat-cell *matCellDef=\"let note\"> {{note.symbol}} </mat-cell>\r\n        </ng-container> -->\r\n      \r\n        <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\r\n        <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\r\n      </mat-table>\r\n      <mat-paginator #paginator [pageSizeOptions]=\"[2,5, 10, 25, 100]\"></mat-paginator>\r\n    </div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/toolbar/main-content/main-content.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/contactmanager/components/toolbar/main-content/main-content.component.html ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!user\">\n    <!-- Please Select Contact -->\n    <mat-spinner></mat-spinner>\n</div>\n<div *ngIf=\"user\">\n<mat-card>\n    <mat-card-header>\n        <div mat-card-avatar></div>\n        <mat-card-title>{{user.name}}</mat-card-title>\n        <mat-card-subtitle>Birthday :{{user.birthDate | date:'d LLLL'}}</mat-card-subtitle>\n      </mat-card-header>\n      \n      <mat-card-content>       \n        <mat-tab-group>\n          <mat-tab label=\"Bio\"> \n              <p>\n                  {{user.bio}}\n                 </p>  \n          </mat-tab>\n          <mat-tab label=\"Notes\"> \n                <app-notes [notes]=\"user.notes\"></app-notes>\n          </mat-tab>\n          \n        </mat-tab-group>\n        \n      </mat-card-content>      \n</mat-card>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.html":
/*!************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.html ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n\n<mat-drawer-container class=\"example-container\" autosize>\n    <mat-drawer #drawer class=\"example-sidenav mat-elevation-z10\" [opened]=\"!isSmallSceeen()\" \n    [mode]=\"isSmallSceeen() ? 'over' :'side'\">\n            <mat-toolbar color=\"primary\" >\n                    <span>Contact</span>\n            </mat-toolbar>\n            <mat-nav-list role=\"list\">\n                    <mat-list-item *ngFor=\"let user of  users | async\">\n                        <a matLine [routerLink]=\"['/contactmanager',user.id]\">\n                         <mat-icon svgIcon=\"{{user.avatar}}\"></mat-icon>   {{user.name}}\n                        </a>\n                    </mat-list-item>\n                   \n             </mat-nav-list>\n    </mat-drawer>\n  \n    <div class=\"example-sidenav-content\">\n            <app-toolbar (click)=\"drawer.toggle()\"></app-toolbar>\n           <div class=\"wrapper\">\n               <router-outlet></router-outlet>  \n           </div> \n    </div>\n  \n  </mat-drawer-container>\n  "

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/toolbar/toolbar.component.html":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/contactmanager/components/toolbar/toolbar.component.html ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar color=\"primary\">\n        <button mat-button class=\"sidenav-toggle\" (click)=\"sidenavtoggle.emit()\">\n            <mat-icon>menu</mat-icon>\n        </button>\n        <span>Contact Manager</span>\n        <span class=\"example-spacer\"></span>\n<button mat-button [matMenuTriggerFor]=\"menu\">\n    <mat-icon class=\"example-icon\">more_vert</mat-icon>\n</button>\n<mat-menu #menu=\"matMenu\"> \n  <button mat-menu-item (click)=\"openAddContactDialog()\">New Contact</button>\n</mat-menu>\n\n   \n</mat-toolbar>"

/***/ }),

/***/ "./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.scss":
/*!************************************************************************************************!*\
  !*** ./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.scss ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n}\n\n.example-container > * {\n  width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29udGFjdG1hbmFnZXIvY29tcG9uZW50cy9uZXctY29udGFjdC1kaWFsb2cvRDpcXEFuZ3VsYXJcXEFuZ3VsYXIgTWF0ZXJpYWxcXEFuZ3VsYXJNYXRlcmlhbDEvc3JjXFxhcHBcXGNvbnRhY3RtYW5hZ2VyXFxjb21wb25lbnRzXFxuZXctY29udGFjdC1kaWFsb2dcXG5ldy1jb250YWN0LWRpYWxvZy5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29udGFjdG1hbmFnZXIvY29tcG9uZW50cy9uZXctY29udGFjdC1kaWFsb2cvbmV3LWNvbnRhY3QtZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0FDQ0o7O0FERUU7RUFDRSxXQUFBO0FDQ0oiLCJmaWxlIjoic3JjL2FwcC9jb250YWN0bWFuYWdlci9jb21wb25lbnRzL25ldy1jb250YWN0LWRpYWxvZy9uZXctY29udGFjdC1kaWFsb2cuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZXhhbXBsZS1jb250YWluZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgfVxyXG4gIFxyXG4gIC5leGFtcGxlLWNvbnRhaW5lciA+ICoge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfSIsIi5leGFtcGxlLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG59XG5cbi5leGFtcGxlLWNvbnRhaW5lciA+ICoge1xuICB3aWR0aDogMTAwJTtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: NewContactDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewContactDialogComponent", function() { return NewContactDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm2015/dialog.js");
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/user */ "./src/app/contactmanager/models/user.ts");




let NewContactDialogComponent = class NewContactDialogComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.user = new _models_user__WEBPACK_IMPORTED_MODULE_3__["User"]();
    }
    ngOnInit() {
    }
    dismiss() {
        this.dialogRef.close(null);
    }
    save() {
        this.dialogRef.close(this.user);
    }
};
NewContactDialogComponent.ctorParameters = () => [
    { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"] }
];
NewContactDialogComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-new-contact-dialog',
        template: __webpack_require__(/*! raw-loader!./new-contact-dialog.component.html */ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.html"),
        styles: [__webpack_require__(/*! ./new-contact-dialog.component.scss */ "./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.scss")]
    })
], NewContactDialogComponent);



/***/ }),

/***/ "./src/app/contactmanager/components/notes/notes.component.css":
/*!*********************************************************************!*\
  !*** ./src/app/contactmanager/components/notes/notes.component.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "table {\r\n    width: 100%;\r\n  }\r\n  \r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29udGFjdG1hbmFnZXIvY29tcG9uZW50cy9ub3Rlcy9ub3Rlcy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksV0FBVztFQUNiIiwiZmlsZSI6InNyYy9hcHAvY29udGFjdG1hbmFnZXIvY29tcG9uZW50cy9ub3Rlcy9ub3Rlcy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsidGFibGUge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG4gICJdfQ== */"

/***/ }),

/***/ "./src/app/contactmanager/components/notes/notes.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/contactmanager/components/notes/notes.component.ts ***!
  \********************************************************************/
/*! exports provided: NotesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotesComponent", function() { return NotesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/table */ "./node_modules/@angular/material/esm2015/table.js");
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/paginator */ "./node_modules/@angular/material/esm2015/paginator.js");
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/sort */ "./node_modules/@angular/material/esm2015/sort.js");





let NotesComponent = class NotesComponent {
    constructor() {
        // tslint:disable-next-line: member-ordering
        this.displayedColumns = ['position', 'title', 'date'];
    }
    ngOnInit() {
        this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatTableDataSource"](this.notes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
};
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
], NotesComponent.prototype, "notes", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material_paginator__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"], { static: true })
], NotesComponent.prototype, "paginator", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material_sort__WEBPACK_IMPORTED_MODULE_4__["MatSort"], { static: true })
], NotesComponent.prototype, "sort", void 0);
NotesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-notes',
        template: __webpack_require__(/*! raw-loader!./notes.component.html */ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/notes/notes.component.html"),
        styles: [__webpack_require__(/*! ./notes.component.css */ "./src/app/contactmanager/components/notes/notes.component.css")]
    })
], NotesComponent);



/***/ }),

/***/ "./src/app/contactmanager/components/toolbar/main-content/main-content.component.css":
/*!*******************************************************************************************!*\
  !*** ./src/app/contactmanager/components/toolbar/main-content/main-content.component.css ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbnRhY3RtYW5hZ2VyL2NvbXBvbmVudHMvdG9vbGJhci9tYWluLWNvbnRlbnQvbWFpbi1jb250ZW50LmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/contactmanager/components/toolbar/main-content/main-content.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/contactmanager/components/toolbar/main-content/main-content.component.ts ***!
  \******************************************************************************************/
/*! exports provided: MainContentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainContentComponent", function() { return MainContentComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_contactmanager_service_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/contactmanager/service/user.service */ "./src/app/contactmanager/service/user.service.ts");




let MainContentComponent = class MainContentComponent {
    constructor(route, service) {
        this.route = route;
        this.service = service;
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            let id = params.id;
            if (!id) {
                id = 1;
            }
            this.user = null;
            this.service.users.subscribe(users => {
                // tslint:disable-next-line: triple-equals
                if (users.length == 0) {
                    return;
                }
                setTimeout(() => {
                    this.user = this.service.userById(id);
                }, 500);
            });
        });
    }
};
MainContentComponent.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] },
    { type: src_app_contactmanager_service_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"] }
];
MainContentComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-main-content',
        template: __webpack_require__(/*! raw-loader!./main-content.component.html */ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/toolbar/main-content/main-content.component.html"),
        styles: [__webpack_require__(/*! ./main-content.component.css */ "./src/app/contactmanager/components/toolbar/main-content/main-content.component.css")]
    })
], MainContentComponent);



/***/ }),

/***/ "./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.css":
/*!*********************************************************************************!*\
  !*** ./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.css ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\r\n    flex:1;\r\n    position: fixed;\r\n    min-width: 100%;\r\n    width: 100%;\r\n    min-height: 100%;\r\n    height: 100%;\r\n    \r\n  }\r\n  \r\n  .example-sidenav-content {\r\n    display: flex;\r\n    height: 100%;\r\n    flex-direction:column;\r\n  }\r\n  \r\n  .example-sidenav {\r\n    padding: 20px;\r\n  }\r\n  \r\n  .wrapper\r\n  {\r\n    margin: 50px;\r\n  }\r\n\r\n  \r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29udGFjdG1hbmFnZXIvY29tcG9uZW50cy90b29sYmFyL3NpZGVuYXYvc2lkZW5hdi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksTUFBTTtJQUNOLGVBQWU7SUFDZixlQUFlO0lBQ2YsV0FBVztJQUNYLGdCQUFnQjtJQUNoQixZQUFZOztFQUVkOztFQUVBO0lBQ0UsYUFBYTtJQUNiLFlBQVk7SUFDWixxQkFBcUI7RUFDdkI7O0VBRUE7SUFDRSxhQUFhO0VBQ2Y7O0VBRUE7O0lBRUUsWUFBWTtFQUNkIiwiZmlsZSI6InNyYy9hcHAvY29udGFjdG1hbmFnZXIvY29tcG9uZW50cy90b29sYmFyL3NpZGVuYXYvc2lkZW5hdi5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmV4YW1wbGUtY29udGFpbmVyIHtcclxuICAgIGZsZXg6MTtcclxuICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgIG1pbi13aWR0aDogMTAwJTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgbWluLWhlaWdodDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIFxyXG4gIH1cclxuICBcclxuICAuZXhhbXBsZS1zaWRlbmF2LWNvbnRlbnQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICAgIGZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcclxuICB9XHJcbiAgXHJcbiAgLmV4YW1wbGUtc2lkZW5hdiB7XHJcbiAgICBwYWRkaW5nOiAyMHB4O1xyXG4gIH1cclxuXHJcbiAgLndyYXBwZXJcclxuICB7XHJcbiAgICBtYXJnaW46IDUwcHg7XHJcbiAgfVxyXG5cclxuICAiXX0= */"

/***/ }),

/***/ "./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.ts ***!
  \********************************************************************************/
/*! exports provided: SidenavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidenavComponent", function() { return SidenavComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_contactmanager_service_user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/contactmanager/service/user.service */ "./src/app/contactmanager/service/user.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/sidenav */ "./node_modules/@angular/material/esm2015/sidenav.js");






const SMALL_WIDTH_BREAKPOINT = 720;
let SidenavComponent = class SidenavComponent {
    constructor(zone, router, userService, http, httpm) {
        this.router = router;
        this.userService = userService;
        this.mediaMatcher = matchMedia(`(max-width : ${SMALL_WIDTH_BREAKPOINT}px)`);
        // this.mediaMatcher.addListener(mql =>
        // zone.run(()=> this.mediaMatcher =mql)
        // );
    }
    ngOnInit() {
        this.users = this.userService.users;
        this.userService.loadAll();
        this.router.events.subscribe(() => {
            if (this.isSmallSceeen()) {
                this.sidenav.close();
            }
        });
    }
    isSmallSceeen() {
        return this.mediaMatcher.matches;
    }
};
SidenavComponent.ctorParameters = () => [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] },
    { type: src_app_contactmanager_service_user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"] },
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"] },
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material_sidenav__WEBPACK_IMPORTED_MODULE_5__["MatSidenav"], { static: false })
], SidenavComponent.prototype, "sidenav", void 0);
SidenavComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-sidenav',
        template: __webpack_require__(/*! raw-loader!./sidenav.component.html */ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.html"),
        styles: [__webpack_require__(/*! ./sidenav.component.css */ "./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.css")]
    })
], SidenavComponent);



/***/ }),

/***/ "./src/app/contactmanager/components/toolbar/toolbar.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/contactmanager/components/toolbar/toolbar.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".sidenav-toggle {\n  display: none;\n  margin: 0px;\n  min-width: 56px;\n}\n@media (max-width: 720px) {\n  .sidenav-toggle {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n}\n.sidenav-toggle mat-icon {\n  font-size: 30px;\n  height: 56px;\n  width: 56px;\n  color: white;\n  line-height: 56px;\n}\n.example-icon {\n  padding: 0 14px;\n}\n.example-spacer {\n  flex: 1 1 auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29udGFjdG1hbmFnZXIvY29tcG9uZW50cy90b29sYmFyL0Q6XFxBbmd1bGFyXFxBbmd1bGFyIE1hdGVyaWFsXFxBbmd1bGFyTWF0ZXJpYWwxL3NyY1xcYXBwXFxjb250YWN0bWFuYWdlclxcY29tcG9uZW50c1xcdG9vbGJhclxcdG9vbGJhci5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29udGFjdG1hbmFnZXIvY29tcG9uZW50cy90b29sYmFyL3Rvb2xiYXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFFSSxhQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7QUNBSjtBREVLO0VBTkw7SUFPTyxhQUFBO0lBQ0EsbUJBQUE7SUFDQSx1QkFBQTtFQ0NMO0FBQ0Y7QURDSztFQUNFLGVBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtBQ0NQO0FER0E7RUFDRSxlQUFBO0FDQUY7QURHQTtFQUNFLGNBQUE7QUNBRiIsImZpbGUiOiJzcmMvYXBwL2NvbnRhY3RtYW5hZ2VyL2NvbXBvbmVudHMvdG9vbGJhci90b29sYmFyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNpZGVuYXYtdG9nZ2xlXHJcbntcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICBtYXJnaW46IDBweDtcclxuICAgIG1pbi13aWR0aDogNTZweDtcclxuICAgIFxyXG4gICAgIEBtZWRpYShtYXgtd2lkdGg6IDcyMHB4KSB7XHJcbiAgICAgICBkaXNwbGF5IDpmbGV4OyBcclxuICAgICAgIGFsaWduLWl0ZW1zOmNlbnRlcjtcclxuICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOyAgXHJcbiAgICAgfVxyXG5cclxuICAgICBtYXQtaWNvbntcclxuICAgICAgIGZvbnQtc2l6ZTogMzBweDtcclxuICAgICAgIGhlaWdodDogNTZweDtcclxuICAgICAgIHdpZHRoOiA1NnB4O1xyXG4gICAgICAgY29sb3I6d2hpdGU7XHJcbiAgICAgICBsaW5lLWhlaWdodDogNTZweDtcclxuICAgICB9XHJcbn1cclxuXHJcbi5leGFtcGxlLWljb24ge1xyXG4gIHBhZGRpbmc6IDAgMTRweDtcclxufVxyXG5cclxuLmV4YW1wbGUtc3BhY2VyIHtcclxuICBmbGV4OiAxIDEgYXV0bztcclxufSIsIi5zaWRlbmF2LXRvZ2dsZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIG1hcmdpbjogMHB4O1xuICBtaW4td2lkdGg6IDU2cHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcbiAgLnNpZGVuYXYtdG9nZ2xlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIH1cbn1cbi5zaWRlbmF2LXRvZ2dsZSBtYXQtaWNvbiB7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgaGVpZ2h0OiA1NnB4O1xuICB3aWR0aDogNTZweDtcbiAgY29sb3I6IHdoaXRlO1xuICBsaW5lLWhlaWdodDogNTZweDtcbn1cblxuLmV4YW1wbGUtaWNvbiB7XG4gIHBhZGRpbmc6IDAgMTRweDtcbn1cblxuLmV4YW1wbGUtc3BhY2VyIHtcbiAgZmxleDogMSAxIGF1dG87XG59Il19 */"

/***/ }),

/***/ "./src/app/contactmanager/components/toolbar/toolbar.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/contactmanager/components/toolbar/toolbar.component.ts ***!
  \************************************************************************/
/*! exports provided: ToolbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolbarComponent", function() { return ToolbarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm2015/dialog.js");
/* harmony import */ var _new_contact_dialog_new_contact_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../new-contact-dialog/new-contact-dialog.component */ "./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.ts");





let ToolbarComponent = class ToolbarComponent {
    constructor(dialog) {
        this.dialog = dialog;
        this.sidenavtoggle = new events__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
    }
    ngOnInit() {
    }
    openAddContactDialog() {
        let dialogref = this.dialog.open(_new_contact_dialog_new_contact_dialog_component__WEBPACK_IMPORTED_MODULE_4__["NewContactDialogComponent"], {
            height: '400px',
            width: '600px'
        });
        dialogref.afterClosed().subscribe(res => console.log("Dialog closed", res));
    }
};
ToolbarComponent.ctorParameters = () => [
    { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__["MatDialog"] }
];
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])()
], ToolbarComponent.prototype, "sidenavtoggle", void 0);
ToolbarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-toolbar',
        template: __webpack_require__(/*! raw-loader!./toolbar.component.html */ "./node_modules/raw-loader/index.js!./src/app/contactmanager/components/toolbar/toolbar.component.html"),
        styles: [__webpack_require__(/*! ./toolbar.component.scss */ "./src/app/contactmanager/components/toolbar/toolbar.component.scss")]
    })
], ToolbarComponent);



/***/ }),

/***/ "./src/app/contactmanager/contactmanager-app/contactmanager-app.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/contactmanager/contactmanager-app/contactmanager-app.component.ts ***!
  \***********************************************************************************/
/*! exports provided: ContactmanagerAppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactmanagerAppComponent", function() { return ContactmanagerAppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/esm2015/icon.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");





let ContactmanagerAppComponent = class ContactmanagerAppComponent {
    constructor(iconRegistry, sanitizer, http, httpm) {
        iconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('/assets/avatars.svg'));
    }
    ngOnInit() {
    }
};
ContactmanagerAppComponent.ctorParameters = () => [
    { type: _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__["MatIconRegistry"] },
    { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["DomSanitizer"] },
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] },
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"] }
];
ContactmanagerAppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-contactmanager-app',
        template: `
    <app-sidenav></app-sidenav>
  `
    })
], ContactmanagerAppComponent);



/***/ }),

/***/ "./src/app/contactmanager/contactmanager.module.ts":
/*!*********************************************************!*\
  !*** ./src/app/contactmanager/contactmanager.module.ts ***!
  \*********************************************************/
/*! exports provided: ContactmanagerModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactmanagerModule", function() { return ContactmanagerModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _contactmanager_app_contactmanager_app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contactmanager-app/contactmanager-app.component */ "./src/app/contactmanager/contactmanager-app/contactmanager-app.component.ts");
/* harmony import */ var _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/toolbar/toolbar.component */ "./src/app/contactmanager/components/toolbar/toolbar.component.ts");
/* harmony import */ var _components_toolbar_sidenav_sidenav_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/toolbar/sidenav/sidenav.component */ "./src/app/contactmanager/components/toolbar/sidenav/sidenav.component.ts");
/* harmony import */ var _components_toolbar_main_content_main_content_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/toolbar/main-content/main-content.component */ "./src/app/contactmanager/components/toolbar/main-content/main-content.component.ts");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm2015/flex-layout.js");
/* harmony import */ var _shared_material_material_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../shared/material/material.module */ "./src/app/shared/material/material.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./service/user.service */ "./src/app/contactmanager/service/user.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _components_notes_notes_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/notes/notes.component */ "./src/app/contactmanager/components/notes/notes.component.ts");
/* harmony import */ var _components_new_contact_dialog_new_contact_dialog_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/new-contact-dialog/new-contact-dialog.component */ "./src/app/contactmanager/components/new-contact-dialog/new-contact-dialog.component.ts");















const routes = [
    { path: '', component: _contactmanager_app_contactmanager_app_component__WEBPACK_IMPORTED_MODULE_3__["ContactmanagerAppComponent"],
        children: [
            { path: '', component: _components_toolbar_main_content_main_content_component__WEBPACK_IMPORTED_MODULE_6__["MainContentComponent"] },
            { path: ':id', component: _components_toolbar_main_content_main_content_component__WEBPACK_IMPORTED_MODULE_6__["MainContentComponent"] }
        ] },
    { path: '**', redirectTo: '' }
];
let ContactmanagerModule = class ContactmanagerModule {
};
ContactmanagerModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        // tslint:disable-next-line: max-line-length
        declarations: [_contactmanager_app_contactmanager_app_component__WEBPACK_IMPORTED_MODULE_3__["ContactmanagerAppComponent"], _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_4__["ToolbarComponent"], _components_toolbar_sidenav_sidenav_component__WEBPACK_IMPORTED_MODULE_5__["SidenavComponent"], _components_toolbar_main_content_main_content_component__WEBPACK_IMPORTED_MODULE_6__["MainContentComponent"], _components_notes_notes_component__WEBPACK_IMPORTED_MODULE_13__["NotesComponent"], _components_new_contact_dialog_new_contact_dialog_component__WEBPACK_IMPORTED_MODULE_14__["NewContactDialogComponent"]],
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_12__["HttpClientModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_9__["FormsModule"],
            _angular_flex_layout__WEBPACK_IMPORTED_MODULE_7__["FlexLayoutModule"],
            _shared_material_material_module__WEBPACK_IMPORTED_MODULE_8__["MaterialModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_10__["RouterModule"].forChild(routes)
        ],
        providers: [_service_user_service__WEBPACK_IMPORTED_MODULE_11__["UserService"]],
        entryComponents: [_components_new_contact_dialog_new_contact_dialog_component__WEBPACK_IMPORTED_MODULE_14__["NewContactDialogComponent"]]
    })
], ContactmanagerModule);



/***/ }),

/***/ "./src/app/contactmanager/models/user.ts":
/*!***********************************************!*\
  !*** ./src/app/contactmanager/models/user.ts ***!
  \***********************************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
class User {
    constructor() {
        this.notes = [];
    }
}


/***/ }),

/***/ "./src/app/contactmanager/service/user.service.ts":
/*!********************************************************!*\
  !*** ./src/app/contactmanager/service/user.service.ts ***!
  \********************************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");




let UserService = class UserService {
    constructor(http) {
        this.http = http;
        this._users = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"]([]);
        this.dateStore = { users: [] };
    }
    get users() {
        return this._users.asObservable();
    }
    userById(id) {
        return this.dateStore.users.find(x => x.id == id);
    }
    loadAll() {
        const userUrl = 'https://angular-material-api.azurewebsites.net/users';
        return this.http.get(userUrl)
            .subscribe(data => {
            this.dateStore.users = data;
            this._users.next(Object.assign({}, this.dateStore).users);
        }, error => {
            console.log('Failed');
        });
    }
};
UserService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
UserService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], UserService);



/***/ })

}]);
//# sourceMappingURL=contactmanager-contactmanager-module-es2015.js.map