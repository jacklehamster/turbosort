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
        var start = Date.now();
        var valuesPtr = Module._malloc(length * Float64Array.BYTES_PER_ELEMENT);
        var indexesPtr = Module._malloc(length * Uint32Array.BYTES_PER_ELEMENT);
        for(let i=0; i<length; i++) {
            Module.HEAPF64[(valuesPtr / Float64Array.BYTES_PER_ELEMENT) + i] = indexFunction(array[i]);
        }

        Module.ccall('turbosort', 'void', ['number', 'number', 'number'], [valuesPtr, indexesPtr, length]);

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

        Module._free(valuesPtr);
        Module._free(indexesPtr);
    }

    function swap(array, a, b) {
        const temp = array[a];
        array[a] = array[b];
        array[b] = temp;
    }
    return turboSort;
})();
