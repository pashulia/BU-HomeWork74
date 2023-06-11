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
</template>

<script>
import { mapActions } from 'vuex';

export default {
    method: {
        ...mapActions({
            connectionWallet: "connectionWallet"
        })
    }
}
</script>

<style>

</style>