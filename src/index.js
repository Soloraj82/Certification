window.Buffer = require('buffer/').Buffer;

const Tx = require('ethereumjs-tx')

const Web3 = require("web3")

// update this infura URL
const web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/bb8261d4502d4fd887c614d7974e882e"))

web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ",result);
});

// update this contract address with your contract address
//const address = "0x85D6009785322C5ef78625D45513760Ee5999e5E";
const address = "0x5C010314350bB853f66e19D03D6f97B7b8140a7D";
var ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "certCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "certs",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "graduateYear",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_certName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_graduateYear",
          "type": "uint256"
        }
      ],
      "name": "setCertificate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_certId",
          "type": "uint256"
        }
      ],
      "name": "getCertificate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getcertCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]
    
var certificationContract = new web3.eth.Contract(ABI, address);

async function initContractLogic() {

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    console.log("Account : " + account)
     window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        console.log(accounts[0])
       });

// update this private key
    const privateKey1 = Buffer.from('a03dea466da1f527506c16fb31817f8492a61f8a09a564c8eaec1de030080fec', 'hex');
    
    $(document).ready(function(){

    $('#button').on('click', function() { 

      //$("#myForm").submit(function() {

        console.log('Name is ' + $('#formName').val().trim());
        console.log('Certificate is ' + $('#formCertificateName').val().trim());
        console.log('Graduate year is ' + $('#formGraduateYear').val().trim());

        const myData = certificationContract.methods.setCertificate($('#formName').val().trim(), $('#formCertificateName').val().trim(), $('#formGraduateYear').val().trim()).encodeABI();

        //console.log('Account is ', account);

        web3.eth.getTransactionCount(account, (err, txCount) => {
        // Build the transaction
    
        const txObject = {
        nonce:    web3.utils.toHex(txCount),
        to:       address,
        value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
        gasLimit: web3.utils.toHex(2100000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
        data: myData  
        } //txObject

        console.log("Error : " + err);

        // Sign the transaction
        const tx = new Tx(txObject);
        tx.sign(privateKey1);

        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');

        // Broadcast the transaction
        const transaction = web3.eth.sendSignedTransaction(raw, (err, tx) => {
        console.log("Transaction : " + tx);

        }); //const transaction

      //}); //submit

    }); //on

  //updateHtmlData();

  });  //click button


  }); //document ready
} //initContractLogic

initContractLogic();

function updateHtmlData() {  

                                 //call function
  certificationContract.methods.getCertificate(1).call(function(error, result){
      if (error) {
          console.log(error, 'error')
      } else {
          console.log(result, 'result');
          //$('#name').val(result[0]);
          //$('#age').val(result[1]);
          //$('#certificate').html(`${result[0]} ${result[1]} ${result[2]} ${result[3]}`);
          $('#certificate').html(result[0] + ' ' + result[1] + ' ' + result[2] + ' ' + result[3]);
      }
  });
}