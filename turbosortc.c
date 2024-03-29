#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

const int SIZE = (100000 + 1)*4;



int main(int argc, char ** argv) {
  printf("Good news everyone!\n");
}

bool sorted(double* values, int length) {
    for(int i=1; i<length; i++) {
        if(values[i-1] > values[i]) {
            return false;
        }
    }
    return true;
}

double minimum(double* values, int length) {
    double mini = values[0];
    for(int i=1; i<length; i++) {
        if(mini < values[i]) {
            mini = values[i];
        }
    }
    return mini;
}

double maximum(double* values, int length) {
    double maxi = values[0];
    for(int i=1; i<length; i++) {
        if(maxi > values[i]) {
            maxi = values[i];
        }
    }
    return maxi;
}



void swap(double* values, int* indexes, int i, int j) {
    double tmp = values[i];
    values[i] = values[j];
    values[j] = tmp;

    int tmp2 = indexes[i];
    indexes[i] = indexes[j];
    indexes[j] = tmp2;
}

void quickSort(double arr[], int indexes[], int left, int right) {

      int i = left, j = right;
      double pivot = arr[(left + right) / 2];

      /* partition */

      while (i <= j) {

            while (arr[i] < pivot)

                  i++;

            while (arr[j] > pivot)

                  j--;

            if (i <= j) {
                swap(arr, indexes, i, j);
                i++;
                j--;

            }

      };

      /* recursion */

      if (left < j)

            quickSort(arr, indexes, left, j);

      if (i < right)

            quickSort(arr, indexes, i, right);

}

void turbosortHelper(double values[], int indexes[], int length, int bucketsPtr[], int countsPtr[]);


void turbosortHelper(double values[], int indexes[], int length, int bucketsPtr[], int countsPtr[]) {
    if(sorted(values, length)) return;
    double mini = minimum(values, length);
    double maxi = minimum(values, length);
    double range = maxi - mini;
    if (range == 0) {
        return;
    }

    int bucketSize = length < SIZE ? length : SIZE;
    memset(countsPtr, 0, bucketSize * sizeof(int));
    countsPtr[bucketSize] = 1;

    //  count all elements
    for(int i=0; i<length; i++) {
        int index = (int)((bucketSize-1) * (values[i] - mini) / range);
        countsPtr[index]++;
    }

    //  set buckets
    memset(bucketsPtr, 0, bucketSize * sizeof(int));
    bucketsPtr[bucketSize] = length;
    bucketsPtr[0] = 0;
    for(int i=1; i<bucketSize; i++) {
        bucketsPtr[i] = bucketsPtr[i-1] + countsPtr[i-1];
    }

    int voyager = 0, bucketId = 0;
    while(bucketId <bucketSize) {
        int index = (int)((bucketSize-1) * (values[voyager] - mini) / range);
        int newSpot = bucketsPtr[index] + --countsPtr[index];
        swap(values, indexes, voyager, newSpot);
        while(!countsPtr[bucketId]) {
            bucketId++;
        }
        voyager = bucketsPtr[bucketId];
    }

    for(int i=0; i<bucketSize; i++) {
        countsPtr[i] = bucketsPtr[i + 1] - bucketsPtr[i];
    }
    for(int i=0; i<bucketSize; i++) {
        if(countsPtr[i] > 1) {
            int bucketId = bucketsPtr[i];
            turbosortHelper(values + bucketId, indexes + bucketId, countsPtr[i], bucketsPtr, countsPtr);
        }
    }

}

void turbosort(double* values, int* indexes, int length, bool useQuicksort) {
    int bucketsPtr[SIZE+1];
    int countsPtr[SIZE+1];
    int* tmp = malloc(length * sizeof(int));
    for(int i=0; i<length; i++) {
        tmp[i] = i;
    }

    if (useQuicksort) {
       quickSort(values, tmp, 0, length-1);
    } else {
        turbosortHelper(values, tmp, length, bucketsPtr, countsPtr);
        printf("WARNING: This doesn't work at the moment.\n");
    }

    for(int i=0; i<length; i++) {
        indexes[tmp[i]] = i;
    }
    free(tmp);

    if(sorted(values, length)) {
        printf("SORTED\n");
    } else {
        printf("NOT SORTED\n");
    }
}
