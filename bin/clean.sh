#!/bin/bash

# Function to remove specified directories
remove_directories() {
    local dir=$1
    local dirs_to_remove=("node_modules" "dist" "out" "release")
    for sub_dir in "${dirs_to_remove[@]}"; do
        if [ -d "$dir/$sub_dir" ]; then
            echo "Removing ${dir%/}/$sub_dir..."
            rm -rf "${dir%/}/$sub_dir"
        fi
    done
}

# Remove directories in root
remove_directories .

# Remove directories in apps/{appName}
for dir in apps/*/; do
    remove_directories "$dir"
done

# Remove directories in pro/{appName}
for dir in pro/*/; do
    remove_directories "$dir"
done

# Remove directories in packages/{packageName}
for dir in packages/*/; do
    remove_directories "$dir"
done

echo "All specified directories have been removed."
