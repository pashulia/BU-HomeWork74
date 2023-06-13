<template>
    <div>
        <button @click="connectionWallet">
            Подключить Metamask
        </button>
        <div>
            Адрес пользователя: {{ $store.state.address }}
        </div>
        <div>
            ID цепочки: {{ $store.state.chainId }}
        </div>
        <div>
            Пользователь админ: {{ $store.state.admin }}
        </div>
    </div>
    <new-message v-if="$store.state.admin==true && $store.state.newMessage==false"></new-message>
    <message-for-sign v-if="$store.state.admin==true && $store.state.newMessage==true"></message-for-sign>

</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions({
            connectionWallet: "connectionWallet"
        })
    }
}
</script>

<style>

</style>