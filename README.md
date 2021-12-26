# turbosort
Fastest sorting algorithm in the world


To build:
emcc turbosortc.c -o turbosortc.js -s EXPORTED_FUNCTIONS="['_malloc']" -s EXPORTED_RUNTIME_METHODS="['ccall']" -s ALLOW_MEMORY_GROWTH=1  -s LINKABLE=1 -s EXPORT_ALL=1