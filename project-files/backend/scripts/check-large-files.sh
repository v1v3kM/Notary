#!/usr/bin/env bash
# List files larger than 1MB in the repo tree
find . -type f -size +1M -exec du -h {} + | sort -hr | head -n 50
