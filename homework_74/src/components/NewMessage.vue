<template>
    <div>Создать новое сообщение на подпись</div>   
    <div>
        <input v-model="targetAddress" placeholder="Введите адрес контракта" type="text">
    </div>
    <div>
        <input v-model="functionName" placeholder="Введите имя функции" type="text">
    </div>
    <div>
        <input v-model="argsCount" placeholder="Введите кол-во аргументов" type="text">
    </div>
    <input-args @changeType="changeType" @inputArg="inputArg" v-for="id in argsId" :id = "id">
    </input-args>
    <div>
        <button @click="nMessage">rrr</button>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'new-message',
    data() {
        return {
            targetAddress: "",
            functionName: "",
            argsCount: "",
            argsId: [],
            arguments: {
                types: [],
                args: []
            }
        }
    },
    methods: {   
        ...mapActions({
            newMessage: "newMessage"
        }),
        changeType(type) {
            this.arguments.types[type.id] = type.type;
        },
        inputArg(arg) {
            this.arguments.args[arg.id] = arg.arg;
        },
        async nMessage() {
            await this.newMessage([this.targetAddress, this.functionName, this.arguments])
        }
    },
    watch: {
        argsCount() {
            this.argsId = [];
            for (let i = 0; i < this.argsCount; i++) {
                this.argsId.push(i);
            }
            this.arguments.types = new Array(this.argsCount);
            this.arguments.args = new Array(this.argsCount);
        }
    }
}
</script>

<style>

</style>