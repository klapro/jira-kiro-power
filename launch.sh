#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
exec node "$DIR/build/index.js"
