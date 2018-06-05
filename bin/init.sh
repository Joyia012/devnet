#!/bin/bash

PROJECT="devnet-witness"
CONFDIR="$HOME/.config"

if [ -d node_modules/core ]; then
    echo "Setting devnet constants:"
    cp -v config/constants.js node_modules/core/constants.js
else
    echo "Project is not ready yet. Run 'npm install' first!"
    exit -1
fi

if [ -d "$CONFDIR/$PROJECT" ]; then
    echo "Configuration directory already exists."
else
    echo "Creating configuration directory with default keys:"
    cp -vr config/$PROJECT $CONFDIR/
fi


echo "Fixing DAG explorer to update automatically"
sed -i -e 's/new_joint/new_my_transactions/' node_modules/explorer/explorer.js

echo "You can now run 'npm run genesis'"
