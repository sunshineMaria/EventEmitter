function EventEmitter() {
	this._events = this._events || {};
}

EventEmitter.prototype.on = function( type, listener ){
	if (typeof listener !== 'function')
    throw TypeError('listener must be a function');

	if (!this._events)
	    this._events = {};

	if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;

 	else if (typeof this._events[type] === 'object')
    	// If we've already got an array, just append.
    	this._events[type].push(listener);
  	else
   		// Adding the second element, need to change to array.
    	this._events[type] = [this._events[type], listener];

    return this;
}

EventEmitter.prototype.off = function( type, listener ){
	if (typeof listener !== 'function')
    	throw TypeError('listener must be a function');

    if (!this._events || !this._events[type])
    return this;
	
	list = this._events[type];
  	length = list.length;
  	position = -1;
	
	for (i = length; i-- > 0;) {
      if (list[i] === listener) {
        position = i;
        break;
      }
    }
    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

	return this;
}

EventEmitter.prototype.emit = function( type ){
	if (!this._events)
    this._events = {};
	var handler = this._events[type];
	//轮流执行函数中的项
	handler.forEach(function( value, index ){
		handler[ index ]();
	})
}


exports.EventEmitter = EventEmitter;