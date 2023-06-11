<template>
    <ul>
        <li>
            <a href='/'>Главная страница</a>
        </li>
        <li>
            <input v-model="blockNumberOrHash" placeholder="номер блока или хэш" type="text">
    <button @click="$router.push(`/block/${this.blockNumberOrHash}`)">Открыть</button>
        </li>
        <li>
            <input v-model="transactionHash" placeholder="хэш транзакции" type="text">
    <button @click="$router.push(`/block/tx/${this.transactionHash}`)">ОткрытьTx</button>
        </li>
        <li>
            <a href="https://goerli.etherscan.io/" target="__blank">etherscan</a>
        </li>
    </ul>
    
    
    
</template>

<script>
export default {
    name: "navbar",
    data() {
        return{
            blockNumberOrHash: ""
        }
    }
}
</script>

<style scoped>
    ul {
        border: 1px solid black;
        padding: 10px;
        border-radius: 5px;
        list-style-type: none;
    }
    li {
        margin-bottom: 10px;
        
    }
    input {
        background-color: rgb(223, 225, 226);
    }
    button {
        margin-left: 5px;
    }
</style>
