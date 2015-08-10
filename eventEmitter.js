function EventEmitter() {
	this._events = this._events || {};
}

/**
 * 对参数的type进行检测
 */
function checkArguments( type ) {
	if( typeof(type) != 'string' ){
		console.log( 'event name has to be represented by string');
	}
}
/**
 * 给指定事件添加新的监听器，添加后位于监听器数组末端。
 * 参数 type 表示指定事件，listener表示监听器。
 * type 必须为 string 类型，listener 为 function  类型。
 * 所有 EventEmitter 的实例在添加新的监听器时都会触发 'newListener' 事件。
 */
EventEmitter.prototype.on = function( type, listener ){
	//先判断类型
	checkArguments( type );

	if( !(typeof listener == 'function') ）{
		console.log( 'listener has to be a function');
	};

	//思路：遍历已存在的该事件对应的监听数组。如果有已有的listener和这个新传入的一致，则不触发'newListener'
	//事件，否则触发newListener事件。
	//判断该事件对应的监听数组是否存在,存在则循环判断，否则新建一个该事件对应的数组，并触发‘newListener’事件
	if( this._events[ type ] ){
		var listenerList = this._events[ type ];
		var num = listenerList.length;
		var newflag = true;
		var index = listenerList.indexOf( listener ); //判断原来的数组里有没有该监听函数
		newflag = index > -1 ? false : true;
		if( newflag && this._events[ 'newListener' ] ){
			//添加新的监听器，触发’newListener‘事件。
			this.emit( 'newListener' );
		}
	}else{
		//不存在该事件对应的listener数组，则新建数组
		this._events[ type ] = [];
	}

	// 将listener添加到监听器数组末端
	this._events[ type ].push( listener );
	return this;
}


/**
 * 从监听数组中移除一个特定事件的listener
 * 注意：改变数组中这个listener之后的下标
 * 每次只能移除一个listener，如果该listener被多次添加，则只能多次移除
 */
EventEmitter.prototype.off = function( type, listener ){
	checkArguments( type );

	if( !this._events[ type ] ){
		console.log( 'the event ' + type + ' is not exist' );
	}else {
		//如果存在该事件的数组,但没有传listener的话，删除整个数组
		if( listener == 'undefined' ) {
			delete this._events[ type ];
		}else{
			var listenerList = this._events[ type ];
			var index = listenerList.indexOf( listener );
			if( index > -1 ){
				//如果只剩一个监听函数了，那么删除的时候就将该事件对应的监听数组都删除
				if ( len == 1 ){
					delete this._events[ type ];
				}else{
					listenerList.splice( index, 1 );  //删除i这个位置上的项
				}
			}
			//'removeListener'事件被触发
			if( this._events[ 'removeListener' ] ){
				this.emit( 'removeListener' );
			}
		}
	}
	return this;
}

/**
 * 用提供的参数按序执行listeners
 * 如果事件有listener，返回true,否则，返回false
 */
EventEmitter.prototype.emit = function( type ){
	checkArguments( type );
	// 当一个 EventEmitter 的实例遇到错误时，典型的动作是触发一个 'error' 事件。
	// 在 Node 中，错误事件被视为特殊情况，如果没有监听它，默认会打印一个错误堆栈并退出程序。
  if( type == 'error' ) {
    //判断有没有监听它的事件
    if ( !this._events[ 'error' ] ){
    	console.log( '打印错误堆栈' ); //不会写 默认会打印一个错误堆栈
    	return false;
    }
  }

  if( this._events[ type ] ){
  	//有监听该事件的listener，则按序执行，并返回true
  	var listenerList = this._events[ type ];
  	var listenerLen = listenerList.length;
  	var len = arguments.length;
  	var args = new Array( len-1 ); //新建一个参数数组，用来放所有参数

  	for( var i = 1; i < len; i++ ){
  		args[ i-1 ] = arguments [ i ]; //因为arguments下标为0的位置是type
  	}

  	//函数顺序执行
  	for( var j = 0; j < listenerLen; j++ ){
  		listenerList[ j ].apply( this, args );
  	}
  	return true;

  }else {
  	return false;
  }

}

/**
 * 添加一个一次性listener
 * 这个listener只会在下一次事件发生时被触发一次，触发完成后就被删除。
 * 也就是说当这个type被emit时，通过once添加的listener被执行后删除。
 */
EventEmitter.prototype.once = function( type, listener ){
	checkArguments( type );
	if( !(typeof listener == 'function') ）{
		console.log( 'listener has to be a function');
	}

	function helper(){
		listener.apply( this, arguments );
		this.off( type, helper );
	}

	this.on( type, helper )
	return this;
}


/**
 * 	问题列表：
 * 	1. Multiple calls passing the same combination of event 
 *  and listener will result in the listener being added multiple times.
 *  这个是怎么实现呢？
 *  2. removeListener 和 newListener 事件的监听函数在哪里定义的呀？需要自己定义吗？
 *  3. 比较两个函数是否相等，不能单纯用toString(),这样的话，函数定义里有个空格不一样函数都会不一样，
 *     所以比较函数还需要做处理。
 *  4. 测试还不会用-_—！
 */


exports.EventEmitter = EventEmitter;