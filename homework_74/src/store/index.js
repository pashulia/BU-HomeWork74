import { createStore } from 'vuex';

const ethers = require('ethers');

export default createStore({
    state: {
        provider: {},
        admins: [],
        admin: false,
        address: "",
        chainId: "",
        multisigAddress: "0x37C44dB964909b6F58aBb209A5e458EdF6C7F614",
        multisig: {},
        // targetAddress: "",
        // target: {},
        message: {},
        newMessage: false,
        enoughSignatures: false,
    },
    getters: {
        
    },
    mutations: {
        addBlock(state, newBlock){
            state.block.unshift(newBlock);
        },
    },
    actions: {
        async connectionWallet({state}) {
            if (typeof window.ethereum !== 'undefined') {
                console.log("Etherium client installed!");
                if (ethereum.isMetaMask === true) {
                    console.log("MetaMask connected!");
                    if (ethereum.isConnected() !== true) {
                        console.log("MetaMask is not connected!");
                        await ethereum.enable();
                    }
                    console.log("MetaMask connected");
                } else {
                    alert ("Metamask is not installed!")
                }
            }  else {
                alert ("Ethereum client is not installed!")
            }
            // подключаем аккаунт
            await ethereum.request({ method: "eth_requestAccounts" })
            .then(accounts => {
                state.address = ethers.utils.getAddress(accounts[0]);
                if (state.admins.includes(state.address)) {
                    state.admin = true;
                } else {
                    state.admin = false;
                }
                console.log(`Account ${state.address} connected`);
            })
            //создаем провайдера
            state.provider = new ethers.providers.Web3Provider(ethereum);
            // state.provider = ethers.getDefaultProvider(ethereum);
            console.log(state.provider);
            // получаем параметры сети
            state.chainId = await window.ethereum.request({ method: "eth_chainId" });
            console.log("chainId: ", state.chainId);

            ethereum.on("accountsChanged", (accounts) => {
                state.address = ethers.utils.getAddress(accounts[0]);
                if (state.admins.includes(state.address)) {
                    state.admin = true;
                } else {
                    state.admin = false;
                }
                console.log(`Accounts changed to ${state.address}`);
            })

            ethereum.on("chainChanged", async (chainId) => {
                // создаем провайдера
                state.provider = new ethers.providers.Web3Provider(ethereum);
                // получаем параметры сети
                state.chainId = await window.ethereum.request({ method: "eth_chainId" });
                console.log("chainId changed to ", state.chainId);
            })
        },
        async newMessage({state}, args) {
            const [targetAddress, functionName, functionArgs] = args;
            // functionArgs = {
            //     types: [],
            //     args: []
            // }
            // собираем сигнатуру целевой функции
            const functionSignature = "function " + functionName + "(";
            for(let i = 0; i < functionSignature.types.length; i++) {
                functionSignature += functionSignature.types[i] + ",";
            }
            functionSignature += functionSignature.slice(0, -1) + ")";
            console.log("functionSignature: ", functionSignature);

            // собираем интерфейс целевого контракта
            const iTarget = ethers.utils.Interface([functionSignature]);
            console.log("iTarget: ", iTarget);

            // Собираем calldata
            const payload = iTarget.encodeFunctionData(functionName, functionArgs.values);
            console.log("payload: ", payload);

            // Получаем nonce
            // Для начала получаем провайдера и инстанс контракта
            const provider = ethers.getDefaultProvider(ethers.BigNumber.from(state.chainId).toNumber());
            state.multisig = new ethers.Contract(state.multisigAddress, multisigABI, provider);
            const nonce = await state.multisig.nonce();
            console.log(nonce);

            // Собираем сообщение
            const message = ethers.utils.arrayify(ethers.utils.silidityPack(
                ["uint256", "address", "address", "bytes"],
                [nonce, state.multisigAddress, targetAddress, payload]
            ));
            console.log("message: ", message);

            // получаем подписанта
            const signer = state.provider.getSigner();
            console.log("signer: ", signer);

            // подписываем сообщение
            const rawSignature = await signer.signMessage(message);

            // вытаскиваем саму подпись
            const signature = ethers.utils.splitSignature(rawSignature); 

            // вытаскиваем v r s и добавляем в структуру с массивами
            let signatures = { 
                v: [signature.v], 
                r: [signature.r], 
                s: [signature.s]
            };
            
            // сохроняем параметры сообщения на подпись и сами подписи
            state.message = {
                targetAddress: targetAddress,
                functionName: functionName,
                functionArgs: functionArgs,
                nonce: nonce,
                payload: payload,
                message: message,
                signers: [state.address],
                signatures: signatures
            }

            // говорим, что есть новое сообщение
            state.newMessage = true;

            console.log("state.message: ", state.message);

        },
        async signMessage({state}) {
            // получаем подписанта
            const signer = state.provider.getSigner();
            console.log("signer: ", signer);

            // подписываем сообщение
            const rawSignature = await signer.signMessage(state.message.message);

            // вытаскиваем саму подпись
            const signature = ethers.utils.splitSignature(rawSignature); 

            // добавляем подпись к уже имеющимся
            state.message.signatures.v.push(signature.v);
            state.message.signatures.r.push(signature.r);
            state.message.signatures.s.push(signature.s);
            state.message.signers.push(signer.address);

            console.log("New sign: ", signer.address);
            console.log("Sign count: ", state.message.signers.length);
            if(state.message.signers.length > state.admins.length / 2) {
                console.log("enough signatures");
                ethers.enoughSignatures = true;
            }
        },
        async sendMessage({state}) {
            const iMultisig = new ethers.utils.Interface(multisigABI);
            // собираем calldata для функции verify
            const data = iMultisig.encodeFunctionData("verify", 
            [
                state.message.nonce,
                state.message.targetAddress,
                state.message.payload,
                state.message.signatures.v,
                state.message.signatures.r,
                state.message.signatures.s
            ]);
            const txHash = await window.ethereum.request({
                method: "eth_transaction",
                params: [{
                    from: state.address,
                    to: state.multisigAddress,
                    data: data
                }]
            })
            console.log("txHash: ", txHash);

            // ждём квитанцию
            const provider = ethers.getDefaultProvider(ethers.BigNumber.from(state.chainId).toNumber())
            const receipt = await provider.waitForTransaction(txHash);
            console.log("receipt: ", receipt);

            const target = new ethers.Contract(state.message.targetAddress, state.targetAddress, state.targetABI, provider);
            const number = await target.number();
            console.log("number: ", number);

            state.newMessage = false;
            state.enoughSignatures = false;
        }
    },
    modules: {

    } 
})