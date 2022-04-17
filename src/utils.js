import { providers, utils, connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

export const initContract = async () => {
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
  window.walletConnection = new WalletConnection(near)
  window.accountId = window.walletConnection.getAccountId()
  window.contractName = nearConfig.contractName
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: ['get_greeting'],
    changeMethods: ['send_tip'],
  })
}

export const logout = () => {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export const login = () => {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export const nearToYocto = near => {
  return utils.format.parseNearAmount(near)
}

const provider = new providers.JsonRpcProvider(
  "https://archival-rpc.testnet.near.org"
);

export const getTxState = async (txHash, accountId) => {
  return await provider.txStatus(txHash, accountId);
}