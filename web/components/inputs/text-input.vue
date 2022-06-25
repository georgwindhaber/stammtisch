<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <input
    class="focus:outline-none"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
