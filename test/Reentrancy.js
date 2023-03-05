const { expect } = require('chai')
const hre = require('Hardhat')

describe('Reentrancy', () => {
	let deployer
	let bank, attackerContract

	beforeEach(async () => {
		[deployer, user, attacker] = await ethers.getSigners()

		const Bank = await ethers.getContractFactory('Bank', deployer)
		bank = await Bank.deploy()

		await bank.deposit({ value: ethers.utils.parseEther('1000') })
		bank.connect(user).deposit({ value: ethers.utils.parseEther('50') })

		const Attacker = await ethers.getContractFactory('Attacker', attacker)
		attackerContract = await Attacker.deploy(bank.address)
		})

		describe('Facilitates deposits and withdrawals', () => {
			it('accepts deposits', async () => {
				//check deposit balance
				const deployerBalance = await bank.balanceOf(deployer.address)
				expect(deployerBalance).to.eq(ethers.utils.parseEther('1000'))
				
				const userBalance = await bank.balanceOf(user.address)
				expect(userBalance).to.eq(ethers.utils.parseEther('50'))

				
				})

				it ('accepts withdraws', async () => {
					await bank.withdraw()

					const deployerBalance = await bank.balanceOf(deployer.address)
					const userBalance = await bank.balanceOf(user.address) 

					expect(deployerBalance).to.eq(0)
					expect(userBalance).to.eq(ethers.utils.parseEther('50'))
				})

				it('allows attacker to drain funds from withdraw()', async () => {
					console.log('*** Before***')
				    console.log(`Bank's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`)
				    console.log(`Attacker's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`)
				    //Perform Attack
				    await attackerContract.attack({ value: ethers.utils.parseEther('10')})
				    //After Attack
				    console.log('*** After***')
				    console.log(`Bank's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`)
				    console.log(`Attacker's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`)

				    expect(await ethers.provider.getBalance(bank.address)).to.eq(0)
				})

			})
	})