import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain";

describe("Simple Storage", function () {
    let simpleStorageFactory: SimpleStorage__factory,
        simpleStorage: SimpleStorage;

    beforeEach(async function () {
        simpleStorageFactory = (await ethers.getContractFactory(
            "SimpleStorage"
        )) as SimpleStorage__factory;
        simpleStorage = await simpleStorageFactory.deploy();
        await simpleStorage.deployed();
    });

    it("Should start with a favourite number of 0", async function () {
        let currentValue = await simpleStorage.retrieve();
        expect(currentValue).to.equal(0);
    });

    it("Should update when we call store", async function () {
        let expectedValue = 7;
        let transactionResponse = await simpleStorage.store(expectedValue);
        let transactionReceipt = await transactionResponse.wait();
        let currentValue = await simpleStorage.retrieve();
        expect(currentValue).to.equal(expectedValue);
    });
});
