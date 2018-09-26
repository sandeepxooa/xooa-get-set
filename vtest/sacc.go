/*
 * Copyright IBM Corp All Rights Reserved
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 package main

 import (
	 "fmt"
 
	 "github.com/hyperledger/fabric/core/chaincode/shim"
	 "github.com/hyperledger/fabric/protos/peer"
 )
 
 // SimpleAsset implements a simple chaincode to manage an asset
 type SimpleAsset struct {
 }
 // ...... checking if commit id gets updated
 // Init is called during chaincode instantiation to initialize any
 // data. Note that chaincode upgrade also calls this function to reset
 // or to migrate data.
 func (t *SimpleAsset) Init(stub shim.ChaincodeStubInterface) peer.Response {
	 return shim.Success(nil)
 }
 
 // Invoke is called per transaction on the chaincode. Each transaction is
 // either a 'get' or a 'set' on the asset created by Init function. The Set
 // method may create a new asset by specifying a new key-value pair.
 func (t *SimpleAsset) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	 // Extract the function and args from the transaction proposal
	 fn, args := stub.GetFunctionAndParameters()
 
	 fmt.Println("invoke is running " + fn)
	 return get(stub, args , fn)
 }
 
 
 // Get returns the value of the specified asset key
 func get(stub shim.ChaincodeStubInterface, args []string, fn  string ) peer.Response  {
	 fmt.Println("- start get value")
	 
	 return stub.InvokeChaincode("sandeepxooagndfr7ybu", [][]byte{[]byte(fn),[]byte(args[0])}, "chus-east-1-0433560f-ff8a-4fa4-b74d-6cc710897098");
	
 }
 
 // main function starts up the chaincode in the container during instantiate
 func main() {
	 if err := shim.Start(new(SimpleAsset)); err != nil {
		 fmt.Printf("Error starting SimpleAsset chaincode: %s", err)
	 }
 }
 