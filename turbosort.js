var Sorter = (function() {

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
                turboSortHelper(array, 0, size);
            }
        }
    }

    function sorted(array, offset, length) {
        for(let i=1; i<length;i++) {
            if(indexFunction(array[offset + i-1]) > indexFunction(array[offset + i])) {
                return false;
            }
        }
        return true;
    }

    function minimum(array, offset, length) {
        let mini = indexFunction(array[offset]);
        for(let i=1;i<length;i++) {
            const val = indexFunction(array[offset + i]);
            if(val < mini) {
                mini = val;
            }
        }
        return mini;
    }

    function maximum(array, offset, length) {
        let maxi = indexFunction(array[offset]);
        for(let i=1;i<length;i++) {
            const val = indexFunction(array[offset + i]);
            if(val > maxi) {
                maxi = val;
            }
        }
        return maxi;
    }

    function quickSort(array, size, func) {
        if(array) {
            size = size ? Math.min(size,array.length) : array.length;
            if(size > 1) {
                indexFunction = func ? func : identity;
                quickSortHelper(array, 0, size-1);
            }
        }
    }

    function quickSortHelper(items, left, right) {

        var index;

        if (items.length > 1) {

            index = partition(items, left, right);

            if (left < index - 1) {
                quickSortHelper(items, left, index - 1);
            }

            if (index < right) {
                quickSortHelper(items, index, right);
            }

        }

        return items;
    }


    function partition(items, left, right) {

        var pivot   = items[Math.floor((right + left) / 2)],
            i       = left,
            j       = right;


        while (i <= j) {

            while (indexFunction(items[i]) < indexFunction(pivot)) {
                i++;
            }

            while (indexFunction(items[j]) > indexFunction(pivot)) {
                j--;
            }

            if (i <= j) {
                swap(items, i, j);
                i++;
                j--;
            }
        }

        return i;
    }


    function turboSortHelper(array, offset, length) {
        const arrayInfo = getMinMax(array, offset, length);
        if(sorted(array, offset, length)) {
            return;
        }
        if(length<1000) {
            quickSortHelper(array, offset, offset + length - 1);
            return;
        }

        const min = minimum(array, offset, length);
        const max = maximum(array, offset, length);
        const range = max-min;
        if(range===0) {
            return;
        }

        const bucketSize = Math.min(length, SIZE);

        let i, index;
        for(i=0; i<bucketSize; i++) {
            counts[i] = 0;
        }
        counts[bucketSize] = 1;
        for(i=0; i<length; i++) {
            index = Math.floor((bucketSize-1) * (indexFunction(array[i+offset]) - min)/range);
            counts[index]++;
        }

        for(i=0; i<bucketSize; i++) {
            buckets[i] = 0;
        }
        buckets[bucketSize] = offset + length;
        buckets[0] = offset;
        for(i=1; i<bucketSize; i++) {
            buckets[i] = buckets[i-1] + counts[i-1];
        }

        let voyager = offset, bucketId = 0;
        while(bucketId<bucketSize) {
            index = Math.floor((bucketSize-1) * (indexFunction(array[voyager]) - min)/range);
            const newSpot = buckets[index] + --counts[index];
            swap(array,voyager,newSpot);
            while(!counts[bucketId]) {
                bucketId++;
            }
            voyager = buckets[bucketId];
        }
        for(i=0; i<bucketSize; i++) {
            counts[i] = buckets[i + 1] - buckets[i];
        }
        for(i=0; i<bucketSize; i++) {
            if(counts[i] > 1) {
                turboSortHelper(array, buckets[i], counts[i]);
            }
        }
    }

    function swap(array, a, b) {
        const temp = array[a];
        array[a] = array[b];
        array[b] = temp;
    }
    return {
        turbosort: turboSort,
        quicksort: quickSort,
    };
})();
