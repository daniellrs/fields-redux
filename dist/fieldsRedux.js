(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './actions', './fieldsReduxStore'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./actions'), require('./fieldsReduxStore'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.actions, global.fieldsReduxStore);
    global.fieldsRedux = mod.exports;
  }
})(this, function (exports, _actions, _fieldsReduxStore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getAllFields = exports.clearAllFields = exports.getDefinedPropsField = exports.destroyField = exports.setField = exports.getField = exports.fieldChangeListener = exports.setObjectFieldsValue = exports.getObjectFieldsKey = exports.initializeField = undefined;

  var fieldsRedux = _interopRequireWildcard(_actions);

  var _fieldsReduxStore2 = _interopRequireDefault(_fieldsReduxStore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var initializeField = exports.initializeField = function initializeField(field, defaultFieldValue) {

    if (!field) {
      console.error('A field name must be declared (simplerdux internal function initializeField)');
      return;
    }

    var fieldObject = getField(field);

    if (!fieldObject.initialized) {

      var fieldValue = {
        initialized: true,
        value: fieldObject.value || defaultFieldValue
      };

      setField(field, fieldValue);
    }
  };

  var getObjectFieldsKey = exports.getObjectFieldsKey = function getObjectFieldsKey(field) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'value';


    if (!field) {
      console.error('A field name must be declared (simplerdux internal function getObjectFieldsKey)');
      return;
    }

    var fieldObject = getField(field);
    var obj = {};

    objectFieldsKeyFinder(obj, fieldObject, key);

    return obj;
  };

  var setObjectFieldsValue = exports.setObjectFieldsValue = function setObjectFieldsValue(field, obj) {
    for (var _len = arguments.length, recursive = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      recursive[_key - 3] = arguments[_key];
    }

    var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'value';


    if (!field) {
      console.error('A field name must be declared (simplerdux internal function setObjectFieldsValue)');
      return;
    }

    Object.keys(obj).map(function (k) {
      if (recursive.length === 0 || !recursive[0] || _typeof(obj[k]) !== 'object') {

        if (_typeof(obj[k]) !== 'object' || Array.isArray(obj[k])) {
          setField(field + '.' + k, _defineProperty({}, key, obj[k]));
        }
      } else {
        recursive.shift();
        setObjectFieldsValue.apply(undefined, [field + '.' + k, obj[k], key].concat(recursive));
      }
    });
  };

  var objectFieldsKeyFinder = function objectFieldsKeyFinder(obj, fieldObject, key) {
    Object.keys(fieldObject).map(function (k) {
      if (fieldObject[k]) {
        obj[k] = fieldObject[k][key];
      }
      if (_typeof(fieldObject[k]) === 'object') {
        objectFieldsKeyFinder(obj, fieldObject[k], key);
      }
      return undefined;
    });
  };

  var fieldChangeListener = exports.fieldChangeListener = function fieldChangeListener(field, fieldDidUpdate, prevProps) {

    if (!field) {
      console.error('A field name must be declared (simplerdux internal function fieldChangeListener)');
      return;
    }

    if (fieldDidUpdate) {

      var fieldObject = getField(field);
      var prevFieldAux = getDefinedPropsField(field, prevProps);

      var changed = false;

      Object.keys(fieldObject).map(function (key) {
        if (fieldObject[key] !== prevFieldAux[key] && _typeof(fieldObject[key]) !== 'object') {
          changed = true;
        }
        return undefined;
      });

      if (changed) {
        fieldDidUpdate(fieldObject, prevFieldAux);
      }
    }
  };

  var getField = exports.getField = function getField(field, props) {

    if (!field) {
      console.error('A field name must be declared (simplerdux internal function getField)');
      return;
    }

    var fieldObject = {};
    var path = field.split('.');

    try {
      fieldObject = props || getAllFields();

      path.map(function (p) {
        fieldObject = fieldObject[p];
        return undefined;
      });
    } catch (e) {}

    return fieldObject || {};
  };

  var setField = exports.setField = function setField(field, value) {

    if (!field) {
      console.error('A field name must be declared (simplerdux internal function setField)');
      return;
    }

    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || Array.isArray(value)) {
      value = { value: value };
    }

    return reduxField(field, value);
  };

  var destroyField = exports.destroyField = function destroyField(field) {

    if (!field) {
      console.error('A field name must be declared (simplerdux internal function destroyField)');
      return;
    }

    return reduxField(field, undefined, true);
  };

  var getDefinedPropsField = exports.getDefinedPropsField = function getDefinedPropsField(field, props) {

    if (!field) {
      console.error('A field name must be declared (simplerdux internal function getDefinedPropsField)');
      return;
    }

    return getField(field, props);
  };

  var clearAllFields = exports.clearAllFields = function clearAllFields() {
    _fieldsReduxStore2.default.getStore().dispatch(fieldsRedux.clearAllFields());
  };

  var getAllFields = exports.getAllFields = function getAllFields() {
    return getStoreState().fields;
  };

  var reduxField = function reduxField(field, value, remove) {

    if (!field) {
      console.error('A field name must be declared (simplerdux internal function reduxField)');
      return;
    }

    var fields = {};
    var allFields = getAllFields() || {};
    Object.keys(allFields).map(function (k) {
      fields[k] = _extends({}, allFields[k]);
      return undefined;
    });

    var path = field.split('.');
    var temp = {};
    var fieldObject = void 0;

    path.map(function (part, index) {

      if (index === path.length - 1) {

        if (path.length === 1) {
          if (!fields[part]) {
            fields[part] = {};
          }
          temp = fields;
        }

        if (value) {
          temp[part] = _extends({}, temp[part], value);
        } else if (remove) {
          delete temp[part];
        }

        fieldObject = temp[part] ? temp[part] : {};
      } else if (index > 0) {
        if (!temp[part]) {
          temp[part] = {};
        }
        temp = temp[part];
      } else {
        if (!fields[part]) {
          fields[part] = {};
        }
        temp = fields[part];
      }

      return undefined;
    });

    if (value || remove) {
      _fieldsReduxStore2.default.getStore().dispatch(fieldsRedux.setFields(fields));
    }

    return fieldObject;
  };

  var getStoreState = function getStoreState() {
    return _fieldsReduxStore2.default.getStore().getState()['fieldsReduxReducer'] ? _fieldsReduxStore2.default.getStore().getState()['fieldsReduxReducer'] : _fieldsReduxStore2.default.getStore().getState();
  };
});