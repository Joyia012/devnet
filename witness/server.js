"use strict";
require("core/wallet.js");
const witness = require('witness');
const explorer = require('explorer/explorer.js');
const headlessWallet = require('headless-wallet');
const eventBus = require('core/event_bus.js');
const validationUtils = require("core/validation_utils.js");
const conf = require('core/conf.js');
const constants = require('core/constants.js');

function initRPC() {
	var rpc = require('json-rpc2');

	var server = rpc.Server.$create({
		'websocket': true, // is true by default 
		'headers': { // allow custom headers is empty by default 
			'Access-Control-Allow-Origin': '*'
		}
	});

	/**
	 * Send funds to address.
	 * If address is invalid, then returns "invalid address".
	 * @param {String} address
	 * @param {Integer} amount
	 * @return {String} status
	 */
	server.expose('sendtoaddress', function(args, opt, cb) {
		var amount = args[1];
		var toAddress = args[0];
		if (amount && toAddress) {
			if (validationUtils.isValidAddress(toAddress))
				headlessWallet.issueChangeAddressAndSendPayment(null, amount, toAddress, null, function(err, unit) {
					cb(err, err ? undefined : unit);
				});
			else
				cb("invalid address");
		}
		else
			cb("wrong parameters");
	});
}

function postTimestamp(address) {
	var composer = require('core/composer.js');
	var network = require('core/network.js');
	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: function(err) {
			console.error(err);
		},
		ifError: function(err) {
			console.error(err);
		},
		ifOk: function(objJoint) {
			network.broadcastJoint(objJoint);
		}
	});

	var datafeed = {
		time: new Date().toString(),
		timestamp: Date.now()
	};
	composer.composeDataFeedJoint(address, datafeed, headlessWallet.signer, callbacks);
}

eventBus.once('headless_wallet_ready', function() {
	initRPC();
	headlessWallet.readSingleAddress(function(address) {
		setInterval(postTimestamp, conf.TIMESTAMPING_INTERVAL, address);
	});
});

eventBus.on('paired', function(from_address) {
    console.log('Sucessfully paired with:' + from_address);
    const device = require('core/device.js');
    device.sendMessageToDevice(from_address, "text", "Welcome to devnet Witness!");
});
