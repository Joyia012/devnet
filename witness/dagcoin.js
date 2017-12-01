"use strict";
const headlessWallet = require('headless-byteball');
const eventBus = require('byteballcore/event_bus.js');

function onError(err) {
    throw Error(err);
}

function createDagcoin(address, onDone) {
    var composer = require('byteballcore/composer.js');
    var network = require('byteballcore/network.js');
    var callbacks = composer.getSavingCallbacks({
        ifNotEnoughFunds: onError,
        ifError: onError,
        ifOk: function (objJoint) {
            network.broadcastJoint(objJoint);
            onDone(objJoint.unit.unit);
        }
    });
    var asset = {
        cap: 1000000000000000,
        is_private: false,
        is_transferrable: true,
        auto_destroy: false,
        fixed_denominations: false,
        issued_by_definer_only: true,
        cosigned_by_definer: false,
        spender_attested: false,
    };
    composer.composeAssetDefinitionJoint(address, asset, headlessWallet.signer, callbacks);
}

eventBus.once('headless_wallet_ready', function() {
    headlessWallet.readSingleAddress(function(address) {
        createDagcoin(address, function(assetHash) {
            console.log("Dagcoin asset created: " + assetHash);
            process.exit(0);
        });
    });
});
