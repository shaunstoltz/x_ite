
define (function ()
{
'use strict';

	return function (arr) {
	  if (!arr) return false;
	  return (
	    arr.data !== undefined &&
	    Array.isArray(arr.shape) &&
	    arr.offset !== undefined &&
	    arr.stride !== undefined
	  );
	};
});
