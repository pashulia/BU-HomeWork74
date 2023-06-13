<template>
    <div>"Это форма для ввода" аргумента</div>
    <select @change="changeOption">
        <option value="">Выберите тип данных</option>
        <option v-for="option in options">{{ option }}</option>
    </select>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'select-type',
    props: {
        options: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        changeOption(event) {
            this.$emit("changeType", event.target.value);
        }
    }
}
</script>

<style>

</style>