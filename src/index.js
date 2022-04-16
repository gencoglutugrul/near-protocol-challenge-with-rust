import 'regenerator-runtime/runtime'

import { initContract, login, logout } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

const submitButton = document.querySelector('form button')

document.querySelector('form').onsubmit = async (event) => {
  event.preventDefault()
  
  const { fieldset, name } = event.target.elements
  fieldset.disabled = true

  try {
    await showGreeting(name.value);
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  } finally {
    fieldset.disabled = false
  }

  submitButton.disabled = true

  document.querySelector('[data-behavior=notification]').style.display = 'block'

  setTimeout(() => {
    document.querySelector('[data-behavior=notification]').style.display = 'none'
  }, 11000)
}

document.querySelector('input#name').oninput = (event) => {
  if (event.target.value !== "") {
    submitButton.disabled = false
  } else {
    submitButton.disabled = true
  }
}

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout

function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block'

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)')
  accountLink.href = accountLink.href + window.accountId
  accountLink.innerText = '@' + window.accountId
  const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)')
  contractLink.href = contractLink.href + window.contract.contractId
  contractLink.innerText = '@' + window.contract.contractId

  accountLink.href = accountLink.href.replace('testnet', networkId)
  contractLink.href = contractLink.href.replace('testnet', networkId)
}


async function showGreeting(name) {
  let response = await contract.get_greeting({ name })
  document.querySelectorAll('[data-behavior=name]').forEach(el => {
    el.innerText = response
    el.value = response
  })
}


window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)
