// imports
import { ethers, run, network } from "hardhat";

// async main
async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Contract deployed to ${simpleStorage.address}`);

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is ${currentValue}`);
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is ${updatedValue}`);
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying Contract....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgs: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(error);
    }
  }
}

// main
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
