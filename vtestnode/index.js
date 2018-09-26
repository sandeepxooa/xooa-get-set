/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

"use strict";
const shim = require("fabric-shim");

const ClientIdentity = require("fabric-shim").ClientIdentity;

let Chaincode = class {
  // The Init method is called when the Smart Contract 'fabcar' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info("=========== Instantiated fabcar chaincode ===========");
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'fabcar'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let cid = new ClientIdentity(stub); // "stub" is the ChaincodeStub object passed to Init() and Invoke() methods
    console.log("cid", JSON.stringify(cid));
    console.log("stub", JSON.stringify(stub));

    let method = this[ret.fcn];

    try {
      if (!method) {
        console.error("no function of name:" + ret.fcn + " found");
        throw new Error("Received unknown function " + ret.fcn + " invocation");
      }
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async get(stub, args) {
    if (args.length != 1) {
      throw new Error(
        "Incorrect number of arguments. Expecting CarNumber ex: CAR01"
      );
    }
    let carNumber = args[0];

    let carAsBytes = await stub.getState(carNumber); //get the car from chaincode state
    if (!carAsBytes || carAsBytes.toString().length <= 0) {
      throw new Error(carNumber + " does not exist: ");
    }
    console.log(carAsBytes.toString());
    return carAsBytes;
  }

  async set(stub, args) {
    console.info("============= START : Create Car ===========");
    if (args.length != 2) {
      throw new Error("Incorrect number of arguments. Expecting 5");
    }

    await stub.putState(args[0], Buffer.from(args[1]));
    console.info("============= END : Create Car ===========");
  }
};

shim.start(new Chaincode());
