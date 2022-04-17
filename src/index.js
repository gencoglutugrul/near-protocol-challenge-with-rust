import 'regenerator-runtime/runtime'

import { getTxState, initContract, login, logout, nearToYocto } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

const submitButton = document.querySelector('form button')
const tipAmount = document.querySelector("#tip_amount")

document.querySelector('form').onsubmit = async (event) => {
  event.preventDefault()
  
  const { fieldset, name, tip_amount } = event.target.elements
  fieldset.disabled = true

  if(document.querySelector('input#tip').checked){
    await sendTip(name.value, tip_amount.value)
  } else{  
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
  }

  submitButton.disabled = true

  document.querySelector('[data-behavior=notification] #method_name').innerHTML = 
    document.querySelector('input#tip').checked ? "send_tip" : "get_greeting"
  document.querySelector('[data-behavior=notification]').style.display = 'block'

  setTimeout(() => {
    document.querySelector('[data-behavior=notification]').style.display = 'none'
  }, 11000)
}

document.querySelector('input#tip').onchange = e => {
  if (e.target.checked) {
    tipAmount.disabled = false
  } else {
    tipAmount.disabled = true
  }
}

tipAmount.oninput = e => {
  if(e.target.value != "")
    submitButton.disabled = false
  if (e.target.value < 1) {
    e.target.value = 1;
  }
}

document.querySelector('input#name').oninput = e => {
  if (e.target.value !== "") {
    submitButton.disabled = false
  } else {
    submitButton.disabled = true
  }
}

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout

const signedOutFlow = () => {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

const signedInFlow = () => {

  if(location.search.match(/transactionHashes/)){
    const params = new URLSearchParams(location.search)
    if(localStorage.getItem('transactionHash') != params.get("transactionHashes")){
      localStorage.setItem('transactionHash', params.get("transactionHashes"));
      getTxState(params.get("transactionHashes"), window.accountId).then((res) => {
        if(res.status.SuccessValue){
          document.querySelector('[data-behavior=name]').innerText = "Hello, " + 
            localStorage.getItem("latestName") + 
            ". Thank you for coffee."
        }
      })
    }
  }

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


const showGreeting = async (name) => {
  document.querySelector('[data-behavior=name]').innerText = await contract.get_greeting({ name })
}


const sendTip = async (name, amount) => {
    localStorage.setItem("latestName", name)
    await contract.send_tip({ name }, 300000000000000, nearToYocto(amount))
}


window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)

