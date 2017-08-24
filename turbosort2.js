var turbosort2 = (function() {

    const SIZE = 1000000;
    const buckets = new Uint32Array(SIZE+1);
    const counts = new Uint32Array(SIZE+1);
    let indexFunction = identity;

    /**
     *  FUNCTION DEFINITIONS
     */
    function getMinMax(array, offset, length) {
        let firstIndex = indexFunction(array[offset]);
        let minNum = firstIndex;
        let maxNum = firstIndex;
        let previousNum = firstIndex;
        let inOrder = true;
        for(let i=1; i<length; i++) {
            const index = indexFunction(array[offset+i]);
            if(previousNum > index) {
                inOrder = false;
                if(index < minNum) {
                    minNum = index;
                }
            } else {
                if(index > maxNum) {
                    maxNum = index;
                }
            }
            previousNum = index;
        }
        min_max_result.min = minNum;
        min_max_result.max = maxNum;
        min_max_result.inOrder = inOrder;
        return min_max_result;
    }
    const min_max_result = {
        min: 0,
        max: 0,
        inOrder: false,
    };

    function identity(a) {
        return a;
    }

    function turboSort(array, size, func) {
        if(array) {
            size = size ? Math.min(size,array.length) : array.length;
            if(size > 1) {
                indexFunction = func ? func : identity;
                turboSortHelper(array, 0, size ? size : array.length);
            }
        }
    }


    function setIndexer(element, index, array) {
        array[index] = indexFunction(element);
    }

    function setOrder() {
    }

    function turboSortHelper(array, offset, length) {
//        Float32Array.BYTES_PER_ELEMENT;
//        var values = new Float32Array(length);
        var start = Date.now();
        var valuesPtr = Module._malloc(length * Float64Array.BYTES_PER_ELEMENT);
        var indexesPtr = Module._malloc(length * Uint32Array.BYTES_PER_ELEMENT);
        for(let i=0; i<length; i++) {
            Module.HEAPF64[(valuesPtr / Float64Array.BYTES_PER_ELEMENT) + i] = indexFunction(array[i]);
//            Module.HEAPU32[(indexesPtr / Uint32Array.BYTES_PER_ELEMENT) + i] = i;
        }

        var n = Date.now();
        console.log(n-start);
        start = n;

//        debugger;
        //1000000
//        var bucketsPtr = Module._malloc((SIZE+1) * Uint32Array.BYTES_PER_ELEMENT);
  //      var countsPtr = Module._malloc((SIZE+1) * Uint32Array.BYTES_PER_ELEMENT);
//        var indexes = new Uint32Array(length);
//        indexes.forEach(function(element, index, indexes) {
//            indexes[index] = index;
//        });

//        console.log(values, indexes);

   //     var valuesBytes = values.length * values.BYTES_PER_ELEMENT;
 //       var valuesPtr = Module._malloc(valuesBytes);
//        console.log(valuesBytes, values.BYTES_PER_ELEMENT, valuesPtr);
        //Module.HEAPF32.set(values, valuesPtr  >> 2);

        /*
         var samples = new Float32Array(1024);
         var buffer = Module._malloc(1024*4);
         Module.HEAPF32.set(samples, buffer >> 2);
         Module._free(buffer);

         */

//        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, ptr, valuesBytes);
  //      dataHeap.set(new Uint8Array(values.buffer));


 //       var indexesBytes = indexes.length * indexes.BYTES_PER_ELEMENT;
//        var indexesPtr = Module._malloc(indexesBytes);
  //      Module.HEAPU32.set(indexes, indexesPtr >> 2);

        Module.ccall('turbosort', 'void', ['number', 'number', 'number'], [valuesPtr, indexesPtr, length]);

        var n = Date.now();
        console.log(n-start);
        start = n;

//        [3,2,0,1];
  //      [a,b,c,d]
    //    [d,b,c,A] 0
    //    [d,A,c,b]
    //    [d,c,A,b]
    //    [d,c,a,b]


    //    [2,3,0,1]
    //    [a,b,c,d]
    //    [c,b,A,d] 0
    //    [c,b,a,d]
    //    [c,d,a,B] 1
    //    [c,d,a,b]


    //[2 3 1 0]
    //[a,b,c,d]
    //[0 1 2 3]
    //[d c a b]

        //[2 3 1 0]
        //[a,b,c,d]
        //[1 3 2 0]
        //[c b a d]
        //[3 1 2 0]
        //[b c a d]
        //[0 1 2 3]
        //[d c a b]

        var offset = (indexesPtr / Uint32Array.BYTES_PER_ELEMENT);
        for(let i=0; i<length; i++) {
            while(Module.HEAPU32[offset + i] !== i) {
                let dest = Module.HEAPU32[offset + i];
                //swap i and dest
                swap(array, i, dest);

                const temp = Module.HEAPU32[offset + i];
                Module.HEAPU32[offset + i] = Module.HEAPU32[offset + dest];
                Module.HEAPU32[offset + dest] = temp;
            }
        }

        var n = Date.now();
        console.log(n-start);
        start = n;

//        console.log(Module.HEAPF32.subarray(valuesPtr /Float32Array.BYTES_PER_ELEMENT, (valuesPtr /Float32Array.BYTES_PER_ELEMENT)+length));
  //      console.log(Module.HEAPU32.subarray(indexesPtr /Uint32Array.BYTES_PER_ELEMENT, (indexesPtr /Uint32Array.BYTES_PER_ELEMENT)+length));
//        array.forEach(function(element, index) {
//            Module.HEAPF32[(valuesPtr / Float32Array.BYTES_PER_ELEMENT) + index] = indexFunction(element);
  //          Module.HEAPU32[(indexesPtr / Uint32Array.BYTES_PER_ELEMENT) + index] = index;
//        });

        Module._free(valuesPtr);
        Module._free(indexesPtr);
//        Module._free(bucketsPtr);
  //      Module._free(countsPtr);
// Get data byte size, allocate memory on Emscripten heap, and get pointer
//        var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
  //      var dataPtr = Module._malloc(nDataBytes);

// Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
    //    var dataHeap = new Uint8Array(Module.HEAPU8.buffer, ptr, nDataBytes);
      //  dataHeap.set(new Uint8Array(data.buffer));

// Call function and get result
//        float_multiply_array(2, dataHeap.byteOffset, data.length);
  //      var result = new Float32Array(dataHeap.buffer, dataHeap.byteOffset, data.length);

// Free memory
    //    Module._free(dataHeap.byteOffset);

/*        const myArray = new Uint8Array([100, 200, 250]);

        const buffer = Module._malloc(myArray.length);
        Module.HEAPU8.set(myArray, buffer);

        Module.ccall('addThree', 'number', ['number', 'number'], [buffer, myArray.length]);

        console.log(Module.HEAPU8.subarray(buffer, buffer+myArray.length));

        Module._free(buffer);*/
        var n = Date.now();
        console.log(n-start);
        start = n;

    }

    function swap(array, a, b) {
        const temp = array[a];
        array[a] = array[b];
        array[b] = temp;
    }
    return turboSort;
})();
