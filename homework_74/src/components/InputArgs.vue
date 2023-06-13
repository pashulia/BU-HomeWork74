<template>
    <div>Это форма для ввода аргумента ID: {{ id }}</div>
    <select-type @changeType = "changeType" :options="options" ></select-type>
    <input v-model="argument" placeholder="Введите значение аргумента" type="text">
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'input-args',
    data() {
        return {
            argument: "",
            options: ["string", "uint256"]
        }
    },
    props: {
        id: {
            type: Number,
        }
    },
    methods: {
        ...mapActions({
            
        }),
        changeType(type) {
            const types = {
                id: this.id,
                type: type
            };
            this.$emit("changeType", types);
        }
    },
    watch: {
        argument() {
            const arg = {
                id: this.id,
                arg: this.argument
            };
            this.$emit("inputArg", arg);
        }
    }
}
</script>

<style>

</style>